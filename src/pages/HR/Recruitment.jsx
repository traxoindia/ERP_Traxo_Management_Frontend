import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  FileText, 
  Mail, 
  Phone, 
  ArrowRight,
  CheckCircle2,
  X,
  Calendar,
  Clock,
  Award,
  Download,
  Eye,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  GraduationCap,
  Star,
  ChevronRight,
  ChevronLeft,
  Plus,
  Upload,
  Trash2,
  Edit,
  Save,
  AlertCircle
} from "lucide-react";

// Define hiring rounds for each job position
const HIRING_ROUNDS = {
  "Frontend Developer": [
    { id: 1, name: "Application Screening", type: "screening", duration: "2-3 days" },
    { id: 2, name: "HR Interview", type: "hr", duration: "30-45 mins" },
    { id: 3, name: "Technical Round 1", type: "technical", duration: "60 mins" },
    { id: 4, name: "Technical Round 2", type: "technical", duration: "60 mins" },
    { id: 5, name: "Manager Round", type: "manager", duration: "45 mins" },
    { id: 6, name: "HR Final", type: "hr", duration: "30 mins" }
  ],
  "Backend Developer": [
    { id: 1, name: "Application Screening", type: "screening", duration: "2-3 days" },
    { id: 2, name: "HR Interview", type: "hr", duration: "30-45 mins" },
    { id: 3, name: "Technical Round 1", type: "technical", duration: "60 mins" },
    { id: 4, name: "System Design", type: "technical", duration: "90 mins" },
    { id: 5, name: "Manager Round", type: "manager", duration: "45 mins" },
    { id: 6, name: "HR Final", type: "hr", duration: "30 mins" }
  ],
  "UI/UX Designer": [
    { id: 1, name: "Application Screening", type: "screening", duration: "2-3 days" },
    { id: 2, name: "HR Interview", type: "hr", duration: "30-45 mins" },
    { id: 3, name: "Portfolio Review", type: "technical", duration: "60 mins" },
    { id: 4, name: "Design Challenge", type: "technical", duration: "2-3 days" },
    { id: 5, name: "Design Lead Round", type: "manager", duration: "45 mins" },
    { id: 6, name: "HR Final", type: "hr", duration: "30 mins" }
  ],
  "Product Manager": [
    { id: 1, name: "Application Screening", type: "screening", duration: "2-3 days" },
    { id: 2, name: "HR Interview", type: "hr", duration: "30-45 mins" },
    { id: 3, name: "Product Sense", type: "technical", duration: "60 mins" },
    { id: 4, name: "Strategy Round", type: "technical", duration: "60 mins" },
    { id: 5, name: "Leadership Round", type: "manager", duration: "45 mins" },
    { id: 6, name: "HR Final", type: "hr", duration: "30 mins" }
  ],
  "DevOps Engineer": [
    { id: 1, name: "Application Screening", type: "screening", duration: "2-3 days" },
    { id: 2, name: "HR Interview", type: "hr", duration: "30-45 mins" },
    { id: 3, name: "Technical Round 1", type: "technical", duration: "60 mins" },
    { id: 4, name: "System Design & Infrastructure", type: "technical", duration: "90 mins" },
    { id: 5, name: "Manager Round", type: "manager", duration: "45 mins" },
    { id: 6, name: "HR Final", type: "hr", duration: "30 mins" }
  ]
};

const STAGES = ["Screening", "HR Interview", "Technical", "Manager Round", "HR Final", "Offered"];

