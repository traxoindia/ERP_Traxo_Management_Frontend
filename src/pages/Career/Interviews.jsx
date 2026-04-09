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
  ExternalLink,
  Check
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
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [interviews, setInterviews] = useState({});
  const [fetchingInterview, setFetchingInterview] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, candidate: null, interview: null });
  
  // Feedback form state - Matches correct API structure
  const [feedbackData, setFeedbackData] = useState({
    applicationId: '',
    candidateName: '',
    email: '',
    phone: '',
    positionApplied: '',
    interviewerId: '',
    interviewerName: '',
    evaluation: {
      communicationSkills: { rating: 3, comments: '' },
      technicalKnowledge: { rating: 3, comments: '' },
      problemSolving: { rating: 3, comments: '' },
      relevantExperience: { rating: 3, comments: '' },
      culturalFit: { rating: 3, comments: '' }
    },
    overallRating: 3,
    strengths: '',
    areasOfImprovement: '',
    recommendation: '',
    additionalComments: '',
    status: 'SUBMITTED'
  });
  
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
      
      if (Array.isArray(candidatesData)) {
        candidatesData.forEach(candidate => {
          fetchInterviewDetails(candidate.id);
        });
      }
      
    } catch (err) {
      console.error(`Fetch ${stage} Candidates Error:`, err);
      setError(`Failed to fetch ${stage} candidates.`);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch interview details for a candidate
  const fetchInterviewDetails = async (applicationId) => {
    if (!applicationId) return;
    
    setFetchingInterview(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(`${API_BASE}/interview/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log(`Interview details for ${applicationId}:`, response.data);
      
      const interviewData = response.data?.data || response.data;
      
      if (Array.isArray(interviewData)) {
        setInterviews(prev => ({
          ...prev,
          [applicationId]: interviewData.length > 0 ? interviewData[0] : null
        }));
      } else {
        setInterviews(prev => ({
          ...prev,
          [applicationId]: interviewData || null
        }));
      }
      
    } catch (err) {
      console.error(`Fetch Interview Details Error for ${applicationId}:`, err);
      if (err.response?.status === 404) {
        setInterviews(prev => ({
          ...prev,
          [applicationId]: null
        }));
      }
    } finally {
      setFetchingInterview(false);
    }
  };

  // Submit feedback to API - Updated to match correct API structure
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!feedbackModal.candidate) return;
    
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      // Prepare payload matching the API structure
      const feedbackPayload = {
        applicationId: feedbackModal.candidate.id,
        candidateName: feedbackData.candidateName,
        email: feedbackData.email,
        phone: feedbackData.phone,
        positionApplied: feedbackData.positionApplied,
        interviewerId: feedbackData.interviewerId,
        interviewerName: feedbackData.interviewerName,
        evaluation: {
          communicationSkills: feedbackData.evaluation.communicationSkills,
          technicalKnowledge: feedbackData.evaluation.technicalKnowledge,
          problemSolving: feedbackData.evaluation.problemSolving,
          relevantExperience: feedbackData.evaluation.relevantExperience,
          culturalFit: feedbackData.evaluation.culturalFit
        },
        overallRating: feedbackData.overallRating,
        strengths: feedbackData.strengths,
        areasOfImprovement: feedbackData.areasOfImprovement,
        recommendation: feedbackData.recommendation,
        additionalComments: feedbackData.additionalComments,
        status: 'SUBMITTED'
      };

      console.log("Submitting feedback:", feedbackPayload);

      // POST to the correct feedback endpoint
      const response = await axios.post(`${API_BASE}/feedback`, feedbackPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Feedback response:", response.data);
      
      alert(`Feedback submitted successfully for ${feedbackModal.candidate.fullName}`);
      
      closeFeedbackModal();
      
    } catch (err) {
      console.error("Submit Feedback Error:", err);
      
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || "Failed to submit feedback";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Open feedback modal and pre-populate with candidate data
  const openFeedbackModal = (candidate, interview, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Pre-populate feedback form with candidate and interview data
    setFeedbackData({
      applicationId: candidate.id,
      candidateName: candidate.fullName || '',
      email: candidate.emailAddress || '',
      phone: candidate.phoneNumber || '',
      positionApplied: candidate.appliedPosition || candidate.currentJobTitle || '',
      interviewerId: interview?.interviewerId || `INT${Math.floor(Math.random() * 1000)}`,
      interviewerName: interview?.interviewerName || 'Not Assigned',
      evaluation: {
        communicationSkills: { rating: 3, comments: '' },
        technicalKnowledge: { rating: 3, comments: '' },
        problemSolving: { rating: 3, comments: '' },
        relevantExperience: { rating: 3, comments: '' },
        culturalFit: { rating: 3, comments: '' }
      },
      overallRating: 3,
      strengths: '',
      areasOfImprovement: '',
      recommendation: candidate.recommendation|| "HIRE",
      additionalComments: '',
      status: 'SUBMITTED'
    });
    
    setFeedbackModal({ isOpen: true, candidate, interview });
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, candidate: null, interview: null });
  };

  // Update evaluation rating
  const updateEvaluationRating = (category, rating) => {
    setFeedbackData(prev => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        [category]: { ...prev.evaluation[category], rating }
      }
    }));
  };

  // Update evaluation comments
  const updateEvaluationComments = (category, comments) => {
    setFeedbackData(prev => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        [category]: { ...prev.evaluation[category], comments }
      }
    }));
  };

  // Calculate overall rating average
  const calculateOverallRating = () => {
    const ratings = Object.values(feedbackData.evaluation).map(e => e.rating);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return Math.round(avg * 10) / 10;
  };

  // Update overall rating when evaluations change
  useEffect(() => {
    const overall = calculateOverallRating();
    setFeedbackData(prev => ({
      ...prev,
      overallRating: overall
    }));
  }, [feedbackData.evaluation]);

  // Move candidate to SELECTED stage
  const moveToSelectedStage = async (candidate, event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!window.confirm(`Are you sure you want to select ${candidate.fullName} for the position?`)) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("accessToken");
    console.log(candidate.id)

    try {
      await axios.put(`${API_BASE}/applications/${candidate.id}/stage?stage=SELECTED`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      fetchCandidatesByStage(selectedStage);
      
      if (selectedCandidate && selectedCandidate.id === candidate.id) {
        console.log(selectedCandidate)
        setSelectedCandidate(null);
        setViewMode('list');
      }

      alert(`${candidate.fullName} has been moved to SELECTED stage!`);
      
    } catch (err) {
      console.error("Move to Selected Stage Error:", err);
      alert("Failed to move candidate. Please try again.");
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
      const interviewPayload = {
        applicationId: selectedCandidate.id,
        interviewDate: scheduleData.interviewDate,
        interviewTime: scheduleData.interviewTime,
        interviewRound: scheduleData.interviewType,
        interviewerName: scheduleData.interviewerName,
        interviewLink: scheduleData.interviewLink || "",
        notes: scheduleData.notes || ""
      };

      console.log("Scheduling interview with payload:", interviewPayload);

      const response = await axios.post(`${API_BASE}/interview/schedule`, interviewPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Schedule interview response:", response.data);

      await axios.put(`${API_BASE}/applications/${selectedCandidate.id}/stage?stage=${scheduleData.interviewType}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      await fetchInterviewDetails(selectedCandidate.id);
      
      alert(`Interview scheduled successfully for ${selectedCandidate.fullName} on ${scheduleData.interviewDate} at ${scheduleData.interviewTime}`);
      
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
      
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || "Failed to schedule interview";
        alert(`Error: ${errorMessage}`);
      } else if (err.request) {
        alert("No response from server. Please check your network connection.");
      } else {
        alert("Failed to schedule interview. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cancel interview
  const cancelInterview = async (applicationId) => {
    if (!window.confirm("Are you sure you want to cancel this interview?")) return;
    
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`${API_BASE}/interview/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setInterviews(prev => {
        const newState = { ...prev };
        delete newState[applicationId];
        return newState;
      });

      alert("Interview cancelled successfully");
      
      fetchCandidatesByStage(selectedStage);
      
    } catch (err) {
      console.error("Cancel Interview Error:", err);
      alert("Failed to cancel interview");
    } finally {
      setLoading(false);
    }
  };

  // View candidate details
  const viewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('detail');
    fetchInterviewDetails(candidate.id);
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

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
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

  // Interview Details Component
  const InterviewDetails = ({ candidateId }) => {
    const [interviewsList, setInterviewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        let isMounted = true;
        
        const fetchInterviewForCandidate = async () => {
            if (!candidateId) return;
            
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("accessToken");
            
            if (!token) {
                setError("No authentication token found");
                setLoading(false);
                return;
            }
            
            try {
                const response = await axios.get(`${API_BASE}/interview/${candidateId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                console.log(`Fetched interview for ${candidateId}:`, response.data);
                
                const interviewData = response.data?.data || response.data;
                
                if (isMounted) {
                    if (Array.isArray(interviewData)) {
                        setInterviewsList(interviewData);
                    } else {
                        setInterviewsList(interviewData ? [interviewData] : []);
                    }
                }
                
            } catch (err) {
                console.error(`Error fetching interview for ${candidateId}:`, err);
                
                if (isMounted) {
                    if (err.response?.status === 404) {
                        setInterviewsList([]);
                    } else {
                        setError("Failed to load interview details");
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        fetchInterviewForCandidate();
        
        return () => {
            isMounted = false;
        };
    }, [candidateId]);
    
    if (loading) {
        return (
            <div className="mb-8 p-4 border border-gray-100 flex items-center gap-2">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px] text-gray-400">Loading interview details...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="mb-8 p-4 border border-red-100 bg-red-50/30 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-[10px] text-red-600">{error}</span>
            </div>
        );
    }
    
    if (!interviewsList || interviewsList.length === 0) {
        return (
            <div className="mb-8 p-4 border border-gray-100 bg-gray-50/30">
                <p className="text-xs text-gray-400 italic">No interview scheduled yet</p>
            </div>
        );
    }
    
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest">
                    Scheduled Interviews ({interviewsList.length})
                </h3>
                <button
                    onClick={() => cancelInterview(candidateId)}
                    className="text-[10px] text-red-600 hover:text-red-700 uppercase tracking-wider"
                >
                    Cancel
                </button>
            </div>
            
            {interviewsList.map((interview, index) => (
                <div 
                    key={interview.id || index} 
                    className="border border-blue-100 bg-blue-50/30 p-4 mb-4 last:mb-0"
                >
                    {interviewsList.length > 1 && (
                        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">
                            Interview #{index + 1}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="text-sm font-medium">
                            {formatDate(interview.interviewDate)} at {formatTime(interview.interviewTime)}
                        </span>
                        <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 uppercase tracking-wider">
                            {interview.interviewRound}
                        </span>
                        {interview.status && (
                            <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 uppercase tracking-wider">
                                {interview.status}
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Interviewer</p>
                            <p className="text-sm">{interview.interviewerName}</p>
                        </div>
                        
                        {interview.interviewLink && (
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Meeting Link</p>
                                <a 
                                    href={interview.interviewLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    Join Meeting <ExternalLink size={12} />
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {interview.notes && interview.notes !== "NA" && (
                        <div className="mt-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Notes</p>
                            <p className="text-sm text-gray-600">{interview.notes}</p>
                        </div>
                    )}
                    
                    <div className="mt-3 text-[8px] text-gray-400">
                        Interview ID: {interview.id}
                    </div>
                </div>
            ))}
        </div>
    );
  };

  return (
    <>
      <BackNavbar />

      {/* Feedback Modal - Updated to match correct API structure */}
      <AnimatePresence>
        {feedbackModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeFeedbackModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light">Interview Feedback Form</h2>
                <button
                  onClick={closeFeedbackModal}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Candidate Info Header */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <p className="text-sm font-medium">{feedbackModal.candidate?.fullName}</p>
                <p className="text-xs text-gray-400">{feedbackModal.candidate?.emailAddress}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Position: {feedbackModal.candidate?.appliedPosition || feedbackModal.candidate?.currentJobTitle}
                </p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-8">
                {/* Interviewer Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Interviewer ID
                    </label>
                    <input
                      type="text"
                      value={feedbackData.interviewerId}
                      onChange={(e) => setFeedbackData({...feedbackData, interviewerId: e.target.value})}
                      className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., INT789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Interviewer Name
                    </label>
                    <input
                      type="text"
                      value={feedbackData.interviewerName}
                      onChange={(e) => setFeedbackData({...feedbackData, interviewerName: e.target.value})}
                      className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., Jane Smith"
                    />
                  </div>
                </div>

                {/* Evaluation Section - 5 Categories */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Evaluation Criteria</h3>
                  <div className="space-y-6">
                    {/* Communication Skills */}
                    <div className="border border-gray-100 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Communication Skills</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateEvaluationRating('communicationSkills', star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={16} 
                                className={feedbackData.evaluation.communicationSkills.rating >= star 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows="2"
                        value={feedbackData.evaluation.communicationSkills.comments}
                        onChange={(e) => updateEvaluationComments('communicationSkills', e.target.value)}
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                        placeholder="Comments on communication skills..."
                      />
                    </div>

                    {/* Technical Knowledge */}
                    <div className="border border-gray-100 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Technical Knowledge</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateEvaluationRating('technicalKnowledge', star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={16} 
                                className={feedbackData.evaluation.technicalKnowledge.rating >= star 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows="2"
                        value={feedbackData.evaluation.technicalKnowledge.comments}
                        onChange={(e) => updateEvaluationComments('technicalKnowledge', e.target.value)}
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                        placeholder="Comments on technical knowledge..."
                      />
                    </div>

                    {/* Problem Solving */}
                    <div className="border border-gray-100 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Problem Solving</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateEvaluationRating('problemSolving', star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={16} 
                                className={feedbackData.evaluation.problemSolving.rating >= star 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows="2"
                        value={feedbackData.evaluation.problemSolving.comments}
                        onChange={(e) => updateEvaluationComments('problemSolving', e.target.value)}
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                        placeholder="Comments on problem solving abilities..."
                      />
                    </div>

                    {/* Relevant Experience */}
                    <div className="border border-gray-100 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Relevant Experience</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateEvaluationRating('relevantExperience', star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={16} 
                                className={feedbackData.evaluation.relevantExperience.rating >= star 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows="2"
                        value={feedbackData.evaluation.relevantExperience.comments}
                        onChange={(e) => updateEvaluationComments('relevantExperience', e.target.value)}
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                        placeholder="Comments on relevant experience..."
                      />
                    </div>

                    {/* Cultural Fit */}
                    <div className="border border-gray-100 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Cultural Fit</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateEvaluationRating('culturalFit', star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                size={16} 
                                className={feedbackData.evaluation.culturalFit.rating >= star 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows="2"
                        value={feedbackData.evaluation.culturalFit.comments}
                        onChange={(e) => updateEvaluationComments('culturalFit', e.target.value)}
                        className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                        placeholder="Comments on cultural fit..."
                      />
                    </div>
                  </div>
                </div>

                {/* Overall Rating Display */}
                <div className="bg-gray-50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-widest">Overall Rating</span>
                    <span className="text-2xl font-light">{feedbackData.overallRating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {/* Strengths & Areas of Improvement */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Strengths
                    </label>
                    <textarea
                      rows="3"
                      value={feedbackData.strengths}
                      onChange={(e) => setFeedbackData({...feedbackData, strengths: e.target.value})}
                      className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                      placeholder="What went well in the interview?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Areas of Improvement
                    </label>
                    <textarea
                      rows="3"
                      value={feedbackData.areasOfImprovement}
                      onChange={(e) => setFeedbackData({...feedbackData, areasOfImprovement: e.target.value})}
                      className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                      placeholder="What could be improved?"
                    />
                  </div>
                </div>

                {/* Recommendation */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Recommendation
                  </label>
                  <select
                    value={feedbackData.recommendation}
                    onChange={(e) => setFeedbackData({...feedbackData, recommendation: e.target.value})}
                    className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm"
                  >
            
                    <option value="HIRE">Hire - Move to Next Round</option>

                    <option value="NO_HIRE">No Hire - Reject</option>
                  </select>
                </div>

                {/* Additional Comments */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Additional Comments
                  </label>
                  <textarea
                    rows="2"
                    value={feedbackData.additionalComments}
                    onChange={(e) => setFeedbackData({...feedbackData, additionalComments: e.target.value})}
                    className="w-full px-0 py-2 border-b border-gray-100 outline-none focus:border-black transition-colors text-sm resize-none"
                    placeholder="Any additional notes or observations..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <button
                    type="button"
                    onClick={closeFeedbackModal}
                    className="px-6 py-3 border border-gray-200 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
                        <th className="px-6 py-4 font-bold">Interview</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {filteredCandidates.length > 0 ? filteredCandidates.map((candidate) => {
                        const nextStages = getNextStages(candidate.status || selectedStage);
                        const hasInterview = interviews[candidate.id];
                        const interview = interviews[candidate.id];
                        
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
                            <td className="px-6 py-5">
                              {hasInterview ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1">
                                  <Calendar size={10} />
                                  Scheduled
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400">Not scheduled</span>
                              )}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewCandidateDetails(candidate);
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                                >
                                  View
                                </button>
                                
                                {/* FEEDBACK BUTTON - Only shows when interview is scheduled */}
                                {hasInterview && (
                                  <button
                                    onClick={(e) => openFeedbackModal(candidate, interview, e)}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-purple-600 text-white px-3 py-1 hover:bg-purple-700 transition-all flex items-center gap-1"
                                  >
                                    <MessageSquare size={12} />
                                    Feedback
                                  </button>
                                )}
                                
                                {candidate.status !== 'SELECTED' && candidate.status !== 'REJECTED' && !hasInterview && (
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
                                
                                {hasInterview && candidate.status !== 'SELECTED' && candidate.status !== 'REJECTED' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showScheduleForm(candidate);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-yellow-600 text-white px-3 py-1 hover:bg-yellow-700 transition-all flex items-center gap-1"
                                  >
                                    <Calendar size={12} />
                                    Reschedule
                                  </button>
                                )}
                                
                                {nextStages.length > 0 && (
                                  <button
                                    onClick={(e) => moveToNextStage(candidate, nextStages[0], e)}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white px-3 py-1 hover:bg-green-700 transition-all"
                                  >
                                    Move to {nextStages[0].replace('_', ' ')}
                                  </button>
                                )}
                              
                                
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
                          <td colSpan="7" className="px-6 py-10 text-center text-gray-400 italic">
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
                        {/* Feedback Button in Detail View */}
                        {interviews[selectedCandidate.id] && (
                          <button
                            onClick={() => openFeedbackModal(selectedCandidate, interviews[selectedCandidate.id])}
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-purple-700 transition-all"
                          >
                            <MessageSquare size={14} />
                            Feedback
                          </button>
                        )}
                        <button
                          onClick={() => showScheduleForm(selectedCandidate)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                        >
                          <Calendar size={14} />
                          {interviews[selectedCandidate.id] ? 'Reschedule Interview' : 'Schedule Interview'}
                        </button>
                        {/* Select Button in Detail View */}
                        {selectedCandidate.status !== 'SELECTED' && selectedCandidate.status !== 'REJECTED' && (
                          <button
                            onClick={() => moveToSelectedStage(selectedCandidate)}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all"
                          >
                            <UserCheck size={14} />
                            Select Candidate
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Current Stage Badge */}
                    <div className="mb-6">
                      <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-${getStageColor(selectedCandidate.status)}-100 text-${getStageColor(selectedCandidate.status)}-700`}>
                        Current Stage: {selectedCandidate.status || selectedStage}
                      </span>
                    </div>

                    {/* Interview Details */}
                    {fetchingInterview ? (
                      <div className="mb-8 p-4 border border-gray-100 flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} />
                        <span className="text-[10px] text-gray-400">Loading interview details...</span>
                      </div>
                    ) : (
                      <InterviewDetails candidateId={selectedCandidate.id} />
                    )}

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
                      {selectedCandidate.status !== 'SELECTED' && selectedCandidate.status !== 'REJECTED' && (
                        <button
                          onClick={() => moveToSelectedStage(selectedCandidate)}
                          className="px-4 py-2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
                        >
                          <UserCheck size={14} />
                          Select Candidate
                        </button>
                      )}
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
                    <h2 className="text-xl font-light mb-6">
                      {interviews[selectedCandidate.id] ? 'Reschedule Interview' : 'Schedule Interview'} for {selectedCandidate.fullName}
                    </h2>
                    
                    <form onSubmit={handleScheduleInterview} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interview Date</label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
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
                          className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Scheduling..." : interviews[selectedCandidate.id] ? "Reschedule Interview" : "Schedule Interview"}
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