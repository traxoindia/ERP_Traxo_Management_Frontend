import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, CheckCircle, XCircle, Loader2,
  AlertCircle, FileText, Clock, Mail, Phone, Briefcase,
  GraduationCap, Shield, Send, Copy, Check, RefreshCw,
  User, CreditCard, ExternalLink, ArrowLeft, Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackNavbar from './BackNavbar';

const API_BASE = "https://api.wemis.in/api";
const FRONTEND_URL = "https://traxoerp.com";

const BGVVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bgvInProgressCandidates, setBgvInProgressCandidates] = useState([]);
  const [bgvDataMap, setBgvDataMap] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [generatingLink, setGeneratingLink] = useState({});
  const [copiedLink, setCopiedLink] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [processingBGV, setProcessingBGV] = useState({});
  const [bgvSubmissionStatus, setBgvSubmissionStatus] = useState({});
  
  // Check user role from token
  const checkUserRole = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        const role = decoded.roles?.[0] || decoded.role || 'USER';
        setUserRole(role);
        console.log("User Role:", role);
        return decoded;
      } catch(e) {
        console.error("Error decoding token:", e);
      }
    }
    return null;
  };
  
  // Fetch BGV submission status for a candidate
  const fetchBGVSubmissionStatus = async (applicationId, token) => {
    try {
      const response = await axios.get(`${API_BASE}/hr/bgv/application/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const submissionData = response.data?.data || response.data;
      return submissionData;
    } catch (err) {
      console.log(`No BGV submission for ${applicationId}:`, err.response?.status);
      return null;
    }
  };
  
  // Fetch candidates from BGV_IN_PROGRESS stage only
  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }
    
    try {
      // Fetch only BGV_IN_PROGRESS candidates
      console.log("Fetching BGV_IN_PROGRESS candidates...");
      const bgvProgressResponse = await axios.get(`${API_BASE}/careers/applications/stage/BGV_IN_PROGRESS`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const bgvProgress = bgvProgressResponse.data?.data || bgvProgressResponse.data || [];
      console.log(`Found ${bgvProgress.length} BGV_IN_PROGRESS candidates`);
      setBgvInProgressCandidates(bgvProgress);
      
      // Fetch BGV details and submission status for each candidate
      const bgvMap = {};
      const submissionStatusMap = {};
      
      for (const candidate of bgvProgress) {
        // Get BGV link info
        try {
          const bgvResponse = await axios.get(`${API_BASE}/hr/bgv/get-link/${candidate.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const linkData = bgvResponse.data?.data || bgvResponse.data;
          
          bgvMap[candidate.id] = {
            hasBGV: true,
            bgvId: linkData.bgvId || candidate.id,
            link: linkData.link || linkData,
            token: extractTokenFromLink(linkData.link || linkData),
            fullLink: linkData.link || linkData
          };
        } catch (err) {
          bgvMap[candidate.id] = {
            hasBGV: false,
            bgvId: null,
            link: null,
            token: null,
            fullLink: null
          };
        }
        
        // Get BGV submission status
        const submissionStatus = await fetchBGVSubmissionStatus(candidate.id, token);
        if (submissionStatus) {
          submissionStatusMap[candidate.id] = {
            status: submissionStatus.status || 'BGV_IN_PROGRESS',
            submittedAt: submissionStatus.createdAt,
            documentsUploaded: submissionStatus.documents?.length || 0,
            educationDetails: submissionStatus.educationDetails || [],
            employmentHistory: submissionStatus.employmentHistory || [],
            references: submissionStatus.references || [],
            onboardingDetails: submissionStatus.onboardingDetails || null,
            bgvRecordId: submissionStatus.id
          };
        } else {
          submissionStatusMap[candidate.id] = {
            status: 'BGV_IN_PROGRESS',
            submittedAt: null,
            documentsUploaded: 0,
            educationDetails: [],
            employmentHistory: [],
            references: [],
            onboardingDetails: null,
            bgvRecordId: null
          };
        }
      }
      
      setBgvDataMap(bgvMap);
      setBgvSubmissionStatus(submissionStatusMap);
      
    } catch (err) {
      console.error('Fetch Candidates Error:', err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log out and log in again.");
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate('/login');
        }, 3000);
      } else {
        setError(err.response?.data?.message || "Failed to load candidates. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Extract token from BGV link
  const extractTokenFromLink = (link) => {
    if (!link) return null;
    try {
      const url = new URL(link);
      return url.searchParams.get('token');
    } catch {
      return null;
    }
  };
  
  // Open BGV Portal
  const openBGVPortal = (token) => {
    if (token) {
      navigate(`/bgv-portal?token=${token}`);
    }
  };
  
  // Get BGV link for a candidate
  const getBGVLink = async (applicationId, candidateName) => {
    setGeneratingLink(prev => ({ ...prev, [applicationId]: true }));
    
    const token = localStorage.getItem("accessToken");
    
    try {
      const response = await axios.get(`${API_BASE}/hr/bgv/get-link/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log('BGV Link Response:', response.data);
      
      const bgvLink = response.data?.data?.link || response.data?.link || response.data;
      
      if (bgvLink) {
        const extractedToken = extractTokenFromLink(bgvLink);
        
        await navigator.clipboard.writeText(bgvLink);
        setCopiedLink(applicationId);
        setTimeout(() => setCopiedLink(null), 3000);
        
        setBgvDataMap(prev => ({
          ...prev,
          [applicationId]: {
            ...prev[applicationId],
            hasBGV: true,
            link: bgvLink,
            token: extractedToken,
            fullLink: bgvLink
          }
        }));
        
        setSuccess(`BGV link copied to clipboard for ${candidateName}`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to generate BGV link - no link in response");
      }
      
    } catch (err) {
      console.error('Get BGV Link Error:', err);
      if (err.response?.status === 403) {
        setError("You don't have permission to generate BGV links. Please contact administrator.");
      } else if (err.response?.status === 404) {
        setError("BGV record not found. Please ensure the candidate is in BGV_IN_PROGRESS stage.");
      } else {
        setError(err.response?.data?.message || "Failed to generate BGV link");
      }
    } finally {
      setGeneratingLink(prev => ({ ...prev, [applicationId]: false }));
    }
  };
  
  // Send BGV link via email
  const sendBGVLinkEmail = async (applicationId, candidateName, email) => {
    setGeneratingLink(prev => ({ ...prev, [applicationId]: true }));
    
    const token = localStorage.getItem("accessToken");
    
    try {
      const linkResponse = await axios.get(`${API_BASE}/hr/bgv/get-link/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const bgvLink = linkResponse.data?.data?.link || linkResponse.data?.link || linkResponse.data;
      
      if (!bgvLink) {
        throw new Error("Failed to generate BGV link");
      }
      
      await navigator.clipboard.writeText(bgvLink);
      
      setSuccess(`BGV link copied to clipboard. Please send it manually to ${email}`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Send BGV Link Email Error:', err);
      setError(err.response?.data?.message || "Failed to generate BGV link");
    } finally {
      setGeneratingLink(prev => ({ ...prev, [applicationId]: false }));
    }
  };
  
  // Approve BGV
  const approveBGV = async (applicationId, candidateName, bgvId) => {
    if (!window.confirm(`Are you sure you want to approve BGV for ${candidateName}? This will create an employee record and move the candidate to onboarding stage.`)) {
      return;
    }
    
    setProcessingBGV(prev => ({ ...prev, [applicationId]: true }));
    const token = localStorage.getItem("accessToken");
    
    try {
      const bgvIdentifier = bgvId || applicationId;
      const response = await axios.post(`${API_BASE}/hr/bgv/${bgvIdentifier}/approve-bgv`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Approve BGV Response:', response.data);
      
      const employeeId = response.data?.data?.employeeId || response.data?.employeeId;
      
      setSuccess(`✅ BGV approved for ${candidateName}. Employee ID: ${employeeId || 'Generated'}. Onboarding process initiated.`);
      
      // Refresh the list
      await fetchCandidates();
      
      setViewMode('list');
      setSelectedCandidate(null);
      
    } catch (err) {
      console.error('Approve BGV Error:', err);
      setError(err.response?.data?.message || "Failed to approve BGV");
    } finally {
      setProcessingBGV(prev => ({ ...prev, [applicationId]: false }));
    }
  };
  
  // Reject BGV
  const rejectBGV = async (applicationId, candidateName, bgvId) => {
    if (!window.confirm(`Are you sure you want to REJECT BGV for ${candidateName}? This action cannot be undone.`)) {
      return;
    }
    
    setProcessingBGV(prev => ({ ...prev, [applicationId]: true }));
    const token = localStorage.getItem("accessToken");
    
    try {
      const bgvIdentifier = bgvId || applicationId;
      const response = await axios.post(`${API_BASE}/hr/bgv/${bgvIdentifier}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Reject BGV Response:', response.data);
      
      setSuccess(`❌ BGV rejected for ${candidateName}`);
      
      await fetchCandidates();
      
      setViewMode('list');
      setSelectedCandidate(null);
      
    } catch (err) {
      console.error('Reject BGV Error:', err);
      setError(err.response?.data?.message || "Failed to reject BGV");
    } finally {
      setProcessingBGV(prev => ({ ...prev, [applicationId]: false }));
    }
  };
  
  // View candidate details
  const viewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('detail');
  };
  
  const backToList = () => {
    setViewMode('list');
    setSelectedCandidate(null);
  };
  
  // Get BGV submission status text
  const getBGVSubmissionStatus = (candidateId) => {
    const submission = bgvSubmissionStatus[candidateId];
    if (!submission) return 'BGV_IN_PROGRESS';
    return submission.status;
  };
  
  // Get BGV status badge based on actual submission
  const getBGVStatusBadge = (candidateId) => {
    const submissionStatus = getBGVSubmissionStatus(candidateId);
    
    switch (submissionStatus) {
      case 'SUBMITTED':
        return { status: 'SUBMITTED', text: 'Documents Submitted', color: 'indigo' };
      case 'UNDER_REVIEW':
        return { status: 'UNDER_REVIEW', text: 'Under Review', color: 'orange' };
      case 'APPROVED':
        return { status: 'APPROVED', text: 'BGV Approved', color: 'green' };
      case 'REJECTED':
        return { status: 'REJECTED', text: 'BGV Rejected', color: 'red' };
      default:
        return { status: 'IN_PROGRESS', text: 'BGV In Progress', color: 'cyan' };
    }
  };
  
  // Status badge component
  const StatusBadge = ({ candidateId }) => {
    const badge = getBGVStatusBadge(candidateId);
    const icons = {
      IN_PROGRESS: Shield,
      SUBMITTED: FileText,
      UNDER_REVIEW: Eye,
      APPROVED: CheckCircle,
      REJECTED: XCircle
    };
    const Icon = icons[badge.status] || Shield;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-${badge.color}-50 text-${badge.color}-700 rounded`}>
        <Icon size={10} />
        {badge.text}
      </span>
    );
  };
  
  // Stage badge for candidate's current stage
  const StageBadge = () => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 rounded">
        BGV In Progress
      </span>
    );
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
  
  // Get BGV data for a candidate
  const getCandidateBGVData = (candidateId) => {
    return bgvDataMap[candidateId] || { hasBGV: false, link: null, token: null, fullLink: null };
  };
  
  // Filter candidates
  const filteredCandidates = bgvInProgressCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const submissionStatus = getBGVSubmissionStatus(candidate.id);
    const matchesStatus = statusFilter === 'ALL' || submissionStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  useEffect(() => {
    checkUserRole();
    fetchCandidates();
  }, []);
  
  return (
    <>
      <BackNavbar />
      
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="max-w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              {viewMode !== 'list' && (
                <button 
                  onClick={backToList}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to List
                </button>
              )}
              <div>
                <h1 className="text-2xl font-light tracking-tight text-black uppercase">
                  {viewMode === 'list' ? 'BGV Verification Dashboard' : 'Candidate Details'}
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                  {viewMode === 'list' ? 'Manage background verification for candidates in progress' : 'Review candidate and BGV details'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {userRole && (
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  Role: {userRole}
                </span>
              )}
              <button
                onClick={fetchCandidates}
                disabled={loading}
                className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 rounded"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-full mx-auto px-6 py-8">
          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <>
              {/* Info Banner */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded">
                <p className="text-xs text-blue-700">
                  <Shield size={14} className="inline mr-2" />
                  <strong>BGV_IN_PROGRESS</strong> candidates: Track verification status, review documents, approve or reject based on verification.
                </p>
              </div>
              
              {/* Filters */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm border-b border-gray-100 focus-within:border-black transition-colors">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input
                    type="text"
                    placeholder="SEARCH BY NAME, EMAIL OR APPLICATION ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-6 pr-4 py-2 text-[10px] uppercase tracking-widest outline-none bg-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Filter size={14} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-[10px] uppercase tracking-widest border-none outline-none bg-transparent cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="BGV_IN_PROGRESS">In Progress</option>
                    <option value="SUBMITTED">Documents Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
              
              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-100 flex items-center gap-3 rounded"
                  >
                    <AlertCircle size={16} className="text-red-500" />
                    <p className="text-xs text-red-600 flex-1">{error}</p>
                    <button onClick={() => setError(null)}>
                      <XCircle size={14} className="text-red-400" />
                    </button>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-100 flex items-center gap-3 rounded"
                  >
                    <CheckCircle size={16} className="text-green-500" />
                    <p className="text-xs text-green-600 flex-1">{success}</p>
                    <button onClick={() => setSuccess(null)}>
                      <XCircle size={14} className="text-green-400" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Candidates Table */}
              {loading ? (
                <div className="border border-gray-100 p-20 flex flex-col items-center justify-center gap-3 rounded">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">Loading candidates...</span>
                </div>
              ) : (
                <div className="border border-gray-100 overflow-x-auto rounded">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4 font-bold">Candidate</th>
                       
                        <th className="px-6 py-4 font-bold">Stage</th>
                        
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate) => {
                          const bgvData = getCandidateBGVData(candidate.id);
                          const submissionStatus = getBGVSubmissionStatus(candidate.id);
                          const isApproved = submissionStatus === 'APPROVED';
                          const isRejected = submissionStatus === 'REJECTED';
                          
                          return (
                            <tr 
                              key={candidate.id} 
                              className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                              onClick={() => viewCandidateDetails(candidate)}
                            >
                              <td className="px-6 py-5">
                                <p className="font-bold text-black text-sm">{candidate.fullName}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{candidate.emailAddress}</p>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                  <Phone size={10} /> {candidate.phoneNumber || 'N/A'}
                                </p>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                  <Briefcase size={10} /> {candidate.currentJobTitle || 'Position not specified'}
                                </p>
                              </td>
                              
                            
                              <td className="px-6 py-5">
                                <StatusBadge candidateId={candidate.id} />
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 flex-wrap">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      viewCandidateDetails(candidate);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest border border-black px-3 py-1 hover:bg-black hover:text-white transition-all rounded"
                                  >
                                    View Details
                                  </button>
                                  
                                  {/* For BGV_IN_PROGRESS stage candidates - Show BGV management buttons */}
                                  {!isApproved && !isRejected && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          getBGVLink(candidate.id, candidate.fullName);
                                        }}
                                        disabled={generatingLink[candidate.id]}
                                        className="text-[10px] font-bold uppercase tracking-widest bg-gray-600 text-white px-3 py-1 hover:bg-gray-700 transition-all flex items-center gap-1 rounded"
                                      >
                                        {generatingLink[candidate.id] ? (
                                          <Loader2 className="animate-spin" size={10} />
                                        ) : copiedLink === candidate.id ? (
                                          <Check size={10} />
                                        ) : (
                                          <Copy size={10} />
                                        )}
                                        Get Link
                                      </button>
                                      
                                      
                                      
                                      {bgvData.token && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openBGVPortal(bgvData.token);
                                          }}
                                          className="text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white px-3 py-1 hover:bg-green-700 transition-all flex items-center gap-1 rounded"
                                        >
                                          <ExternalLink size={10} />
                                          Open Portal
                                        </button>
                                      )}
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          approveBGV(candidate.id, candidate.fullName, bgvData.bgvId);
                                        }}
                                        disabled={processingBGV[candidate.id]}
                                        className="text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-3 py-1 hover:bg-emerald-700 transition-all flex items-center gap-1 rounded"
                                      >
                                        {processingBGV[candidate.id] ? (
                                          <Loader2 className="animate-spin" size={10} />
                                        ) : (
                                          <CheckCircle size={10} />
                                        )}
                                        Approve
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          rejectBGV(candidate.id, candidate.fullName, bgvData.bgvId);
                                        }}
                                        disabled={processingBGV[candidate.id]}
                                        className="text-[10px] font-bold uppercase tracking-widest bg-red-600 text-white px-3 py-1 hover:bg-red-700 transition-all flex items-center gap-1 rounded"
                                      >
                                        <XCircle size={10} />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  
                                  {isApproved && (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                                      <CheckCircle size={10} />
                                      BGV Cleared
                                    </span>
                                  )}
                                  
                                  {isRejected && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                                      <XCircle size={10} />
                                      BGV Failed
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic text-sm">
                            {searchTerm ? "No matching candidates found." : "No candidates in BGV_IN_PROGRESS stage."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                   </table>
                </div>
              )}
              
              {/* Summary Stats */}
              {!loading && bgvInProgressCandidates.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <p className="text-[10px] text-gray-400">Total</p>
                    <p className="text-lg font-bold">{bgvInProgressCandidates.length}</p>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded text-center">
                    <p className="text-[10px] text-gray-400">In Progress</p>
                    <p className="text-lg font-bold text-cyan-600">
                      {bgvInProgressCandidates.filter(c => getBGVSubmissionStatus(c.id) === 'BGV_IN_PROGRESS').length}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded text-center">
                    <p className="text-[10px] text-gray-400">Submitted</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {bgvInProgressCandidates.filter(c => getBGVSubmissionStatus(c.id) === 'SUBMITTED').length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded text-center">
                    <p className="text-[10px] text-gray-400">Approved</p>
                    <p className="text-lg font-bold text-green-600">
                      {bgvInProgressCandidates.filter(c => getBGVSubmissionStatus(c.id) === 'APPROVED').length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded text-center">
                    <p className="text-[10px] text-gray-400">Rejected</p>
                    <p className="text-lg font-bold text-red-600">
                      {bgvInProgressCandidates.filter(c => getBGVSubmissionStatus(c.id) === 'REJECTED').length}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* DETAIL VIEW */}
          {viewMode === 'detail' && selectedCandidate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Candidate Header */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-light mb-2">{selectedCandidate.fullName}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail size={12} /> {selectedCandidate.emailAddress}</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {selectedCandidate.phoneNumber || 'N/A'}</span>
                    <code className="text-[10px] bg-gray-100 px-2 py-1 rounded">App ID: {selectedCandidate.id}</code>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StageBadge />
                  <StatusBadge candidateId={selectedCandidate.id} />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                {getBGVSubmissionStatus(selectedCandidate.id) !== 'APPROVED' && getBGVSubmissionStatus(selectedCandidate.id) !== 'REJECTED' && (
                  <>
                    <button
                      onClick={() => getBGVLink(selectedCandidate.id, selectedCandidate.fullName)}
                      disabled={generatingLink[selectedCandidate.id]}
                      className="px-4 py-2 bg-gray-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-700 transition-all flex items-center gap-2 rounded"
                    >
                      <Copy size={14} />
                      Get BGV Link
                    </button>
                    
                    {bgvDataMap[selectedCandidate.id]?.token && (
                      <button
                        onClick={() => openBGVPortal(bgvDataMap[selectedCandidate.id].token)}
                        className="px-4 py-2 bg-green-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2 rounded"
                      >
                        <ExternalLink size={14} />
                        Open BGV Portal
                      </button>
                    )}
                    
                    <button
                      onClick={() => approveBGV(selectedCandidate.id, selectedCandidate.fullName, bgvDataMap[selectedCandidate.id]?.bgvId)}
                      disabled={processingBGV[selectedCandidate.id]}
                      className="px-4 py-2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 rounded"
                    >
                      <CheckCircle size={14} />
                      Approve BGV & Create Employee
                    </button>
                    
                    <button
                      onClick={() => rejectBGV(selectedCandidate.id, selectedCandidate.fullName, bgvDataMap[selectedCandidate.id]?.bgvId)}
                      disabled={processingBGV[selectedCandidate.id]}
                      className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 rounded"
                    >
                      <XCircle size={14} />
                      Reject BGV
                    </button>
                  </>
                )}
              </div>
              
              {/* BGV Link Display */}
              {bgvDataMap[selectedCandidate.id]?.link && (
                <div className="border border-gray-100 p-4 rounded bg-gray-50">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Shield size={16} />
                    BGV Onboarding Link
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs bg-white p-2 rounded flex-1 break-all">
                      {bgvDataMap[selectedCandidate.id].link}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(bgvDataMap[selectedCandidate.id].link);
                        setSuccess("Link copied to clipboard!");
                        setTimeout(() => setSuccess(null), 2000);
                      }}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <Copy size={14} />
                    </button>
                    <a
                      href={bgvDataMap[selectedCandidate.id].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Send this link to the candidate to complete BGV and onboarding process
                  </p>
                </div>
              )}
              
              {/* BGV Portal Access Section */}
              {bgvDataMap[selectedCandidate.id]?.token && (
                <div className="border border-green-100 p-4 rounded bg-green-50">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <LinkIcon size={16} className="text-green-600" />
                    BGV Portal Access
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-600 mb-1">Candidate Portal URL:</p>
                      <code className="text-xs bg-white p-2 rounded block break-all">
                        {`${FRONTEND_URL}/bgv-portal?token=${bgvDataMap[selectedCandidate.id].token}`}
                      </code>
                    </div>
                    <button
                      onClick={() => openBGVPortal(bgvDataMap[selectedCandidate.id].token)}
                      className="px-4 py-2 bg-green-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2 rounded whitespace-nowrap"
                    >
                      <ExternalLink size={14} />
                      Open Portal
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-3">
                    This link takes the candidate directly to the BGV form fill-up page.
                    Share this link with the candidate to complete their verification.
                  </p>
                </div>
              )}
              
              {/* BGV Submission Details if available */}
              {bgvSubmissionStatus[selectedCandidate.id] && (
                <div className="border border-gray-100 p-6 rounded">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileText size={16} />
                    BGV Submission Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Status</p>
                      <p className="text-sm mt-1 font-medium">{bgvSubmissionStatus[selectedCandidate.id].status}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Documents Uploaded</p>
                      <p className="text-sm mt-1">{bgvSubmissionStatus[selectedCandidate.id].documentsUploaded || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Submitted On</p>
                      <p className="text-sm mt-1">{formatDate(bgvSubmissionStatus[selectedCandidate.id].submittedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Personal Information */}
              <div className="border border-gray-100 p-6 rounded">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={16} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Full Name</p>
                    <p className="text-sm mt-1">{selectedCandidate.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm mt-1">{selectedCandidate.emailAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm mt-1">{selectedCandidate.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Date of Birth</p>
                    <p className="text-sm mt-1">{formatDate(selectedCandidate.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Gender</p>
                    <p className="text-sm mt-1">{selectedCandidate.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Current Address</p>
                    <p className="text-sm mt-1">{selectedCandidate.currentAddress || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              {/* Professional Details */}
              <div className="border border-gray-100 p-6 rounded">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Briefcase size={16} />
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Current Position</p>
                    <p className="text-sm mt-1">{selectedCandidate.currentJobTitle || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total Experience</p>
                    <p className="text-sm mt-1">{selectedCandidate.totalExperience || '0'} years</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Expected Salary</p>
                    <p className="text-sm mt-1">₹{selectedCandidate.expectedSalary || '0'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Notice Period</p>
                    <p className="text-sm mt-1">{selectedCandidate.noticePeriod || '0'} days</p>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="border border-gray-100 p-6 rounded">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.keySkills?.split(',').map((skill, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wider rounded">
                      {skill.trim()}
                    </span>
                  )) || 'Not specified'}
                </div>
              </div>
              
              {/* Application Metadata */}
              <div className="pt-4 text-[10px] text-gray-400 flex flex-wrap justify-between gap-2">
                <span>Application ID: {selectedCandidate.id}</span>
                <span>Applied: {formatDate(selectedCandidate.appliedAt)}</span>
                <span>Current Stage Updated: {formatDate(selectedCandidate.updatedAt)}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default BGVVerification;