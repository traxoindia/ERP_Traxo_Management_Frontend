import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, Phone, Calendar, MapPin, CreditCard, Shield,
  Briefcase, GraduationCap, Upload, CheckCircle, XCircle,
  Loader2, AlertCircle, ArrowLeft, Save, FileText, Building,
  Banknote, Users, Plus, Trash2, Eye, EyeOff
} from 'lucide-react';

const API_BASE = "https://api.wemis.in/api";

const BGVPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [bgvStatus, setBgvStatus] = useState(null);
  const [bgvId, setBgvId] = useState(null);
  
  // Form state for BGV submission
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    contactNumber: '',
    currentAddress: '',
    aadharNumber: '',
    panNumber: '',
    educationDetails: [
      { qualification: '', university: '', passingYear: '', percentage: '' }
    ],
    employmentHistory: [
      { companyName: '', designation: '', duration: '', responsibilities: '' }
    ],
    references: [
      { name: '', contactNumber: '', relationship: '' }
    ]
  });
  
  // Document upload state
  const [documents, setDocuments] = useState({
    AADHAR_CARD: null,
    PAN_CARD: null,
    DEGREE_CERTIFICATE: null,
    EXPERIENCE_LETTER: null,
    PHOTOGRAPH: null
  });
  
  const [uploadProgress, setUploadProgress] = useState({});
  
  // Extract token from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get('token');
    
    if (!urlToken) {
      setError("Invalid BGV link. No token provided.");
      setLoading(false);
      return;
    }
    
    setToken(urlToken);
    // Store token in localStorage
    localStorage.setItem("bgvToken", urlToken);
    fetchCandidateDetails(urlToken);
  }, [location]);
  
  // Fetch candidate details using token
  const fetchCandidateDetails = async (urlToken) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching candidate details with token:", urlToken);
      
      // Call GET /api/hr/bgv/get-details/token
      const response = await axios.get(`${API_BASE}/hr/bgv/get-details/${urlToken}`);
      
      console.log("Candidate Details Response:", response.data);
      
      const data = response.data?.data || response.data;
      
      if (data) {
        setCandidateData(data);
        setBgvStatus(data.status || 'PENDING_BGV');
        setBgvId(data.id || data.bgvId);
        
        // Pre-fill form with existing data if any
        setFormData({
          fullName: data.fullName || '',
          dob: data.dob || '',
          contactNumber: data.contactNumber || data.phoneNumber || '',
          currentAddress: data.currentAddress || '',
          aadharNumber: data.aadharNumber || '',
          panNumber: data.panNumber || '',
          educationDetails: data.educationDetails && data.educationDetails.length > 0 
            ? data.educationDetails 
            : [{ qualification: '', university: '', passingYear: '', percentage: '' }],
          employmentHistory: data.employmentHistory && data.employmentHistory.length > 0 
            ? data.employmentHistory 
            : [{ companyName: '', designation: '', duration: '', responsibilities: '' }],
          references: data.references && data.references.length > 0 
            ? data.references 
            : [{ name: '', contactNumber: '', relationship: '' }]
        });
      }
      
    } catch (err) {
      console.error('Fetch Candidate Details Error:', err);
      if (err.response?.status === 404) {
        setError("BGV record not found. The link may have expired or is invalid.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized access. Please check your BGV link.");
      } else {
        setError(err.response?.data?.message || "Failed to load your details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e, section, index, field) => {
    const { value } = e.target;
    
    if (section === 'education' && index !== undefined) {
      const updated = [...formData.educationDetails];
      updated[index][field] = value;
      setFormData({ ...formData, educationDetails: updated });
    } 
    else if (section === 'employment' && index !== undefined) {
      const updated = [...formData.employmentHistory];
      updated[index][field] = value;
      setFormData({ ...formData, employmentHistory: updated });
    }
    else if (section === 'reference' && index !== undefined) {
      const updated = [...formData.references];
      updated[index][field] = value;
      setFormData({ ...formData, references: updated });
    }
    else {
      setFormData({ ...formData, [field]: value });
    }
  };
  
  // Add new row to arrays
  const addRow = (section) => {
    if (section === 'education') {
      setFormData({
        ...formData,
        educationDetails: [...formData.educationDetails, { qualification: '', university: '', passingYear: '', percentage: '' }]
      });
    } else if (section === 'employment') {
      setFormData({
        ...formData,
        employmentHistory: [...formData.employmentHistory, { companyName: '', designation: '', duration: '', responsibilities: '' }]
      });
    } else if (section === 'reference') {
      setFormData({
        ...formData,
        references: [...formData.references, { name: '', contactNumber: '', relationship: '' }]
      });
    }
  };
  
  // Remove row
  const removeRow = (section, index) => {
    if (section === 'education' && formData.educationDetails.length > 1) {
      const updated = formData.educationDetails.filter((_, i) => i !== index);
      setFormData({ ...formData, educationDetails: updated });
    } else if (section === 'employment' && formData.employmentHistory.length > 1) {
      const updated = formData.employmentHistory.filter((_, i) => i !== index);
      setFormData({ ...formData, employmentHistory: updated });
    } else if (section === 'reference' && formData.references.length > 1) {
      const updated = formData.references.filter((_, i) => i !== index);
      setFormData({ ...formData, references: updated });
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (documentType, file) => {
    if (!file) return;
    if (!token) {
      setError("Invalid token. Please refresh the page.");
      return;
    }
    
    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    
    const formDataFile = new FormData();
    formDataFile.append('file', file);
    
    try {
      const response = await axios.post(
        `${API_BASE}/public/bgv/upload-docs?token=${token}&documentType=${documentType}`,
        formDataFile,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, [documentType]: percentCompleted }));
          }
        }
      );
      
      console.log(`Upload ${documentType} Response:`, response.data);
      
      setDocuments(prev => ({ ...prev, [documentType]: file.name }));
      setSuccess(`${documentType} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error(`Upload ${documentType} Error:`, err);
      setError(err.response?.data?.message || `Failed to upload ${documentType}. Please try again.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploading(false);
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    }
  };
  
  // Submit BGV verification details
  const submitVerification = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.dob || !formData.contactNumber || !formData.currentAddress) {
      setError("Please fill in all required fields (Full Name, Date of Birth, Contact Number, Current Address)");
      return;
    }
    
    if (!formData.aadharNumber && !formData.panNumber) {
      setError("Please provide at least one ID proof (Aadhar Number or PAN Number)");
      return;
    }
    
    if (!token) {
      setError("Invalid token. Please refresh the page.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    // Prepare submission data
    const submissionData = {
      fullName: formData.fullName,
      dob: formData.dob,
      contactNumber: formData.contactNumber,
      currentAddress: formData.currentAddress,
      aadharNumber: formData.aadharNumber,
      panNumber: formData.panNumber,
      educationDetails: formData.educationDetails.filter(edu => edu.qualification && edu.university),
      employmentHistory: formData.employmentHistory.filter(emp => emp.companyName && emp.designation),
      references: formData.references.filter(ref => ref.name && ref.contactNumber)
    };
    
    try {
      console.log("Submitting BGV Verification...");
      
      const response = await axios.post(
        `${API_BASE}/public/bgv/submit-verification?token=${token}`,
        submissionData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log("Submit Verification Response:", response.data);
      
      setSuccess("Verification details submitted successfully! Please complete document upload.");
      
      // Refresh candidate data to show updated status
      await fetchCandidateDetails(token);
      
    } catch (err) {
      console.error('Submit Verification Error:', err);
      setError(err.response?.data?.message || "Failed to submit verification details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Submit onboarding details (emergency contact only)
  const submitOnboarding = async (e) => {
    e.preventDefault();
    
    const emergencyContactName = e.target.emergencyContactName?.value;
    const emergencyContactNumber = e.target.emergencyContactNumber?.value;
    
    if (!emergencyContactName || !emergencyContactNumber) {
      setError("Please fill in all emergency contact details");
      return;
    }
    
    if (!token) {
      setError("Invalid token. Please refresh the page.");
      return;
    }
    
    setSubmitting(true);
    
    const onboardingData = {
      emergencyContactName,
      emergencyContactNumber
    };
    
    try {
      console.log("Submitting Onboarding Details...");
      
      const response = await axios.post(
        `${API_BASE}/public/bgv/submit-onboarding?token=${token}`,
        onboardingData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log("Submit Onboarding Response:", response.data);
      
      setSuccess("Onboarding details submitted successfully! You will be redirected shortly.");
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/onboarding-success');
      }, 2000);
      
    } catch (err) {
      console.error('Submit Onboarding Error:', err);
      setError(err.response?.data?.message || "Failed to submit onboarding details. Please try again.");
      setSubmitting(false);
    }
  };
  
  // Check if verification is already submitted
  const isVerificationSubmitted = () => {
    return bgvStatus && (bgvStatus === 'SUBMITTED' || bgvStatus === 'UNDER_REVIEW' || bgvStatus === 'APPROVED');
  };
  
  // Check if onboarding is completed
  const isOnboardingCompleted = () => {
    return bgvStatus === 'APPROVED';
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-500 text-sm">Loading your details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !candidateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-light mb-2">Invalid BGV Link</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  // Main render - Two steps: Verification Form then Onboarding Form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">Background Verification</h1>
          <p className="text-gray-500 text-sm">Please complete your verification details</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className={`text-center ${!isVerificationSubmitted() ? 'text-black' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                !isVerificationSubmitted() ? 'bg-black text-white' : 'bg-green-100'
              }`}>
                {isVerificationSubmitted() ? <CheckCircle size={16} /> : <Shield size={16} />}
              </div>
              <span className="text-[10px] uppercase tracking-widest">Verification</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className={`text-center ${isVerificationSubmitted() && !isOnboardingCompleted() ? 'text-black' : isOnboardingCompleted() ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                isOnboardingCompleted() ? 'bg-green-100' : isVerificationSubmitted() ? 'bg-black text-white' : 'bg-gray-100'
              }`}>
                {isOnboardingCompleted() ? <CheckCircle size={16} /> : <Users size={16} />}
              </div>
              <span className="text-[10px] uppercase tracking-widest">Emergency Contact</span>
            </div>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-500" />
            <p className="text-sm text-green-700 flex-1">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
          </div>
        )}
        
        {/* Step 1: Verification Form */}
        {!isVerificationSubmitted() && (
          <form onSubmit={submitVerification} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange(e, null, null, 'fullName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange(e, null, null, 'dob')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange(e, null, null, 'contactNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Current Address *</label>
                  <textarea
                    value={formData.currentAddress}
                    onChange={(e) => handleInputChange(e, null, null, 'currentAddress')}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Number</label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => handleInputChange(e, null, null, 'aadharNumber')}
                    placeholder="1234-5678-9012"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange(e, null, null, 'panNumber')}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>
            
            {/* Education Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education Details
                </h2>
                <button
                  type="button"
                  onClick={() => addRow('education')}
                  className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>
              
              {formData.educationDetails.map((edu, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 mb-4 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium">Education #{idx + 1}</span>
                    {formData.educationDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow('education', idx)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Qualification (e.g., 10th, B.Tech)"
                      value={edu.qualification}
                      onChange={(e) => handleInputChange(e, 'education', idx, 'qualification')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="University/Board"
                      value={edu.university}
                      onChange={(e) => handleInputChange(e, 'education', idx, 'university')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Passing Year"
                      value={edu.passingYear}
                      onChange={(e) => handleInputChange(e, 'education', idx, 'passingYear')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Percentage/CGPA"
                      value={edu.percentage}
                      onChange={(e) => handleInputChange(e, 'education', idx, 'percentage')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Employment History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase size={20} />
                  Employment History
                </h2>
                <button
                  type="button"
                  onClick={() => addRow('employment')}
                  className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>
              
              {formData.employmentHistory.map((emp, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 mb-4 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium">Experience #{idx + 1}</span>
                    {formData.employmentHistory.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow('employment', idx)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={emp.companyName}
                      onChange={(e) => handleInputChange(e, 'employment', idx, 'companyName')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Designation"
                      value={emp.designation}
                      onChange={(e) => handleInputChange(e, 'employment', idx, 'designation')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 2 Years)"
                      value={emp.duration}
                      onChange={(e) => handleInputChange(e, 'employment', idx, 'duration')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <textarea
                      placeholder="Key Responsibilities"
                      value={emp.responsibilities}
                      onChange={(e) => handleInputChange(e, 'employment', idx, 'responsibilities')}
                      rows="2"
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* References */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users size={20} />
                  Professional References
                </h2>
                <button
                  type="button"
                  onClick={() => addRow('reference')}
                  className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Plus size={14} /> Add Reference
                </button>
              </div>
              
              {formData.references.map((ref, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 mb-4 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium">Reference #{idx + 1}</span>
                    {formData.references.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow('reference', idx)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={ref.name}
                      onChange={(e) => handleInputChange(e, 'reference', idx, 'name')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      value={ref.contactNumber}
                      onChange={(e) => handleInputChange(e, 'reference', idx, 'contactNumber')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={ref.relationship}
                      onChange={(e) => handleInputChange(e, 'reference', idx, 'relationship')}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Document Uploads */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Document Uploads
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(documents).map((docType) => (
                  <div key={docType} className="border border-gray-200 rounded p-3">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {docType.replace('_', ' ')}
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(docType, e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm"
                      disabled={uploading}
                    />
                    {uploadProgress[docType] > 0 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all"
                            style={{ width: `${uploadProgress[docType]}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{uploadProgress[docType]}%</p>
                      </div>
                    )}
                    {documents[docType] && (
                      <p className="text-xs text-green-600 mt-1">✓ {documents[docType]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
              {submitting ? 'Submitting...' : 'Submit Verification Details'}
            </button>
          </form>
        )}
        
        {/* Step 2: Onboarding Form (Emergency Contact Only) */}
        {isVerificationSubmitted() && !isOnboardingCompleted() && (
          <form onSubmit={submitOnboarding} className="space-y-6">
            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={20} />
                Emergency Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Onboarding Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              {submitting ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          </form>
        )}
        
        {/* Completion State */}
        {isOnboardingCompleted() && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-light mb-2">Onboarding Completed!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Thank you for completing your onboarding. Your offer letter and further instructions 
              will be sent to your email shortly.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg"
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BGVPortal;