const Recruitment = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("board");
  const [selectedRound, setSelectedRound] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackScore, setFeedbackScore] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state for new candidate
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    currentCompany: "",
    location: "",
    education: "",
    skills: "",
    source: "",
    expectedSalary: "",
    noticePeriod: "",
    notes: "",
    resume: null
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setFormErrors(prev => ({
          ...prev,
          resume: "Please upload a PDF file"
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          resume: "File size should be less than 5MB"
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setCvFile(URL.createObjectURL(file));
      setFormErrors(prev => ({
        ...prev,
        resume: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (!formData.role) errors.role = "Please select a role";
    if (!formData.experience) errors.experience = "Experience is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.skills.trim()) errors.skills = "Skills are required";
    if (!formData.resume) errors.resume = "Resume is required";
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Create new candidate with rounds based on selected role
    const rounds = HIRING_ROUNDS[formData.role]?.map((round, index) => ({
      id: index + 1,
      name: round.name,
      type: round.type,
      status: index === 0 ? "pending" : "locked",
      date: null,
      feedback: "",
      interviewer: index === 0 ? "HR Team" : null,
      score: null,
      duration: round.duration
    })) || [];

    const newCandidate = {
      id: candidates.length + 1,
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      stage: "Screening",
      currentRound: 0,
      score: 0,
      appliedDate: new Date().toISOString().split('T')[0],
      rounds: rounds,
      feedback: [],
      status: "active",
      resumeUrl: cvFile
    };

    setCandidates(prev => [newCandidate, ...prev]);
    setIsSubmitting(false);
    setShowAddModal(false);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      experience: "",
      currentCompany: "",
      location: "",
      education: "",
      skills: "",
      source: "",
      expectedSalary: "",
      noticePeriod: "",
      notes: "",
      resume: null
    });
    setCvFile(null);

    // Show success message
    setSuccessMessage("Candidate added successfully!");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Function to move candidate to next round
  const moveToNextRound = (candidateId) => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        const currentStageIndex = STAGES.indexOf(candidate.stage);
        
        if (currentStageIndex < STAGES.length - 1) {
          const nextStage = STAGES[currentStageIndex + 1];
          
          // Update rounds status
          const updatedRounds = candidate.rounds.map((round, idx) => {
            if (idx === candidate.currentRound) {
              return { 
                ...round, 
                status: "completed", 
                date: new Date().toISOString().split('T')[0]
              };
            }
            if (idx === candidate.currentRound + 1) {
              return { ...round, status: "pending", interviewer: getInterviewerForRound(round.name) };
            }
            return round;
          });

          return {
            ...candidate,
            stage: nextStage,
            currentRound: candidate.currentRound + 1,
            rounds: updatedRounds
          };
        } else if (currentStageIndex === STAGES.length - 1) {
          // Candidate is offered
          const updatedRounds = candidate.rounds.map((round, idx) => {
            if (idx === candidate.currentRound) {
              return { 
                ...round, 
                status: "completed", 
                date: new Date().toISOString().split('T')[0],
                feedback: "Offer accepted"
              };
            }
            return round;
          });

          return {
            ...candidate,
            stage: "Offered",
            status: "hired",
            rounds: updatedRounds
          };
        }
      }
      return candidate;
    }));

    setSelectedCandidate(null);
    setSuccessMessage("Candidate moved to next round!");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Helper function to assign interviewers
  const getInterviewerForRound = (roundName) => {
    const interviewers = {
      "Application Screening": "HR Team",
      "HR Interview": "Priya Singh",
      "Technical Round 1": "Rahul Sharma",
      "Technical Round 2": "Amit Kumar",
      "Manager Round": "Vikram Mehta",
      "HR Final": "Neha Gupta",
      "Portfolio Review": "Design Team",
      "Design Challenge": "Design Team",
      "Design Lead Round": "Arjun Nair",
      "Product Sense": "Product Team",
      "Strategy Round": "Product Team",
      "Leadership Round": "Senior Management",
      "System Design": "Technical Lead"
    };
    return interviewers[roundName] || "Interview Panel";
  };

  // Function to provide feedback for a round
  const provideFeedback = (candidateId, roundId) => {
    if (!feedbackText.trim()) return;

    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        const updatedRounds = candidate.rounds.map(round => {
          if (round.id === roundId) {
            return {
              ...round,
              status: "completed",
              feedback: feedbackText,
              score: feedbackScore ? parseInt(feedbackScore) : round.score,
              date: new Date().toISOString().split('T')[0]
            };
          }
          return round;
        });

        // Unlock next round if feedback is positive
        const roundIndex = updatedRounds.findIndex(r => r.id === roundId);
        if (roundIndex < updatedRounds.length - 1 && feedbackScore >= 70) {
          updatedRounds[roundIndex + 1].status = "pending";
          updatedRounds[roundIndex + 1].interviewer = getInterviewerForRound(updatedRounds[roundIndex + 1].name);
        }

        return {
          ...candidate,
          rounds: updatedRounds,
          score: feedbackScore ? parseInt(feedbackScore) : candidate.score
        };
      }
      return candidate;
    }));

    setSelectedRound(null);
    setFeedbackText("");
    setFeedbackScore("");
    
    setSuccessMessage("Feedback submitted successfully!");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Function to schedule interview
  const scheduleInterview = (candidateId, roundId) => {
    const date = prompt("Enter interview date (YYYY-MM-DD):");
    if (!date) return;

    const time = prompt("Enter interview time (HH:MM AM/PM):");
    if (!time) return;

    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        const updatedRounds = candidate.rounds.map(round => {
          if (round.id === roundId) {
            return { 
              ...round, 
              status: "scheduled", 
              date: date,
              time: time,
              interviewer: getInterviewerForRound(round.name)
            };
          }
          return round;
        });
        return { ...candidate, rounds: updatedRounds };
      }
      return candidate;
    }));

    setSuccessMessage("Interview scheduled successfully!");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Function to reject candidate
  const rejectCandidate = (candidateId) => {
    if (window.confirm("Are you sure you want to reject this candidate?")) {
      setCandidates(prev => prev.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            status: "rejected",
            stage: "Rejected"
          };
        }
        return candidate;
      }));
      setSelectedCandidate(null);
      
      setSuccessMessage("Candidate rejected");
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  // Filter candidates based on search and stage
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === "All" || c.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  // Get stage color
  const getStageColor = (stage) => {
    const colors = {
      "Screening": "bg-purple-100 text-purple-600",
      "HR Interview": "bg-blue-100 text-blue-600",
      "Technical": "bg-orange-100 text-orange-600",
      "Manager Round": "bg-green-100 text-green-600",
      "HR Final": "bg-yellow-100 text-yellow-600",
      "Offered": "bg-emerald-100 text-emerald-600",
      "Rejected": "bg-red-100 text-red-600"
    };
    return colors[stage] || "bg-gray-100 text-gray-600";
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Get round status color
  const getRoundStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-600 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'locked': return 'bg-gray-100 text-gray-400 border-gray-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto relative">
      {/* Success Message Toast */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 size={20} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Recruitment Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your hiring process smoothly.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("board")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "board" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
              }`}
            >
              List
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stage Filter */}
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="All">All Stages</option>
            {STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            <UserPlus size={18} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Pipeline Board View */}
      {viewMode === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {STAGES.map((stage) => (
            <div key={stage} className="min-w-[320px] bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  {stage}
                  <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                    {candidates.filter(c => c.stage === stage).length}
                  </span>
                </h3>
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                {filteredCandidates
                  .filter(c => c.stage === stage)
                  .map((candidate) => (
                    <motion.div
                      layoutId={`card-${candidate.id}`}
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {candidate.name?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {candidate.name}
                            </h4>
                            <p className="text-xs text-gray-500">{candidate.role}</p>
                          </div>
                        </div>
                        {candidate.score > 0 && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getScoreColor(candidate.score)}`}>
                            {candidate.score}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <Briefcase size={12} />
                        <span>{candidate.experience}</span>
                        <MapPin size={12} className="ml-2" />
                        <span>{candidate.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills?.length > 3 && (
                          <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Progress through rounds */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1">
                          {candidate.rounds?.map((round, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full ${
                                round.status === 'completed' ? 'bg-green-500' :
                                round.status === 'scheduled' ? 'bg-blue-500' :
                                round.status === 'pending' ? 'bg-yellow-500' :
                                'bg-gray-200'
                              }`}
                              title={`${round.name}: ${round.status}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">
                          Round {candidate.currentRound + 1}/{candidate.rounds?.length}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Candidate Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-800">Add New Candidate</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <User size={20} className="text-blue-500" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.name ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Role/Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.role ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none`}
                      >
                        <option value="">Select Position</option>
                        {Object.keys(HIRING_ROUNDS).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {formErrors.role && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.role}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.email ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none`}
                        placeholder="+91 98765 43210"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-500" />
                    Professional Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.experience ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none`}
                        placeholder="e.g., 3 years"
                      />
                      {formErrors.experience && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.experience}
                        </p>
                      )}
                    </div>

                    {/* Current Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Company
                      </label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="Current Company"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.location ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none`}
                        placeholder="City, Country"
                      />
                      {formErrors.location && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.location}
                        </p>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="e.g., B.Tech CSE, IIT Delhi"
                      />
                    </div>

                    {/* Expected Salary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Salary
                      </label>
                      <input
                        type="text"
                        name="expectedSalary"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="e.g., ₹15-20 LPA"
                      />
                    </div>

                    {/* Notice Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notice Period
                      </label>
                      <input
                        type="text"
                        name="noticePeriod"
                        value={formData.noticePeriod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="e.g., 30 days"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <Award size={20} className="text-blue-500" />
                    Skills & Expertise
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.skills ? 'border-red-500' : 'border-gray-200'
                      } rounded-xl focus:ring-2 focus:ring-blue-400 outline-none`}
                      placeholder="React, JavaScript, Node.js (comma separated)"
                    />
                    {formErrors.skills && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.skills}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      Enter skills separated by commas
                    </p>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" />
                    Resume
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Resume <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed ${
                      formErrors.resume ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } rounded-xl p-8 text-center hover:border-blue-300 transition-colors`}>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload size={32} className={`mx-auto mb-3 ${
                          formErrors.resume ? 'text-red-400' : 'text-gray-300'
                        }`} />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          PDF only, max 5MB
                        </p>
                      </label>
                    </div>
                    {formErrors.resume && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.resume}
                      </p>
                    )}
                    {cvFile && !formErrors.resume && (
                      <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                        <FileText size={18} className="text-green-600" />
                        <span className="text-sm text-green-700">Resume uploaded successfully</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <MessageSquare size={20} className="text-blue-500" />
                    Additional Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Source */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                      >
                        <option value="">Select Source</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Referral">Referral</option>
                        <option value="Company Website">Company Website</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                      placeholder="Any additional notes about the candidate..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding Candidate...
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Add Candidate
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-8 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Candidate Details Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">
                      {selectedCandidate.name?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedCandidate.name}</h2>
                      <p className="text-gray-500">{selectedCandidate.role}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(selectedCandidate.stage)}`}>
                          {selectedCandidate.stage}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">Applied: {selectedCandidate.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCandidate(null)} 
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Personal Info */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <User size={18} className="text-blue-500" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail size={16} className="text-blue-400" />
                          <span className="text-sm">{selectedCandidate.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone size={16} className="text-blue-400" />
                          <span className="text-sm">{selectedCandidate.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin size={16} className="text-blue-400" />
                          <span className="text-sm">{selectedCandidate.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Briefcase size={18} className="text-blue-500" />
                        Professional Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-400">Current Company</p>
                          <p className="text-sm font-medium">{selectedCandidate.currentCompany || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Experience</p>
                          <p className="text-sm font-medium">{selectedCandidate.experience}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Education</p>
                          <p className="text-sm font-medium">{selectedCandidate.education || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Expected Salary</p>
                          <p className="text-sm font-medium">{selectedCandidate.expectedSalary || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Notice Period</p>
                          <p className="text-sm font-medium">{selectedCandidate.noticePeriod || "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Award size={18} className="text-blue-500" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-white text-blue-600 rounded-lg text-xs font-medium shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedCandidate.notes && (
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                          <MessageSquare size={18} className="text-blue-500" />
                          Notes
                        </h3>
                        <p className="text-sm text-gray-600">{selectedCandidate.notes}</p>
                      </div>
                    )}

                    {/* Resume */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileText size={24} className="text-blue-600" />
                          <div>
                            <p className="font-bold text-gray-800">Resume.pdf</p>
                            <p className="text-xs text-gray-500">Uploaded on {selectedCandidate.appliedDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all">
                          <Eye size={16} /> View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                          <Download size={16} /> Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Rounds & Feedback */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" />
                        Interview Rounds
                      </h3>

                      <div className="space-y-4">
                        {selectedCandidate.rounds?.map((round, index) => (
                          <motion.div
                            key={round.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-5 rounded-xl border-2 ${
                              round.status === 'completed' ? 'border-green-200 bg-green-50/50' :
                              round.status === 'scheduled' ? 'border-blue-200 bg-blue-50/50' :
                              round.status === 'pending' ? 'border-yellow-200 bg-yellow-50/50' :
                              'border-gray-200 bg-white opacity-60'
                            }`}
                          >
                            {/* Round Number Indicator */}
                            <div className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 ${
                              round.status === 'completed' ? 'border-green-500' :
                              round.status === 'scheduled' ? 'border-blue-500' :
                              round.status === 'pending' ? 'border-yellow-500' :
                              'border-gray-300'
                            } flex items-center justify-center text-xs font-bold ${
                              round.status === 'completed' ? 'text-green-600' :
                              round.status === 'scheduled' ? 'text-blue-600' :
                              round.status === 'pending' ? 'text-yellow-600' :
                              'text-gray-400'
                            }`}>
                              {index + 1}
                            </div>

                            <div className="ml-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-bold text-gray-800">{round.name}</h4>
                                  <p className="text-xs text-gray-500">Interviewer: {round.interviewer || 'TBD'}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoundStatusColor(round.status)}`}>
                                  {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                                </span>
                              </div>

                              {round.duration && (
                                <p className="text-xs text-gray-400 mb-2">Duration: {round.duration}</p>
                              )}

                              {round.date && (
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                                  <Calendar size={14} className="text-blue-400" />
                                  <span>{round.date}</span>
                                  {round.time && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <Clock size={14} className="text-blue-400" />
                                      <span>{round.time}</span>
                                    </>
                                  )}
                                </div>
                              )}

                              {round.feedback && (
                                <div className="mb-3 p-3 bg-white rounded-lg border border-gray-100">
                                  <p className="text-sm text-gray-600">{round.feedback}</p>
                                  {round.score && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-gray-400">Score:</span>
                                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getScoreColor(round.score)}`}>
                                        {round.score}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Action Buttons based on round status */}
                              {round.status === 'pending' && index === selectedCandidate.currentRound && (
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => setSelectedRound({ 
                                      candidateId: selectedCandidate.id, 
                                      roundId: round.id 
                                    })}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle2 size={16} />
                                    Provide Feedback
                                  </button>
                                  <button
                                    onClick={() => scheduleInterview(selectedCandidate.id, round.id)}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-200 transition-all"
                                  >
                                    <Calendar size={16} />
                                  </button>
                                </div>
                              )}

                              {round.status === 'scheduled' && (
                                <div className="mt-3">
                                  <button
                                    onClick={() => setSelectedRound({ 
                                      candidateId: selectedCandidate.id, 
                                      roundId: round.id 
                                    })}
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
                                  >
                                    Mark as Completed
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      {selectedCandidate.stage !== "Offered" && selectedCandidate.stage !== "Rejected" && (
                        <button 
                          onClick={() => moveToNextRound(selectedCandidate.id)}
                          className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                          disabled={selectedCandidate.rounds?.[selectedCandidate.currentRound]?.status === 'pending'}
                        >
                          {selectedCandidate.stage === "HR Final" ? "Make Offer" : "Move to Next Round"}
                          <ArrowRight size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => rejectCandidate(selectedCandidate.id)}
                        className="px-8 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center gap-2"
                      >
                        <ThumbsDown size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {selectedRound && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRound(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Provide Feedback</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                    placeholder="Enter your feedback for this round..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={feedbackScore}
                    onChange={(e) => setFeedbackScore(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Enter score"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      provideFeedback(selectedRound.candidateId, selectedRound.roundId);
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Submit Feedback
                  </button>
                  <button
                    onClick={() => setSelectedRound(null)}
                    className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSS for no scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Recruitment;