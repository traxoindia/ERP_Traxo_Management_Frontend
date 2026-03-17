import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Filter,
  Search,
  Plus,
  Video,
  MessageSquare,
  Star,
  Award,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackNavbar from './BackNavbar';
import { useNavigate } from 'react-router-dom';

const API_BASE = "https://api.wemis.in/api/careers";

const Interviews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('SCREENING');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'schedule'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interview scheduling state
  const [scheduleData, setScheduleData] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewType: 'TECHNICAL_ROUND',
    interviewerName: '',
    interviewLink: '',
    notes: ''
  });

  // Available interview stages
  const interviewStages = [
    { value: 'SCREENING', label: 'Screening', color: 'purple' },
    { value: 'HR_ROUND', label: 'HR Round', color: 'blue' },
    { value: 'TECHNICAL_ROUND', label: 'Technical Round', color: 'indigo' },
    { value: 'MANAGERIAL_ROUND', label: 'Managerial Round', color: 'orange' },
    { value: 'SELECTED', label: 'Selected', color: 'green' },
    { value: 'REJECTED', label: 'Rejected', color: 'red' }
  ];

  // Fetch candidates by stage
  const fetchCandidatesByStage = async (stage) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/applications/stage/${stage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log(`${stage} Candidates:`, response.data);
      
      const candidatesData = response.data?.data || response.data;
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
      
    } catch (err) {
      console.error(`Fetch ${stage} Candidates Error:`, err);
      setError(`Failed to fetch ${stage} candidates.`);
    } finally {
      setLoading(false);
    }
  };

  // Move candidate to next stage
  const moveToNextStage = async (candidate, nextStage, event) => {
    if (event) {
      event.stopPropagation();
    }

    if (nextStage === 'REJECTED') {
      if (!window.confirm(`Are you sure you want to reject ${candidate.fullName}?`)) {
        return;
      }
    }

    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      await axios.put(`${API_BASE}/applications/${candidate.id}/stage?stage=${nextStage}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Refresh the current stage candidates
      fetchCandidatesByStage(selectedStage);
      
      if (selectedCandidate && selectedCandidate.id === candidate.id) {
        setSelectedCandidate(null);
        setViewMode('list');
      }

      alert(`${candidate.fullName} moved to ${nextStage} stage`);
      
    } catch (err) {
      console.error("Move to Next Stage Error:", err);
      alert("Failed to move candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Schedule interview
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    
    if (!selectedCandidate) return;
    
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      // First move to the selected round
      await axios.put(`${API_BASE}/applications/${selectedCandidate.id}/stage?stage=${scheduleData.interviewType}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Here you would typically also save the interview details to a separate endpoint
      // For now, we'll just show success and refresh
      
      alert(`Interview scheduled for ${selectedCandidate.fullName} on ${scheduleData.interviewDate} at ${scheduleData.interviewTime}`);
      
      setViewMode('list');
      setSelectedCandidate(null);
      setScheduleData({
        interviewDate: '',
        interviewTime: '',
        interviewType: 'TECHNICAL_ROUND',
        interviewerName: '',
        interviewLink: '',
        notes: ''
      });
      
      fetchCandidatesByStage(selectedStage);
      
    } catch (err) {
      console.error("Schedule Interview Error:", err);
      alert("Failed to schedule interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // View candidate details
  const viewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('detail');
  };

  // Show schedule form
  const showScheduleForm = (candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('schedule');
  };

  // Back to list
  const backToList = () => {
    setViewMode('list');
    setSelectedCandidate(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get stage color
  const getStageColor = (stage) => {
    const stageObj = interviewStages.find(s => s.value === stage);
    return stageObj ? stageObj.color : 'gray';
  };

  // Get next stages based on current stage
  const getNextStages = (currentStage) => {
    const stageOrder = ['SCREENING', 'HR_ROUND', 'TECHNICAL_ROUND', 'MANAGERIAL_ROUND', 'SELECTED'];
    const currentIndex = stageOrder.indexOf(currentStage);
    
    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
      return [];
    }
    
    return [stageOrder[currentIndex + 1]];
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(cand => 
    cand.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cand.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cand.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load initial data
  useEffect(() => {
    fetchCandidatesByStage(selectedStage);
  }, [selectedStage]);

  return (
    <>
      <BackNavbar />

      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        {/* HEADER */}
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="max-w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              {viewMode !== 'list' && (
                <button 
                  onClick={backToList}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to {viewMode === 'schedule' ? 'Candidates' : 'List'}
                </button>
              )}
              <div>
                <h1 className="text-2xl font-light tracking-tight text-black uppercase">
                  {viewMode === 'list' ? 'Interview Pipeline' : 
                   viewMode === 'schedule' ? 'Schedule Interview' : 
                   selectedCandidate?.fullName || 'Candidate Profile'}
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                  {viewMode === 'list' ? 'Manage interview rounds and stages' : 
                   viewMode === 'schedule' ? 'Set up interview details' : 
                   'Review candidate information'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              Back to Jobs
            </button>
          </div>
        </div>

        <div className="max-w-full mx-auto px-6 py-8">
          {/* STAGE FILTERS */}
          {viewMode === 'list' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {interviewStages.map((stage) => (
                  <button
                    key={stage.value}
                    onClick={() => setSelectedStage(stage.value)}
                    className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all whitespace-nowrap
                      ${selectedStage === stage.value 
                        ? `bg-${stage.color}-600 text-white` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>

              {/* SEARCH */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm border-b border-gray-100 focus-within:border-black transition-colors">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input
                    type="text"
                    placeholder={`SEARCH ${selectedStage} CANDIDATES...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-6 pr-4 py-2 text-[10px] uppercase tracking-widest outline-none bg-transparent"
                  />
                </div>
                <span className="text-[10px] text-gray-400">
                  {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-sm flex items-center gap-3">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-xs text-red-600">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <XCircle size={14} className="text-red-400" />
              </button>
            </div>
          )}

          {/* CONTENT AREA */}
          <div className="border border-gray-100 rounded-sm overflow-hidden">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-[10px] uppercase tracking-widest">Loading candidates...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* LIST VIEW */}
                {viewMode === 'list' && (
                  <motion.table
                    key="list-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full text-left text-sm"
                  >
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Candidate</th>
                        <th className="px-6 py-4 font-bold">Contact</th>
                        <th className="px-6 py-4 font-bold">Position</th>
                        <th className="px-6 py-4 font-bold">Experience</th>
                        <th className="px-6 py-4 font-bold">Applied Date</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {filteredCandidates.length > 0 ? filteredCandidates.map((candidate) => {
                        const nextStages = getNextStages(candidate.status || selectedStage);
                        
                        return (
                          <tr 
                            key={candidate.id} 
                            className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                            onClick={() => viewCandidateDetails(candidate)}
                          >
                            <td className="px-6 py-5">
                              <p className="font-bold text-black uppercase tracking-tight">
                                {candidate.fullName || "Unnamed"}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {candidate.currentJobTitle || "Position not specified"}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-gray-700 text-xs flex items-center gap-1">
                                <Mail size={10} /> {candidate.emailAddress || "No email"}
                              </p>
                              <p className="text-gray-400 text-[10px] mt-0.5 flex items-center gap-1">
                                <Phone size={10} /> {candidate.phoneNumber || "No phone"}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-gray-600">
                              {candidate.appliedPosition || "N/A"}
                            </td>
                            <td className="px-6 py-5 text-gray-600">
                              {candidate.totalExperience || "0"} years
                            </td>
                            <td className="px-6 py-5 text-gray-400 text-[10px]">
                              {formatDate(candidate.appliedAt)}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewCandidateDetails(candidate);
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                                >
                                  View
                                </button>
                                
                                {/* Schedule Interview button for non-terminal stages */}
                                {candidate.status !== 'SELECTED' && candidate.status !== 'REJECTED' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showScheduleForm(candidate);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-blue-600 text-white px-3 py-1 hover:bg-blue-700 transition-all flex items-center gap-1"
                                  >
                                    <Calendar size={12} />
                                    Schedule
                                  </button>
                                )}
                                
                                {/* Next Stage button */}
                                {nextStages.length > 0 && (
                                  <button
                                    onClick={(e) => moveToNextStage(candidate, nextStages[0], e)}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white px-3 py-1 hover:bg-green-700 transition-all"
                                  >
                                    Move to {nextStages[0].replace('_', ' ')}
                                  </button>
                                )}
                                
                                {/* Reject button (unless already rejected or selected) */}
                                {candidate.status !== 'REJECTED' && candidate.status !== 'SELECTED' && (
                                  <button
                                    onClick={(e) => moveToNextStage(candidate, 'REJECTED', e)}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-red-600 text-white px-3 py-1 hover:bg-red-700 transition-all flex items-center gap-1"
                                  >
                                    <UserX size={12} />
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                            {searchTerm ? "No matching candidates found." : `No candidates in ${selectedStage} stage.`}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </motion.table>
                )}

                {/* DETAIL VIEW */}
                {viewMode === 'detail' && selectedCandidate && (
                  <motion.div
                    key="detail-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8"
                  >
                    {/* Candidate Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-light mb-2">{selectedCandidate.fullName}</h2>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Mail size={12} /> {selectedCandidate.emailAddress}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {selectedCandidate.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => showScheduleForm(selectedCandidate)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                        >
                          <Calendar size={14} />
                          Schedule Interview
                        </button>
                      </div>
                    </div>

                    {/* Current Stage Badge */}
                    <div className="mb-6">
                      <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-${getStageColor(selectedCandidate.status)}-100 text-${getStageColor(selectedCandidate.status)}-700`}>
                        Current Stage: {selectedCandidate.status || selectedStage}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3 mb-8">
                      {getNextStages(selectedCandidate.status || selectedStage).map(stage => (
                        <button
                          key={stage}
                          onClick={() => moveToNextStage(selectedCandidate, stage)}
                          className="px-4 py-2 bg-green-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all"
                        >
                          Move to {stage.replace('_', ' ')}
                        </button>
                      ))}
                      {selectedCandidate.status !== 'REJECTED' && selectedCandidate.status !== 'SELECTED' && (
                        <button
                          onClick={() => moveToNextStage(selectedCandidate, 'REJECTED')}
                          className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all"
                        >
                          Reject Candidate
                        </button>
                      )}
                    </div>

                    {/* Personal Information */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Personal Information</h3>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Date of Birth</p>
                        <p className="text-sm">{formatDate(selectedCandidate.dateOfBirth)}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Gender</p>
                        <p className="text-sm">{selectedCandidate.gender || "Not specified"}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Current Address</p>
                        <p className="text-sm">{selectedCandidate.currentAddress || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Professional Details</h3>
                    <div className="grid grid-cols-4 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Expected Salary</p>
                        <p className="text-sm font-medium">₹{selectedCandidate.expectedSalary || "0"}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Notice Period</p>
                        <p className="text-sm">{selectedCandidate.noticePeriod || "0"} days</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Available From</p>
                        <p className="text-sm">{formatDate(selectedCandidate.availableStartDate)}</p>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Willing to Relocate</p>
                        <p className="text-sm">{selectedCandidate.willingToRelocate ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    {/* Education */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Education</h3>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="border border-gray-100 p-4 col-span-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Highest Qualification</p>
                        <p className="text-sm font-medium">{selectedCandidate.highestQualification}</p>
                      </div>
                      <div className="border border-gray-100 p-4 col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Degree & University</p>
                        <p className="text-sm">
                          {selectedCandidate.degreeName} - {selectedCandidate.universityCollege}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedCandidate.fieldOfStudy} • Graduated {selectedCandidate.graduationYear} • GPA: {selectedCandidate.percentageGPA}
                        </p>
                      </div>
                    </div>

                    {/* Experience */}
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Work Experience</h3>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Total Experience</p>
                        <p className="text-lg font-light">{selectedCandidate.totalExperience} years</p>
                      </div>
                      <div className="border border-gray-100 p-4 col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Current Position</p>
                        <p className="text-sm font-medium">{selectedCandidate.currentJobTitle || "Not specified"}</p>
                        <p className="text-xs text-gray-500">{selectedCandidate.currentCompany || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.keySkills?.split(',').map((skill, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wider">
                              {skill.trim()}
                            </span>
                          )) || "Not specified"}
                        </div>
                      </div>
                      <div className="border border-gray-100 p-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Technical Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.technicalSkills?.split(',').map((skill, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wider">
                              {skill.trim()}
                            </span>
                          )) || "Not specified"}
                        </div>
                      </div>
                    </div>

                    {/* Application Metadata */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                      <span>Application ID: {selectedCandidate.id}</span>
                      <span>Applied: {formatDate(selectedCandidate.appliedAt)}</span>
                    </div>
                  </motion.div>
                )}

                {/* SCHEDULE INTERVIEW VIEW */}
                {viewMode === 'schedule' && selectedCandidate && (
                  <motion.div
                    key="schedule-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8"
                  >
                    <h2 className="text-xl font-light mb-6">Schedule Interview for {selectedCandidate.fullName}</h2>
                    
                    <form onSubmit={handleScheduleInterview} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interview Date</label>
                          <input
                            type="date"
                            required
                            className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                            value={scheduleData.interviewDate}
                            onChange={(e) => setScheduleData({...scheduleData, interviewDate: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interview Time</label>
                          <input
                            type="time"
                            required
                            className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                            value={scheduleData.interviewTime}
                            onChange={(e) => setScheduleData({...scheduleData, interviewTime: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interview Round</label>
                        <select
                          required
                          className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                          value={scheduleData.interviewType}
                          onChange={(e) => setScheduleData({...scheduleData, interviewType: e.target.value})}
                        >
                          <option value="HR_ROUND">HR Round</option>
                          <option value="TECHNICAL_ROUND">Technical Round</option>
                          <option value="MANAGERIAL_ROUND">Managerial Round</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interviewer Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                          placeholder="e.g. John Smith"
                          value={scheduleData.interviewerName}
                          onChange={(e) => setScheduleData({...scheduleData, interviewerName: e.target.value})}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interview Link (Optional)</label>
                        <input
                          type="url"
                          className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                          placeholder="https://meet.google.com/..."
                          value={scheduleData.interviewLink}
                          onChange={(e) => setScheduleData({...scheduleData, interviewLink: e.target.value})}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes / Instructions</label>
                        <textarea
                          rows="3"
                          className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                          placeholder="Add any notes or instructions for the interview..."
                          value={scheduleData.notes}
                          onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                        ></textarea>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                        >
                          {loading ? "Scheduling..." : "Schedule Interview"}
                        </button>
                        <button
                          type="button"
                          onClick={backToList}
                          className="px-6 py-3 border border-gray-200 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Interviews;