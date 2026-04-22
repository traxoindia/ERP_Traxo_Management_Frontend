import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, Phone, MapPin, CreditCard, AlertCircle,
  CheckCircle, Loader2, ArrowLeft, Briefcase, FileText, Upload,
  X, Eye, Calendar, Award, GraduationCap, Building, Shield,
  Heart, Copy, ExternalLink, ChevronRight, ChevronLeft,
  Save, Users, Star, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "https://api.wemis.in/api";
const FRONTEND_URL = "https://traxoerp.com";

const BGVPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL params or localStorage
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState({
    AADHAR_CARD: null,
    PAN_CARD: null,
    DEGREE_CERTIFICATE: null,
    PHOTOGRAPH: null
  });
  const [uploading, setUploading] = useState({});
  const [existingStatus, setExistingStatus] = useState(null);
  
  // BGV Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    contactNumber: '',
    currentAddress: '',
    permanentAddress: '',
    aadharNumber: '',
    panNumber: '',
    educationDetails: [
      { qualification: '', university: '', passingYear: '', percentage: '' }
    ],
    employmentHistory: [
      { companyName: '', designation: '', duration: '', experienceLetter: false }
    ],
    references: [
      { name: '', contactNumber: '', relationship: '', company: '' }
    ]
  });
  
  // Onboarding Form State (without bank details)
  const [onboardingData, setOnboardingData] = useState({
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyRelationship: '',
    bloodGroup: '',
    dateOfJoining: ''
  });
  
  // Extract token from URL on mount and save to localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenParam = urlParams.get('token');
    
    console.log("Token from URL:", tokenParam);
    
    if (!tokenParam) {
      // Check if token exists in localStorage
      const savedToken = localStorage.getItem('bgv_token');
      if (savedToken) {
        console.log("Token found in localStorage:", savedToken);
        setToken(savedToken);
        fetchExistingSubmission(savedToken);
      } else {
        setError('No verification token found. Please use the link sent to your email.');
      }
    } else {
      // Save token to localStorage
      localStorage.setItem('bgv_token', tokenParam);
      setToken(tokenParam);
      fetchExistingSubmission(tokenParam);
    }
  }, [location]);
  
  // Fetch existing submission if any
  const fetchExistingSubmission = async (tokenParam) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/public/bgv/status?token=${tokenParam}`);
      console.log('Existing submission:', response.data);
      
      if (response.data?.data) {
        const existing = response.data.data;
        setSubmissionId(existing.id);
        setExistingStatus(existing.status);
        
        // Pre-fill form if data exists
        if (existing.formData) {
          setFormData(prev => ({ ...prev, ...existing.formData }));
        }
        
        // Set step based on completion status
        if (existing.status === 'SUBMITTED') setStep(2);
        if (existing.status === 'DOCUMENTS_UPLOADED') setStep(3);
        if (existing.status === 'ONBOARDING_SUBMITTED') {
          setSuccess('Your onboarding is already completed! Thank you.');
        }
      }
    } catch (err) {
      console.log('No existing submission or error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle BGV Form Submission
  const handleSubmitBGV = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid token. Please use the link from your email.');
      return;
    }
    
    // Validate Aadhar
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(formData.aadharNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }
    
    // Validate PAN
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber.toUpperCase())) {
      setError('Please enter a valid PAN card number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        fullName: formData.fullName,
        dob: formData.dob,
        contactNumber: formData.contactNumber,
        currentAddress: formData.currentAddress,
        permanentAddress: formData.permanentAddress || formData.currentAddress,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber.toUpperCase(),
        educationDetails: formData.educationDetails.filter(edu => edu.qualification && edu.university),
        employmentHistory: formData.employmentHistory.filter(emp => emp.companyName && emp.designation),
        references: formData.references.filter(ref => ref.name && ref.contactNumber)
      };
      
      const response = await axios.post(
        `${API_BASE}/public/bgv/submit-verification?token=${token}`,
        payload
      );
      
      console.log('BGV Submission Response:', response.data);
      
      setSubmissionId(response.data?.data?.id || response.data?.id);
      setSuccess('✓ Verification details submitted successfully!');
      setStep(2);
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('BGV Submission Error:', err);
      setError(err.response?.data?.message || 'Failed to submit verification details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Document Upload
  const handleFileUpload = async (documentType, file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError(`${documentType} file size should be less than 5MB`);
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError(`${documentType} must be a PDF, JPEG, or PNG file`);
      return;
    }
    
    setUploading(prev => ({ ...prev, [documentType]: true }));
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(
        `${API_BASE}/public/bgv/upload-docs?token=${token}&documentType=${documentType}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      console.log(`Upload ${documentType}:`, response.data);
      
      setUploadedDocs(prev => ({
        ...prev,
        [documentType]: { file, url: response.data?.data?.fileUrl, uploaded: true }
      }));
      
      setSuccess(`✓ ${documentType.replace('_', ' ')} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Upload Error:', err);
      setError(`Failed to upload ${documentType}. Please try again.`);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };
  
  // Handle Onboarding Submission (without bank details)
  const handleSubmitOnboarding = async (e) => {
    e.preventDefault();
    
    if (!onboardingData.emergencyContactName || !onboardingData.emergencyContactNumber) {
      setError('Please fill emergency contact details');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        emergencyContactName: onboardingData.emergencyContactName,
        emergencyContactNumber: onboardingData.emergencyContactNumber,
        emergencyRelationship: onboardingData.emergencyRelationship,
        bloodGroup: onboardingData.bloodGroup,
        dateOfJoining: onboardingData.dateOfJoining || new Date().toISOString().split('T')[0]
      };
      
      const response = await axios.post(
        `${API_BASE}/public/bgv/submit-onboarding?token=${token}`,
        payload
      );
      
      console.log('Onboarding Submission Response:', response.data);
      
      setSuccess('🎉 Onboarding completed successfully! You will receive your offer letter shortly.');
      
      // Clear token from localStorage after successful completion
      localStorage.removeItem('bgv_token');
      
      setTimeout(() => {
        navigate('/onboarding-success');
      }, 3000);
      
    } catch (err) {
      console.error('Onboarding Error:', err);
      setError(err.response?.data?.message || 'Failed to submit onboarding details');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions for dynamic fields
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationDetails: [...prev.educationDetails, { qualification: '', university: '', passingYear: '', percentage: '' }]
    }));
  };
  
  const removeEducation = (index) => {
    if (formData.educationDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        educationDetails: prev.educationDetails.filter((_, i) => i !== index)
      }));
    }
  };
  
  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      educationDetails: prev.educationDetails.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  const addEmployment = () => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: [...prev.employmentHistory, { companyName: '', designation: '', duration: '', experienceLetter: false }]
    }));
  };
  
  const removeEmployment = (index) => {
    if (formData.employmentHistory.length > 1) {
      setFormData(prev => ({
        ...prev,
        employmentHistory: prev.employmentHistory.filter((_, i) => i !== index)
      }));
    }
  };
  
  const updateEmployment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.map((emp, i) => 
        i === index ? { ...emp, [field]: value } : emp
      )
    }));
  };
  
  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', contactNumber: '', relationship: '', company: '' }]
    }));
  };
  
  const removeReference = (index) => {
    if (formData.references.length > 1) {
      setFormData(prev => ({
        ...prev,
        references: prev.references.filter((_, i) => i !== index)
      }));
    }
  };
  
  const updateReference = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };
  
  const allDocumentsUploaded = () => {
    return uploadedDocs.AADHAR_CARD?.uploaded && 
           uploadedDocs.PAN_CARD?.uploaded && 
           uploadedDocs.DEGREE_CERTIFICATE?.uploaded;
  };
  
  // Step indicator
  const StepIndicator = () => {
    const steps = [
      { number: 1, label: 'Personal & Professional', icon: User },
      { number: 2, label: 'Document Upload', icon: Upload },
      { number: 3, label: 'Emergency Details', icon: Heart }
    ];
    
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((s, idx) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                  ${step >= s.number ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-400'}
                `}>
                  {step > s.number ? <CheckCircle size={20} /> : <s.icon size={20} />}
                </div>
                <span className="text-[10px] mt-2 text-gray-500 uppercase tracking-widest hidden md:block">
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${step > s.number ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  if (loading && !formData.fullName) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-sm text-gray-500">Loading your onboarding portal...</p>
        </div>
      </div>
    );
  }
  
  if (!token && !loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-xl font-light mb-2">Invalid Access</h2>
          <p className="text-gray-400 text-sm mb-6">
            No verification token found. Please use the link sent to your email address.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight">BGV & Onboarding Portal</h1>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                Complete your verification to join the team
              </p>
            </div>
            {token && (
              <div className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                Token: {token.substring(0, 12)}...
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <StepIndicator />
        
        <AnimatePresence>
          {error && (
            <motion.div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-xs text-red-600 flex-1">{error}</p>
              <button onClick={() => setError(null)}>
                <X size={14} className="text-red-400" />
              </button>
            </motion.div>
          )}
          
          {success && (
            <motion.div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle size={16} className="text-green-500" />
              <p className="text-xs text-green-600 flex-1">{success}</p>
              <button onClick={() => setSuccess(null)}>
                <X size={14} className="text-green-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitBGV}
            className="space-y-6"
          >
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={16} className="text-gray-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="As per Aadhar Card"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="10-digit mobile number"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{12}"
                    maxLength="12"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="12-digit Aadhar number"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="10"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm uppercase"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
              
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Current Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({...formData, currentAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm resize-none"
                    placeholder="Flat/House No., Street, City, State, PIN Code"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Permanent Address
                  </label>
                  <textarea
                    rows="2"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({...formData, permanentAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm resize-none"
                    placeholder="Leave blank if same as current address"
                  />
                </div>
              </div>
            </div>
            
            {/* Education Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap size={16} className="text-gray-600" />
                  Education Details
                </h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  + Add Education
                </button>
              </div>
              
              {formData.educationDetails.map((edu, index) => (
                <div key={index} className="mb-5 pb-5 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">Education #{index + 1}</span>
                    {formData.educationDetails.length > 1 && (
                      <button type="button" onClick={() => removeEducation(index)} className="text-red-500 text-[10px] hover:text-red-600">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Qualification (e.g., B.Tech, MBA)"
                      value={edu.qualification}
                      onChange={(e) => updateEducation(index, 'qualification', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="University/Board"
                      value={edu.university}
                      onChange={(e) => updateEducation(index, 'university', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Passing Year"
                      value={edu.passingYear}
                      onChange={(e) => updateEducation(index, 'passingYear', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Percentage/CGPA"
                      value={edu.percentage}
                      onChange={(e) => updateEducation(index, 'percentage', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Employment History Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={16} className="text-gray-600" />
                  Employment History
                </h2>
                <button
                  type="button"
                  onClick={addEmployment}
                  className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  + Add Experience
                </button>
              </div>
              
              {formData.employmentHistory.map((emp, index) => (
                <div key={index} className="mb-5 pb-5 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">Experience #{index + 1}</span>
                    {formData.employmentHistory.length > 1 && (
                      <button type="button" onClick={() => removeEmployment(index)} className="text-red-500 text-[10px] hover:text-red-600">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={emp.companyName}
                      onChange={(e) => updateEmployment(index, 'companyName', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Designation"
                      value={emp.designation}
                      onChange={(e) => updateEmployment(index, 'designation', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 2 Years)"
                      value={emp.duration}
                      onChange={(e) => updateEmployment(index, 'duration', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emp.experienceLetter}
                        onChange={(e) => updateEmployment(index, 'experienceLetter', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-[10px] text-gray-600">Experience Letter Available</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            {/* References Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Users size={16} className="text-gray-600" />
                  Professional References
                </h2>
                <button
                  type="button"
                  onClick={addReference}
                  className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  + Add Reference
                </button>
              </div>
              
              {formData.references.map((ref, index) => (
                <div key={index} className="mb-5 pb-5 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500 font-medium">Reference #{index + 1}</span>
                    {formData.references.length > 1 && (
                      <button type="button" onClick={() => removeReference(index)} className="text-red-500 text-[10px] hover:text-red-600">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={ref.name}
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      value={ref.contactNumber}
                      onChange={(e) => updateReference(index, 'contactNumber', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Relationship (e.g., Manager, Colleague)"
                      value={ref.relationship}
                      onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={ref.company}
                      onChange={(e) => updateReference(index, 'company', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <ChevronRight size={16} />}
              {loading ? 'Submitting...' : 'Continue to Document Upload'}
            </button>
          </motion.form>
        )}
        
        {/* STEP 2: Document Upload */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Upload size={16} className="text-gray-600" />
                Upload Required Documents
              </h2>
              
              <p className="text-xs text-gray-500 mb-6">
                Please upload clear, legible copies of the following documents. 
                Accepted formats: PDF, JPEG, PNG (Max 5MB each)
              </p>
              
              <div className="space-y-5">
                {/* Aadhar Card */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium">Aadhar Card</h3>
                      <p className="text-[10px] text-gray-400">Front & Back (or combined PDF)</p>
                    </div>
                    {uploadedDocs.AADHAR_CARD?.uploaded && <CheckCircle size={20} className="text-green-500" />}
                  </div>
                  
                  {!uploadedDocs.AADHAR_CARD?.uploaded ? (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors cursor-pointer bg-gray-50">
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-500">Click to upload Aadhar Card</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload('AADHAR_CARD', e.target.files[0])}
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-xs">Aadhar Card uploaded successfully</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedDocs(prev => ({ ...prev, AADHAR_CARD: null }))}
                        className="text-red-500 text-[10px] hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                
                {/* PAN Card */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium">PAN Card</h3>
                      <p className="text-[10px] text-gray-400">Clear copy of PAN card</p>
                    </div>
                    {uploadedDocs.PAN_CARD?.uploaded && <CheckCircle size={20} className="text-green-500" />}
                  </div>
                  
                  {!uploadedDocs.PAN_CARD?.uploaded ? (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors cursor-pointer bg-gray-50">
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-500">Click to upload PAN Card</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload('PAN_CARD', e.target.files[0])}
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-xs">PAN Card uploaded successfully</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedDocs(prev => ({ ...prev, PAN_CARD: null }))}
                        className="text-red-500 text-[10px] hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Degree Certificate */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium">Degree Certificate</h3>
                      <p className="text-[10px] text-gray-400">Highest qualification degree/provisional certificate</p>
                    </div>
                    {uploadedDocs.DEGREE_CERTIFICATE?.uploaded && <CheckCircle size={20} className="text-green-500" />}
                  </div>
                  
                  {!uploadedDocs.DEGREE_CERTIFICATE?.uploaded ? (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors cursor-pointer bg-gray-50">
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-500">Click to upload Degree Certificate</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload('DEGREE_CERTIFICATE', e.target.files[0])}
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-xs">Degree Certificate uploaded successfully</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedDocs(prev => ({ ...prev, DEGREE_CERTIFICATE: null }))}
                        className="text-red-500 text-[10px] hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Photograph (Optional) */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium">Recent Photograph</h3>
                      <p className="text-[10px] text-gray-400">Passport size photo (Optional)</p>
                    </div>
                    {uploadedDocs.PHOTOGRAPH?.uploaded && <CheckCircle size={20} className="text-green-500" />}
                  </div>
                  
                  {!uploadedDocs.PHOTOGRAPH?.uploaded ? (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors cursor-pointer bg-gray-50">
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-500">Click to upload Photograph</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload('PHOTOGRAPH', e.target.files[0])}
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-xs">Photograph uploaded successfully</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedDocs(prev => ({ ...prev, PHOTOGRAPH: null }))}
                        className="text-red-500 text-[10px] hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft size={14} className="inline mr-1" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!allDocumentsUploaded()}
                  className="flex-1 bg-black text-white py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to Emergency Details
                  <ChevronRight size={14} />
                </button>
              </div>
              
              {!allDocumentsUploaded() && (
                <p className="text-[10px] text-red-500 text-center mt-4">
                  Please upload all required documents (Aadhar, PAN, Degree Certificate) to continue
                </p>
              )}
            </div>
          </motion.div>
        )}
        
        {/* STEP 3: Emergency Details (without bank details) */}
        {step === 3 && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitOnboarding}
            className="space-y-6"
          >
            {/* Emergency Contact Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Heart size={16} className="text-gray-600" />
                Emergency Contact Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardingData.emergencyContactName}
                    onChange={(e) => setOnboardingData({...onboardingData, emergencyContactName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="Full name of emergency contact"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={onboardingData.emergencyContactNumber}
                    onChange={(e) => setOnboardingData({...onboardingData, emergencyContactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="10-digit mobile number"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardingData.emergencyRelationship}
                    onChange={(e) => setOnboardingData({...onboardingData, emergencyRelationship: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                    placeholder="e.g., Father, Mother, Spouse"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={onboardingData.bloodGroup}
                    onChange={(e) => setOnboardingData({...onboardingData, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Expected Date of Joining
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={onboardingData.dateOfJoining}
                    onChange={(e) => setOnboardingData({...onboardingData, dateOfJoining: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-600 py-4 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={14} className="inline mr-1" />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-4 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {loading ? 'Submitting...' : 'Submit Onboarding'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default BGVPortal;