import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Search, 
  X, 
  Loader2,
  AlertCircle,
  Download,
  Mail,
  Phone,
  ChevronLeft,
  UserCheck,
  UserX,
  UserPlus,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackNavbar from "./BackNavbar";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://api.wemis.in/api/careers";

const PostJobPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posted");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data States
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'detail'

  // Form State
  const [formData, setFormData] = useState({
    jobTitle: "",
    position: "",
    location: "",
    description: ""
  });

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // --- API CALLS ---

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Jobs API Response:", response.data);

      const jobsData = response.data?.data || response.data;
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
      if (err.response?.status === 403) {
        setError("Session expired or unauthorized. Please re-login.");
      } else {
        setError("Failed to fetch jobs. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(`${API_BASE}/jobs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setIsModalOpen(false);
      setFormData({ jobTitle: "", position: "", location: "", description: "" });
      fetchJobs(); 
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access Denied: You do not have permission to post jobs.");
      } else {
        alert("Error posting job. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (job) => {
    setActiveTab("applicants");
    setSelectedJob(job);
    setViewMode("list");
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(`${API_BASE}/applications/${job.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Applicants API Response:", response.data);
      
      const applicantsData = response.data?.data || response.data;
      setApplicants(Array.isArray(applicantsData) ? applicantsData : []);
      
    } catch (err) {
      console.error("Fetch Applicants Error:", err);
      setError("Failed to fetch applicants.");
    } finally {
      setLoading(false);
    }
  };

  // Move candidate to Screening - API CALL
  // PUT /api/careers/applications/{id}/screening
  const handleMoveToScreening = async (applicant, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      // API Call to move candidate to screening
      const response = await axios.put(`${API_BASE}/applications/${applicant.id}/screening`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Screening API Response:", response.data);
      // Response should be: { "stage": "SCREENING" }

      // Update local state with new status from DB
      setApplicants(prevApplicants => 
        prevApplicants.map(app => 
          app.id === applicant.id 
            ? { ...app, status: "SCREENING" } 
            : app
        )
      );

      if (selectedApplicant && selectedApplicant.id === applicant.id) {
        setSelectedApplicant(prev => ({ ...prev, status: "SCREENING" }));
      }

      alert(`${applicant.fullName} has been moved to Screening stage`);
      
    } catch (err) {
      console.error("Move to Screening Error:", err);
      alert("Failed to move applicant to screening. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reject candidate - API CALL
  // PUT /api/careers/applications/{id}/stage?stage=REJECTED
  const handleRejectCandidate = async (applicant, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (!window.confirm(`Are you sure you want to reject ${applicant.fullName}?`)) {
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      // API Call to reject candidate
      const response = await axios.put(`${API_BASE}/applications/${applicant.id}/stage?stage=REJECTED`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Reject API Response:", response.data);

      // Update local state
      setApplicants(prevApplicants => 
        prevApplicants.map(app => 
          app.id === applicant.id 
            ? { ...app, status: "REJECTED" } 
            : app
        )
      );

      if (selectedApplicant && selectedApplicant.id === applicant.id) {
        setSelectedApplicant(prev => ({ ...prev, status: "REJECTED" }));
      }

      alert(`${applicant.fullName} has been rejected`);
      
    } catch (err) {
      console.error("Reject Candidate Error:", err);
      alert("Failed to reject applicant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Interviews page
  const goToInterviews = () => {
    navigate('/jobs/interviews');
  };

  const viewApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setViewMode("detail");
  };

  const backToApplicantsList = () => {
    setViewMode("list");
    setSelectedApplicant(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getResumeUrl = (cvFileUrl) => {
    if (!cvFileUrl) return null;
    if (cvFileUrl.startsWith('http')) return cvFileUrl;
    return `${API_BASE}/resumes/${cvFileUrl}`;
  };

  const downloadResume = (cvFileUrl) => {
    const url = getResumeUrl(cvFileUrl);
    if (url) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter applicants based on search
  const filteredApplicants = applicants.filter(app => 
    app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phoneNumber?.includes(searchTerm) ||
    app.currentAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color based on status from DB
  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPLIED':
        return 'bg-green-50 text-green-700';
      case 'SCREENING':
        return 'bg-purple-50 text-purple-700';
      case 'HR_ROUND':
        return 'bg-blue-50 text-blue-700';
      case 'TECHNICAL_ROUND':
        return 'bg-indigo-50 text-indigo-700';
      case 'MANAGERIAL_ROUND':
        return 'bg-orange-50 text-orange-700';
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-700';
      case 'REJECTED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <>
      <BackNavbar />

      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        {/* HEADER */}
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="max-w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              {activeTab === "applicants" && viewMode === "detail" && (
                <button 
                  onClick={backToApplicantsList}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to Applicants
                </button>
              )}
              <div>
                <h1 className="text-2xl font-light tracking-tight text-black uppercase">
                  {activeTab === "posted" ? "Recruitment" : 
                   viewMode === "detail" ? "Applicant Profile" : "Applicants"}
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                  {activeTab === "posted" ? "Hiring Pipeline & Talent Pool" :
                   viewMode === "detail" ? selectedApplicant?.fullName || "Applicant Details" :
                   selectedJob?.jobTitle ? `Applications for ${selectedJob.jobTitle}` : "All Applications"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "posted" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                  <Plus size={14} />
                  Post Position
                </button>
              )}
              
              {/* Interview Dashboard Button */}
              <button
                onClick={goToInterviews}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                <UserCheck size={14} />
                Interview Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-6 py-8">
          {/* TABS */}
          <div className="flex items-center gap-8 border-b border-gray-100 mb-8">
            <button
              onClick={() => {
                setActiveTab("posted");
                setViewMode("list");
                setSelectedApplicant(null);
              }}
              className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors relative ${
                activeTab === "posted" ? "text-black" : "text-gray-300"
              }`}
            >
              Active Openings
              {activeTab === "posted" && <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button
              onClick={() => {
                if (selectedJob) {
                  setActiveTab("applicants");
                }
              }}
              className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-colors relative ${
                activeTab === "applicants" ? "text-black" : "text-gray-300"
              }`}
            >
              Applicants {selectedJob && `- ${selectedJob.jobTitle}`}
              {activeTab === "applicants" && <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          </div>

          {/* SEARCH */}
          {activeTab === "applicants" && viewMode === "list" && (
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1 max-w-sm border-b border-gray-100 focus-within:border-black transition-colors">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input
                  type="text"
                  placeholder="SEARCH APPLICANTS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-6 pr-4 py-2 text-[10px] uppercase tracking-widest outline-none bg-transparent"
                />
              </div>
              <span className="text-[10px] text-gray-400">
                {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''} found
              </span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-sm flex items-center gap-3">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-xs text-red-600">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X size={14} className="text-red-400" />
              </button>
            </div>
          )}

          {/* CONTENT AREA */}
          <div className="border border-gray-100 rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-[10px] uppercase tracking-widest">Synchronizing Data...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* POSTED JOBS TAB */}
                {activeTab === "posted" && (
                  <motion.table 
                    key="posted" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full text-left text-sm"
                  >
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Job Title / Role</th>
                        <th className="px-6 py-4 font-bold">Location</th>
                        <th className="px-6 py-4 font-bold">Position</th>
                        <th className="px-6 py-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-5">
                            <p className="font-bold text-black uppercase tracking-tight">{job.jobTitle || "Untitled Position"}</p>
                          </td>
                          <td className="px-6 py-5 text-gray-900 uppercase tracking-wider">{job.location || "Remote"}</td>
                          <td className="px-6 py-5 text-[10px] text-gray-900 uppercase tracking-tighter">{job.position || "Not Specified"}</td>
                          <td className="px-6 py-5 text-right">
                            <button 
                              onClick={() => fetchApplicants(job)}
                              className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                            >
                              View Candidates
                            </button>
                          </td>
                        </tr>
                      ))}
                      {jobs.length === 0 && !loading && (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                            No job postings found. Click "Post Position" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </motion.table>
                )}

                {/* APPLICANTS LIST VIEW */}
                {activeTab === "applicants" && viewMode === "list" && (
                  <motion.table 
                    key="applicants-list" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full text-left text-sm"
                  >
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Applicant Name</th>
                        <th className="px-6 py-4 font-bold">Contact</th>
                        <th className="px-6 py-4 font-bold">Experience</th>
                        <th className="px-6 py-4 font-bold">Applied Date</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {filteredApplicants.length > 0 ? filteredApplicants.map((app, i) => (
                        <tr key={app.id || i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-bold text-black uppercase tracking-tight">{app.fullName || "Unnamed Applicant"}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{app.currentJobTitle || "Position not specified"}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-gray-700 text-xs">{app.emailAddress || "No email"}</p>
                            <p className="text-gray-400 text-[10px] mt-0.5">{app.phoneNumber || "No phone"}</p>
                          </td>
                          <td className="px-6 py-5 text-gray-600">{app.totalExperience || "0"} years</td>
                          <td className="px-6 py-5 text-gray-400 text-[10px]">{formatDate(app.appliedAt)}</td>
                          <td className="px-6 py-5">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(app.stage)}`}>
                              {app.stage || "APPLIED"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* VIEW PROFILE BUTTON */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewApplicantDetails(app);
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all flex items-center gap-1"
                              >
                                <Eye size={12} />
                                View Profile
                              </button>
                              
                              {/* SCREENING BUTTON - Uses the screening API */}
                              <button 
                                onClick={(e) => handleMoveToScreening(app, e)}
                                disabled={app.status === 'SCREENING' || app.status === 'REJECTED' || app.status === 'SELECTED' || app.status === 'HR_ROUND' || app.status === 'TECHNICAL_ROUND' || app.status === 'MANAGERIAL_ROUND'}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 transition-all flex items-center gap-1 ${
                                  app.status === 'SCREENING' || app.status === 'REJECTED' || app.status === 'SELECTED' || app.status === 'HR_ROUND' || app.status === 'TECHNICAL_ROUND' || app.status === 'MANAGERIAL_ROUND'
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                              >
                                <UserPlus size={12} />
                                {app.status === 'SCREENING' ? 'In Screening' : 'Screening'}
                              </button>
                              
                              {/* REJECT BUTTON */}
                              <button 
                                onClick={(e) => handleRejectCandidate(app, e)}
                                disabled={app.status === 'REJECTED' || app.status === 'SELECTED'}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 transition-all flex items-center gap-1 ${
                                  app.status === 'REJECTED' || app.status === 'SELECTED'
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                              >
                                <UserX size={12} />
                                {app.status === 'REJECTED' ? 'Rejected' : 'Reject'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                            {searchTerm ? "No matching applicants found." : "No applications found for this role."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </motion.table>
                )}

                {/* APPLICANT DETAIL VIEW */}
                {activeTab === "applicants" && viewMode === "detail" && selectedApplicant && (
                  <motion.div
                    key="applicant-detail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8"
                  >
                    {/* Header with actions */}
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-light mb-2">{selectedApplicant.fullName}</h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Mail size={12} /> {selectedApplicant.emailAddress}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {selectedApplicant.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedApplicant.cvFileUrl && (
                          <button
                            onClick={() => downloadResume(selectedApplicant.cvFileUrl)}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                          >
                            <Download size={14} />
                            Download Resume
                          </button>
                        )}
                        
                        {/* SCREENING BUTTON - In detail view */}
                        <button 
                          onClick={(e) => handleMoveToScreening(selectedApplicant, e)}
                          disabled={selectedApplicant.status === 'SCREENING' || selectedApplicant.status === 'REJECTED' || selectedApplicant.status === 'SELECTED' || selectedApplicant.status === 'HR_ROUND' || selectedApplicant.status === 'TECHNICAL_ROUND' || selectedApplicant.status === 'MANAGERIAL_ROUND'}
                          className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                            selectedApplicant.status === 'SCREENING' || selectedApplicant.status === 'REJECTED' || selectedApplicant.status === 'SELECTED' || selectedApplicant.status === 'HR_ROUND' || selectedApplicant.status === 'TECHNICAL_ROUND' || selectedApplicant.status === 'MANAGERIAL_ROUND'
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          <UserPlus size={14} />
                          {selectedApplicant.status === 'SCREENING' ? 'Already in Screening' : 'Move to Screening'}
                        </button>
                        
                        {/* REJECT BUTTON - In detail view */}
                        <button 
                          onClick={(e) => handleRejectCandidate(selectedApplicant, e)}
                          disabled={selectedApplicant.status === 'REJECTED' || selectedApplicant.status === 'SELECTED'}
                          className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                            selectedApplicant.status === 'REJECTED' || selectedApplicant.status === 'SELECTED'
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          <UserX size={14} />
                          {selectedApplicant.status === 'REJECTED' ? 'Already Rejected' : 'Reject Candidate'}
                        </button>
                      </div>
                    </div>

                    {/* Status Badge - Shows current status from DB */}
                    <div className="mb-6">
                      <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${getStatusBadge(selectedApplicant.status)}`}>
                        Current Status: {selectedApplicant.status || "APPLIED"}
                      </span>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Date of Birth</p>
                        <p className="text-sm">{formatDate(selectedApplicant.dateOfBirth)}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Gender</p>
                        <p className="text-sm">{selectedApplicant.gender || "Not specified"}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Current Address</p>
                        <p className="text-sm">{selectedApplicant.currentAddress || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Professional Details</h3>
                    <div className="grid grid-cols-4 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Expected Salary</p>
                        <p className="text-sm font-medium">₹{selectedApplicant.expectedSalary || "0"}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Notice Period</p>
                        <p className="text-sm">{selectedApplicant.noticePeriod || "0"} days</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Available From</p>
                        <p className="text-sm">{formatDate(selectedApplicant.availableStartDate)}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Willing to Relocate</p>
                        <p className="text-sm">{selectedApplicant.willingToRelocate ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    {/* Education */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Education</h3>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="border border-gray-100 p-4 col-span-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Highest Qualification</p>
                        <p className="text-sm font-medium">{selectedApplicant.highestQualification}</p>
                      </div>
                      <div className="border border-gray-100 p-4 col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Degree & University</p>
                        <p className="text-sm">
                          {selectedApplicant.degreeName} - {selectedApplicant.universityCollege}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedApplicant.fieldOfStudy} • Graduated {selectedApplicant.graduationYear} • GPA: {selectedApplicant.percentageGPA}
                        </p>
                      </div>
                    </div>

                    {/* Experience */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Work Experience</h3>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Total Experience</p>
                        <p className="text-lg font-light">{selectedApplicant.totalExperience} years</p>
                      </div>
                      <div className="border border-gray-100 p-4 col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Current Position</p>
                        <p className="text-sm font-medium">{selectedApplicant.currentJobTitle || "Not specified"}</p>
                        <p className="text-xs text-gray-500">{selectedApplicant.currentCompany || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Previous Company (if exists) */}
                    {selectedApplicant.previousCompany && selectedApplicant.previousCompany !== "NA" && (
                      <div className="mb-8">
                        <div className="border border-gray-100 p-4">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Previous Company</p>
                          <p className="text-sm">{selectedApplicant.previousCompany}</p>
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.keySkills?.split(',').map((skill, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wider">
                              {skill.trim()}
                            </span>
                          )) || "Not specified"}
                        </div>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Technical Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.technicalSkills?.split(',').map((skill, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wider">
                              {skill.trim()}
                            </span>
                          )) || "Not specified"}
                        </div>
                      </div>
                    </div>

                    {/* Reference */}
                    {selectedApplicant.referenceName && (
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Reference</p>
                        <p className="text-sm">{selectedApplicant.referenceName}</p>
                      </div>
                    )}

                    {/* Application Metadata */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                      <span>Application ID: {selectedApplicant.id}</span>
                      <span>Applied: {formatDate(selectedApplicant.appliedAt)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* POST JOB MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                className="relative bg-white w-full max-w-lg border border-gray-200 shadow-2xl p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-light uppercase tracking-widest">Create Job Posting</h2>
                  <X className="cursor-pointer text-gray-400 hover:text-black" onClick={() => setIsModalOpen(false)} />
                </div>

                <form onSubmit={handlePostJob} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Title</label>
                    <input 
                      required
                      className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm" 
                      placeholder="e.g. JAVA DEVELOPER" 
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Position Type</label>
                      <input 
                        required
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm" 
                        placeholder="e.g. BACKEND ENGINEER" 
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</label>
                      <input 
                        required
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm" 
                        placeholder="e.g. BANGALORE" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Description</label>
                    <textarea 
                      required
                      rows="4" 
                      className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none" 
                      placeholder="OUTLINE REQUIREMENTS..." 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                    >
                      {loading ? "Publishing..." : "Confirm & Publish"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 border border-gray-200 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PostJobPage;