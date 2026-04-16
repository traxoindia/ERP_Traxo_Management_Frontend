import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  User,


  Banknote,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Home,
  Briefcase,
  FileText,
  Upload,
  X,
  Eye,
  Download,
  
  GraduationCap,
 
  

  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackNavbar from './BackNavbar';

// Configuration
const config = {
  API_BASE:'https://api.wemis.in/api',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  RETRY_ATTEMPTS: 3,
  STORAGE_KEY_PREFIX: 'onboarding_'
};

// Utility functions
const sanitizeInput = (input) => {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

const formatAadhar = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 12);
};

const formatPAN = (value) => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
};

const formatIFSC = (value) => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
};

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [token, setToken] = useState(null);
  const [bgvId, setBgvId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  
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
  
  // Onboarding Form State
  const [onboardingData, setOnboardingData] = useState({
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    upiId: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyRelationship: '',
    bloodGroup: '',
    dateOfJoining: ''
  });
  
  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState({
    AADHAR_CARD: null,
    PAN_CARD: null,
    DEGREE_CERTIFICATE: null,
    PHOTOGRAPH: null
  });
  
  // Extract token and bgvId from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenParam = urlParams.get('token');
    const bgvIdParam = urlParams.get('bgvId');
    
    if (!tokenParam) {
      setError('No verification token found. Please use the link sent to your email.');
    } else {
      setToken(tokenParam);
      setBgvId(bgvIdParam);
      
      // Store token in sessionStorage for security
      sessionStorage.setItem('onboarding_token', tokenParam);
      if (bgvIdParam) sessionStorage.setItem('bgv_id', bgvIdParam);
      
      // Load saved data and check status
      loadSavedData(tokenParam);
      checkBGVStatus(tokenParam, bgvIdParam);
    }
    
    // Cleanup
    return () => {
      sessionStorage.removeItem('onboarding_token');
      sessionStorage.removeItem('bgv_id');
    };
  }, [location]);
  
  // Load saved form data from localStorage
  const loadSavedData = (tokenParam) => {
    const saved = localStorage.getItem(`${config.STORAGE_KEY_PREFIX}${tokenParam}`);
    if (saved) {
      try {
        const { formData: savedForm, onboardingData: savedOnboarding, step: savedStep, uploadedDocs: savedDocs } = JSON.parse(saved);
        if (savedForm) setFormData(savedForm);
        if (savedOnboarding) setOnboardingData(savedOnboarding);
        if (savedStep) setStep(savedStep);
        if (savedDocs) setUploadedDocs(savedDocs);
      } catch (err) {
        console.error('Error loading saved data:', err);
      }
    }
  };
  
  // Save form data to localStorage
  const saveFormData = useCallback(() => {
    if (token) {
      localStorage.setItem(`${config.STORAGE_KEY_PREFIX}${token}`, JSON.stringify({
        formData,
        onboardingData,
        step,
        uploadedDocs
      }));
    }
  }, [token, formData, onboardingData, step, uploadedDocs]);
  
  // Auto-save on data change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (token && (formData.fullName || onboardingData.bankName)) {
        saveFormData();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [formData, onboardingData, step, uploadedDocs, token, saveFormData]);
  
  // Check BGV status
  const checkBGVStatus = async (tokenParam, bgvIdParam) => {
    setLoading(true);
    try {
      // First, try to get status from the BGV endpoint
      const response = await axios.get(`${config.API_BASE}/public/bgv/status`, {
        params: { token: tokenParam }
      });
      
      console.log('BGV Status:', response.data);
      
      if (response.data?.data) {
        const existingData = response.data.data;
        setSubmissionId(existingData.id);
        
        if (existingData.employeeId) {
          setEmployeeId(existingData.employeeId);
        }
        
        // Determine current step based on completion status
        if (existingData.onboardingCompleted) {
          setStep(4); // Completed
        } else if (existingData.documentsSubmitted) {
          setStep(3);
        } else if (existingData.formSubmitted) {
          setStep(2);
        }
      }
    } catch (err) {
      console.error('Fetch BGV Status Error:', err);
      // New submission - no existing data
    } finally {
      setLoading(false);
    }
  };
  
  // Handle BGV Form Submission
  const handleSubmitBGV = async (e) => {
    e.preventDefault();
    
    // Validation
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(formData.aadharNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber.toUpperCase())) {
      setError('Please enter a valid PAN card number');
      return;
    }
    
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    
    if (!formData.dob) {
      setError('Date of birth is required');
      return;
    }
    
    if (!formData.contactNumber.match(/^\d{10}$/)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        fullName: sanitizeInput(formData.fullName),
        dob: formData.dob,
        contactNumber: formData.contactNumber,
        currentAddress: sanitizeInput(formData.currentAddress),
        permanentAddress: sanitizeInput(formData.permanentAddress || formData.currentAddress),
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber.toUpperCase(),
        educationDetails: formData.educationDetails.filter(edu => edu.qualification && edu.university),
        employmentHistory: formData.employmentHistory.filter(emp => emp.companyName && emp.designation),
        references: formData.references.filter(ref => ref.name && ref.contactNumber)
      };
      
      let response;
      if (bgvId) {
        // Update existing BGV
        response = await axios.put(
          `${config.API_BASE}/public/bgv/update-verification?token=${token}`,
          payload
        );
      } else {
        // Create new BGV submission
        response = await axios.post(
          `${config.API_BASE}/public/bgv/submit-verification?token=${token}`,
          payload
        );
      }
      
      console.log('BGV Submission Response:', response.data);
      
      setSubmissionId(response.data?.data?.id || response.data?.id);
      setSuccess('Verification details submitted successfully!');
      setStep(2);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('BGV Submission Error:', err);
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || 'Failed to submit verification details');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Document Upload with retry logic
  const uploadWithRetry = async (documentType, file, retries = config.RETRY_ATTEMPTS) => {
    for (let i = 0; i < retries; i++) {
      try {
        await handleFileUpload(documentType, file);
        return true;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return false;
  };
  
  const handleFileUpload = async (documentType, file) => {
    if (!file) return;
    
    // Validate file size
    if (file.size > config.MAX_FILE_SIZE) {
      setError(`${documentType.replace('_', ' ')} file size should be less than 5MB`);
      return;
    }
    
    // Validate file type
    if (!config.ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`${documentType.replace('_', ' ')} must be a PDF, JPEG, or PNG file`);
      return;
    }
    
    setUploading(true);
    setError(null);
    
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    
    try {
      const response = await axios.post(
        `${config.API_BASE}/public/bgv/upload-docs?token=${token}&documentType=${documentType}`,
        formDataObj,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      console.log(`Upload ${documentType}:`, response.data);
      
      setUploadedDocs(prev => ({
        ...prev,
        [documentType]: { 
          file, 
          url: response.data?.data?.fileUrl || response.data?.fileUrl, 
          uploaded: true,
          fileName: file.name,
          uploadDate: new Date().toISOString()
        }
      }));
      
      setSuccess(`${documentType.replace('_', ' ')} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Document Upload Error:', err);
      setError(`Failed to upload ${documentType.replace('_', ' ')}. Please try again.`);
      throw err;
    } finally {
      setUploading(false);
    }
  };
  
  const removeDocument = (documentType) => {
    setUploadedDocs(prev => ({
      ...prev,
      [documentType]: null
    }));
    setSuccess(`${documentType.replace('_', ' ')} removed. You can upload a new file.`);
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Handle Onboarding Submission (Bank & Emergency)
  const handleSubmitOnboarding = async (e) => {
    e.preventDefault();
    
    // Validate bank details
    if (onboardingData.accountNumber !== onboardingData.confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }
    
    if (!onboardingData.bankName || !onboardingData.accountNumber || !onboardingData.ifscCode) {
      setError('Please fill all bank details');
      return;
    }
    
    if (!onboardingData.emergencyContactName || !onboardingData.emergencyContactNumber) {
      setError('Please fill emergency contact details');
      return;
    }
    
    // Validate IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(onboardingData.ifscCode.toUpperCase())) {
      setError('Please enter a valid IFSC code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        bankName: sanitizeInput(onboardingData.bankName),
        accountNumber: onboardingData.accountNumber,
        ifscCode: onboardingData.ifscCode.toUpperCase(),
        upiId: onboardingData.upiId || '',
        emergencyContactName: sanitizeInput(onboardingData.emergencyContactName),
        emergencyContactNumber: onboardingData.emergencyContactNumber,
        emergencyRelationship: sanitizeInput(onboardingData.emergencyRelationship),
        bloodGroup: onboardingData.bloodGroup,
        dateOfJoining: onboardingData.dateOfJoining || new Date().toISOString().split('T')[0]
      };
      
      const response = await axios.post(
        `${config.API_BASE}/public/bgv/submit-onboarding?token=${token}`,
        payload
      );
      
      console.log('Onboarding Submission Response:', response.data);
      
      // Get employeeId from response
      if (response.data?.data?.employeeId) {
        setEmployeeId(response.data.data.employeeId);
      }
      
      setSuccess('Onboarding completed successfully! Redirecting...');
      
      // Clear localStorage after successful submission
      localStorage.removeItem(`${config.STORAGE_KEY_PREFIX}${token}`);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/onboarding-success', { 
          state: { 
            employeeId: response.data?.data?.employeeId,
            message: 'Your onboarding has been completed successfully!' 
          } 
        });
      }, 3000);
      
    } catch (err) {
      console.error('Onboarding Submission Error:', err);
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || 'Failed to submit onboarding details');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Dynamic form handlers
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
  
  // Computed properties
  const allDocumentsUploaded = useMemo(() => {
    return uploadedDocs.AADHAR_CARD?.uploaded && 
           uploadedDocs.PAN_CARD?.uploaded && 
           uploadedDocs.DEGREE_CERTIFICATE?.uploaded;
  }, [uploadedDocs]);
  
  // Step indicator component
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Personal & Professional Details', icon: User },
      { number: 2, label: 'Document Upload', icon: Upload },
      { number: 3, label: 'Bank & Emergency Details', icon: Banknote }
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
                  {step > s.number ? (
                    <CheckCircle size={24} />
                  ) : (
                    <s.icon size={20} />
                  )}
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
  
  // Document upload component
  const DocumentUploadCard = ({ title, description, documentType, required = true }) => {
    const isUploaded = uploadedDocs[documentType]?.uploaded;
    const fileInfo = uploadedDocs[documentType];
    
    return (
      <div className="border border-gray-100 p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-medium">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-[10px] text-gray-400">{description}</p>
          </div>
          {isUploaded && <CheckCircle size={20} className="text-green-500" />}
        </div>
        
        {!isUploaded ? (
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 hover:border-black transition-colors cursor-pointer">
            <div className="text-center">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <span className="text-[10px] text-gray-500">Click to upload {title}</span>
              <input
                type="file"
                accept={config.ALLOWED_FILE_TYPES.join(',')}
                className="hidden"
                onChange={(e) => uploadWithRetry(documentType, e.target.files[0])}
                disabled={uploading}
              />
            </div>
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 bg-green-50">
            <div className="flex items-center gap-2 flex-1">
              <FileText size={16} className="text-green-600" />
              <div className="flex-1">
                <span className="text-xs">{fileInfo?.fileName || 'File uploaded successfully'}</span>
                {fileInfo?.uploadDate && (
                  <p className="text-[9px] text-gray-500">
                    Uploaded: {new Date(fileInfo.uploadDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInfo?.url && setPreviewDoc({ type: documentType, url: fileInfo.url })}
                className="text-gray-600 hover:text-black transition-colors"
                title="Preview"
              >
                <Eye size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeDocument(documentType)}
              className="text-red-500 text-[10px] hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // If no token
  if (!token && !loading) {
    return (
      <>
        <BackNavbar />
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
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <BackNavbar />
      
      <div className="min-h-screen bg-white text-gray-900">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft size={14} />
              Back to Home
            </button>
            <h1 className="text-2xl font-light tracking-tight">Onboarding Portal</h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
              Complete your verification and onboarding process
            </p>
            {employeeId && (
              <p className="text-[10px] text-green-600 mt-2">
                Employee ID: {employeeId}
              </p>
            )}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Step Indicator */}
          {step <= 3 && renderStepIndicator()}
          
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 flex items-center gap-3"
              >
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-xs text-red-600 flex-1">{error}</p>
                <button onClick={() => setError(null)} className="hover:opacity-70">
                  <X size={14} className="text-red-400" />
                </button>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-100 flex items-center gap-3"
              >
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-xs text-green-600 flex-1">{success}</p>
                <button onClick={() => setSuccess(null)} className="hover:opacity-70">
                  <X size={14} className="text-green-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* STEP 1: BGV Details Form */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handleSubmitBGV} className="space-y-8">
                {/* Personal Information */}
                <div className="border border-gray-100 p-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User size={16} />
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: sanitizeInput(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="As per Aadhar Card"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().split('T')[0]}
                        min="1950-01-01"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength="10"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({...formData, contactNumber: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Aadhar Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="12"
                        value={formData.aadharNumber}
                        onChange={(e) => setFormData({...formData, aadharNumber: formatAadhar(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="12-digit Aadhar number"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        PAN Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="10"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({...formData, panNumber: formatPAN(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm uppercase"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Current Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows="2"
                        value={formData.currentAddress}
                        onChange={(e) => setFormData({...formData, currentAddress: sanitizeInput(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm resize-none"
                        placeholder="Flat/House No., Street, City, State, PIN Code"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Permanent Address
                      </label>
                      <textarea
                        rows="2"
                        value={formData.permanentAddress}
                        onChange={(e) => setFormData({...formData, permanentAddress: sanitizeInput(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm resize-none"
                        placeholder="Leave blank if same as current address"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Education Details */}
                <div className="border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <GraduationCap size={16} />
                      Education Details
                    </h2>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                    >
                      + Add Education
                    </button>
                  </div>
                  
                  {formData.educationDetails.map((edu, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-500">Education #{index + 1}</span>
                        {formData.educationDetails.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-500 text-[10px] hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Qualification (e.g., B.Tech, MBA)"
                          value={edu.qualification}
                          onChange={(e) => updateEducation(index, 'qualification', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="University/Board"
                          value={edu.university}
                          onChange={(e) => updateEducation(index, 'university', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Passing Year"
                          value={edu.passingYear}
                          onChange={(e) => updateEducation(index, 'passingYear', e.target.value.replace(/\D/g, '').slice(0,4))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Percentage/CGPA"
                          value={edu.percentage}
                          onChange={(e) => updateEducation(index, 'percentage', e.target.value)}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Employment History */}
                <div className="border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <Briefcase size={16} />
                      Employment History
                    </h2>
                    <button
                      type="button"
                      onClick={addEmployment}
                      className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                    >
                      + Add Experience
                    </button>
                  </div>
                  
                  {formData.employmentHistory.map((emp, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-500">Experience #{index + 1}</span>
                        {formData.employmentHistory.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmployment(index)}
                            className="text-red-500 text-[10px] hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={emp.companyName}
                          onChange={(e) => updateEmployment(index, 'companyName', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Designation"
                          value={emp.designation}
                          onChange={(e) => updateEmployment(index, 'designation', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 2 Years)"
                          value={emp.duration}
                          onChange={(e) => updateEmployment(index, 'duration', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={emp.experienceLetter}
                            onChange={(e) => updateEmployment(index, 'experienceLetter', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-[10px] text-gray-500">Experience Letter Available</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Professional References */}
                <div className="border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <User size={16} />
                      Professional References
                    </h2>
                    <button
                      type="button"
                      onClick={addReference}
                      className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all"
                    >
                      + Add Reference
                    </button>
                  </div>
                  
                  {formData.references.map((ref, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-500">Reference #{index + 1}</span>
                        {formData.references.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="text-red-500 text-[10px] hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={ref.name}
                          onChange={(e) => updateReference(index, 'name', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="tel"
                          placeholder="Contact Number"
                          value={ref.contactNumber}
                          onChange={(e) => updateReference(index, 'contactNumber', e.target.value.replace(/\D/g, '').slice(0,10))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Relationship (e.g., Manager, Colleague)"
                          value={ref.relationship}
                          onChange={(e) => updateReference(index, 'relationship', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={ref.company}
                          onChange={(e) => updateReference(index, 'company', sanitizeInput(e.target.value))}
                          className="px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                  {loading ? 'Submitting...' : 'Continue to Document Upload'}
                </button>
              </form>
            </motion.div>
          )}
          
          {/* STEP 2: Document Upload */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border border-gray-100 p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Upload size={16} />
                  Upload Required Documents
                </h2>
                
                <p className="text-xs text-gray-500 mb-6">
                  Please upload clear, legible copies of the following documents. Accepted formats: PDF, JPEG, PNG (Max 5MB each)
                </p>
                
                <div className="space-y-6">
                  <DocumentUploadCard
                    title="Aadhar Card"
                    description="Front & Back (or combined PDF)"
                    documentType="AADHAR_CARD"
                    required={true}
                  />
                  
                  <DocumentUploadCard
                    title="PAN Card"
                    description="Clear copy of PAN card"
                    documentType="PAN_CARD"
                    required={true}
                  />
                  
                  <DocumentUploadCard
                    title="Degree Certificate"
                    description="Highest qualification degree/provisional certificate"
                    documentType="DEGREE_CERTIFICATE"
                    required={true}
                  />
                  
                  <DocumentUploadCard
                    title="Recent Photograph"
                    description="Passport size photo (Optional)"
                    documentType="PHOTOGRAPH"
                    required={false}
                  />
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-600 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!allDocumentsUploaded() || uploading}
                    className="flex-1 bg-black text-white py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : null}
                    Continue to Bank Details
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
          
          {/* STEP 3: Onboarding (Bank & Emergency) */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handleSubmitOnboarding} className="space-y-8">
                {/* Bank Details */}
                <div className="border border-gray-100 p-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Banknote size={16} />
                    Bank Account Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardingData.bankName}
                        onChange={(e) => setOnboardingData({...onboardingData, bankName: sanitizeInput(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="e.g., State Bank of India"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardingData.accountNumber}
                        onChange={(e) => setOnboardingData({...onboardingData, accountNumber: e.target.value.replace(/\s/g, '')})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="Your bank account number"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Confirm Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardingData.confirmAccountNumber}
                        onChange={(e) => setOnboardingData({...onboardingData, confirmAccountNumber: e.target.value.replace(/\s/g, '')})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="Re-enter account number"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="11"
                        value={onboardingData.ifscCode}
                        onChange={(e) => setOnboardingData({...onboardingData, ifscCode: formatIFSC(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm uppercase"
                        placeholder="e.g., SBIN0001234"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        UPI ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={onboardingData.upiId}
                        onChange={(e) => setOnboardingData({...onboardingData, upiId: e.target.value})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="e.g., name@okhdfcbank"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div className="border border-gray-100 p-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Heart size={16} />
                    Emergency Contact Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Contact Person Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardingData.emergencyContactName}
                        onChange={(e) => setOnboardingData({...onboardingData, emergencyContactName: sanitizeInput(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="Full name of emergency contact"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength="10"
                        value={onboardingData.emergencyContactNumber}
                        onChange={(e) => setOnboardingData({...onboardingData, emergencyContactNumber: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={onboardingData.emergencyRelationship}
                        onChange={(e) => setOnboardingData({...onboardingData, emergencyRelationship: sanitizeInput(e.target.value)})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                        placeholder="e.g., Father, Mother, Spouse"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Blood Group
                      </label>
                      <select
                        value={onboardingData.bloodGroup}
                        onChange={(e) => setOnboardingData({...onboardingData, bloodGroup: e.target.value})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none text-sm"
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
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Expected Date of Joining
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={onboardingData.dateOfJoining}
                        onChange={(e) => setOnboardingData({...onboardingData, dateOfJoining: e.target.value})}
                        className="w-full px-0 py-2 border-b border-gray-100 focus:border-black outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-600 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black text-white py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                    Submit Onboarding
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Document Preview Modal */}
          {previewDoc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewDoc(null)}>
              <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-sm font-bold">{previewDoc.type.replace('_', ' ')}</h3>
                  <button onClick={() => setPreviewDoc(null)} className="hover:opacity-70">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {previewDoc.url?.endsWith('.pdf') ? (
                    <iframe src={previewDoc.url} className="w-full h-[70vh]" title="Document Preview" />
                  ) : (
                    <img src={previewDoc.url} alt="Document Preview" className="max-w-full h-auto mx-auto" />
                  )}
                </div>
                <div className="p-4 border-t">
                  <a
                    href={previewDoc.url}
                    download
                    className="inline-flex items-center gap-2 text-xs text-black hover:text-gray-600"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Onboarding;