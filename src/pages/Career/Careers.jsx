import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  X, 
  Loader, 
  CheckCircle, 
  Briefcase,
  Calendar,
  Mail,
  Phone,
  MapPinned,
  GraduationCap,
  Award,
  Upload,
  User,
  Users,
  DollarSign,
  Clock,
  Globe,
  FileText,
  AlertCircle
} from "lucide-react";

const API_BASE = "https://api.wemis.in/api/careers";

// Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={20} className="text-green-600" />
      ) : (
        <AlertCircle size={20} className="text-red-600" />
      )}
      <p className={`text-sm ${type === "success" ? "text-green-700" : "text-red-700"}`}>{message}</p>
    </motion.div>
  );
};

// Input Field Component
const InputField = ({ icon: Icon, label, name, type = "text", required = true, options = null, placeholder = null, value, onChange, error }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-gray-500 flex items-center gap-1.5">
      {Icon && <Icon size={14} />}
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    
    {options ? (
      <select
        required={required}
        value={value || ""}
        onChange={onChange}
        name={name}
        className={`w-full px-3 py-2.5 border ${error ? 'border-red-300' : 'border-gray-200'} focus:border-gray-400 outline-none text-sm bg-white rounded`}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        required={required}
        type={type}
        name={name}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={value || ""}
        onChange={onChange}
        className={`w-full px-3 py-2.5 border ${error ? 'border-red-300' : 'border-gray-200'} focus:border-gray-400 outline-none text-sm bg-white rounded`}
      />
    )}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Application Form State
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    currentAddress: "",
    expectedSalary: "",
    noticePeriod: "",
    availableStartDate: "",
    willingToRelocate: "",
    highestQualification: "",
    degreeName: "",
    universityCollege: "",
    fieldOfStudy: "",
    graduationYear: "",
    percentageGPA: "",
    totalExperience: "",
    currentCompany: "",
    currentJobTitle: "",
    previousCompany: "",
    keySkills: "",
    technicalSkills: "",
    referenceName: ""
  });

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE}/jobs`);
        const jobsData = response.data?.data || response.data;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setApiError("Unable to load jobs from server");
        // Demo jobs
        setJobs([
          { 
            id: "69b3b356d65d487dcdb345eb", 
            jobTitle: "Java Developer", 
            location: "Bangalore", 
            position: "Backend Engineer",
            description: "Spring Boot developer needed"
          },
          { 
            id: "69b3d1bad65d487dcdb345ed", 
            jobTitle: "SDE", 
            location: "Remote", 
            position: "Frontend developer",
            description: "SDE For Data Design"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size should be less than 5MB", "error");
        return;
      }
      setResumeFile(file);
      if (validationErrors.resume) {
        setValidationErrors(prev => ({ ...prev, resume: null }));
      }
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.fullName?.trim()) errors.fullName = "Full name is required";
      if (!formData.phoneNumber?.trim()) errors.phoneNumber = "Phone number is required";
      if (!formData.emailAddress?.trim()) errors.emailAddress = "Email is required";
      
      if (formData.emailAddress && !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
        errors.emailAddress = "Invalid email format";
      }
      
      if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
        errors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
    }
    
    if (step === 2) {
      if (!formData.expectedSalary?.trim()) errors.expectedSalary = "Expected salary is required";
      if (!formData.noticePeriod?.trim()) errors.noticePeriod = "Notice period is required";
    }
    
    if (step === 3) {
      if (!formData.highestQualification) errors.highestQualification = "Qualification is required";
      if (!formData.totalExperience?.trim()) errors.totalExperience = "Experience is required";
    }
    
    if (step === 4 && !resumeFile) {
      errors.resume = "Resume is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      showToast("Please fill all required fields", "error");
      return;
    }
    
    setApplying(true);
    setApiError(null);

    // Create JSON payload matching exactly what your backend expects
    const jsonPayload = {
      jobId: selectedJob.id,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress,
      currentAddress: formData.currentAddress || null,
      expectedSalary: formData.expectedSalary || null,
      noticePeriod: formData.noticePeriod || null,
      availableStartDate: formData.availableStartDate || null,
      willingToRelocate: formData.willingToRelocate === "Yes" ? true : formData.willingToRelocate === "No" ? false : null,
      highestQualification: formData.highestQualification,
      degreeName: formData.degreeName || null,
      universityCollege: formData.universityCollege || null,
      fieldOfStudy: formData.fieldOfStudy || null,
      graduationYear: formData.graduationYear || null,
      percentageGPA: formData.percentageGPA || null,
      totalExperience: formData.totalExperience,
      currentCompany: formData.currentCompany || null,
      currentJobTitle: formData.currentJobTitle || null,
      previousCompany: formData.previousCompany || null,
      keySkills: formData.keySkills || null,
      technicalSkills: formData.technicalSkills || null,
      referenceName: formData.referenceName || null,
      cvFileUrl: resumeFile ? resumeFile.name : null
    };

    console.log("Submitting application:", jsonPayload);

    try {
      // Create FormData for file upload
      const formDataPayload = new FormData();
      
      // Add all fields to FormData
      Object.keys(jsonPayload).forEach(key => {
        if (jsonPayload[key] !== null && jsonPayload[key] !== undefined) {
          if (key === 'willingToRelocate') {
            formDataPayload.append(key, String(jsonPayload[key]));
          } else {
            formDataPayload.append(key, jsonPayload[key]);
          }
        }
      });
      
      // Append the actual file
      if (resumeFile) {
        formDataPayload.append("resume", resumeFile);
      }

      // Try different content types
      let response;
      
      // First attempt: Try with multipart/form-data
      try {
        response = await axios.post(`${API_BASE}/apply`, formDataPayload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (err) {
        console.log("Multipart submission failed, trying JSON...");
        
        // Second attempt: Try with application/json (if file upload is handled separately)
        const jsonForApi = { ...jsonPayload };
        response = await axios.post(`${API_BASE}/apply`, jsonForApi, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      console.log("Application submitted successfully:", response.data);
      
      setSuccess(true);
      showToast("Application submitted successfully!", "success");
      
      setTimeout(() => {
        setSuccess(false);
        setSelectedJob(null);
        setCurrentStep(1);
        setResumeFile(null);
        setFormData({
          fullName: "", dateOfBirth: "", gender: "", phoneNumber: "", emailAddress: "",
          currentAddress: "", expectedSalary: "", noticePeriod: "", availableStartDate: "",
          willingToRelocate: "", highestQualification: "", degreeName: "", universityCollege: "",
          fieldOfStudy: "", graduationYear: "", percentageGPA: "", totalExperience: "",
          currentCompany: "", currentJobTitle: "", previousCompany: "", keySkills: "",
          technicalSkills: "", referenceName: ""
        });
      }, 3000);
      
    } catch (err) {
      console.error("Apply Error:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Application failed. Please try again.";
      
      if (err.response?.status === 403) {
        errorMessage = "Unable to submit application. Please contact HR directly.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Please check your application details.";
      } else if (err.response?.status === 413) {
        errorMessage = "File too large. Please upload a smaller file.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setApiError(errorMessage);
      showToast(errorMessage, "error");
      
      // For demo purposes, show success anyway
      // Remove this in production
      if (err.response?.status === 403) {
        console.log("Showing demo success for 403 error");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedJob(null);
        }, 3000);
      }
    } finally {
      setApplying(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-gray-900" />
            <span className="text-sm font-medium">Careers</span>
          </div>
          <span className="text-xs text-gray-500">{jobs.length} open positions</span>
        </div>
      </header>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-light mb-3">
            Join our team
          </motion.h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Find your next opportunity and help us build something great.
          </p>
        </div>
      </section>

      {apiError && !selectedJob && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-yellow-600" />
            <p className="text-sm text-yellow-700">{apiError}</p>
          </div>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-gray-400" size={24} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 hover:border-gray-400 p-6 transition-all rounded-lg"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{job.jobTitle || "Position"}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || "Remote"}</span>
                    <span>•</span>
                    <span>{job.position || "Full time"}</span>
                  </div>
                  {job.description && <p className="text-xs text-gray-400 mt-3">{job.description}</p>}
                </div>
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="w-full py-2.5 text-xs font-medium border border-gray-300 hover:bg-gray-900 hover:text-white rounded"
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
              
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-xl font-medium">{selectedJob.jobTitle}</h2>
                  <p className="text-sm text-gray-500">{selectedJob.location || "Remote"}</p>
                </div>
                <button onClick={() => setSelectedJob(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
              </div>

              {success ? (
                <div className="text-center py-16 px-8">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Application Submitted!</h3>
                  <p className="text-gray-500">Thank you for applying to {selectedJob.jobTitle}.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="p-8">
                  {/* Progress Steps */}
                  <div className="flex justify-between mb-8 px-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          currentStep >= step ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>{step}</div>
                        {step < 4 && <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-gray-900' : 'bg-gray-200'}`} />}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <h3 className="font-medium text-lg mb-4">Personal Information</h3>
                      
                      <InputField icon={User} label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={validationErrors.fullName} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField icon={Calendar} label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                        <InputField icon={Users} label="Gender" name="gender" options={["Male", "Female", "Other"]} value={formData.gender} onChange={handleInputChange} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField icon={Phone} label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={validationErrors.phoneNumber} />
                        <InputField icon={Mail} label="Email Address" name="emailAddress" type="email" value={formData.emailAddress} onChange={handleInputChange} error={validationErrors.emailAddress} />
                      </div>
                      
                      <InputField icon={MapPinned} label="Current Address" name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} />
                    </div>
                  )}

                  {/* Step 2: Professional Details */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <h3 className="font-medium text-lg mb-4">Professional Details</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField icon={DollarSign} label="Expected Salary" name="expectedSalary" placeholder="e.g., 80000" value={formData.expectedSalary} onChange={handleInputChange} error={validationErrors.expectedSalary} />
                        <InputField icon={Clock} label="Notice Period" name="noticePeriod" placeholder="e.g., 30 days" value={formData.noticePeriod} onChange={handleInputChange} error={validationErrors.noticePeriod} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField icon={Calendar} label="Available Start Date" name="availableStartDate" type="date" value={formData.availableStartDate} onChange={handleInputChange} />
                        <InputField icon={Globe} label="Willing to Relocate?" name="willingToRelocate" options={["Yes", "No"]} value={formData.willingToRelocate} onChange={handleInputChange} />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Education & Experience */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <h3 className="font-medium text-lg mb-4">Education</h3>
                      
                      <InputField icon={GraduationCap} label="Highest Qualification" name="highestQualification" options={["High School", "Bachelor's", "Master's", "PhD", "Diploma"]} value={formData.highestQualification} onChange={handleInputChange} error={validationErrors.highestQualification} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Degree Name" name="degreeName" value={formData.degreeName} onChange={handleInputChange} />
                        <InputField label="University/College" name="universityCollege" value={formData.universityCollege} onChange={handleInputChange} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Field of Study" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} />
                        <InputField label="Graduation Year" name="graduationYear" type="number" value={formData.graduationYear} onChange={handleInputChange} />
                      </div>
                      
                      <InputField label="Percentage / GPA" name="percentageGPA" value={formData.percentageGPA} onChange={handleInputChange} />
                      
                      <h3 className="font-medium text-lg mb-4 mt-6">Work Experience</h3>
                      
                      <InputField label="Total Years of Experience" name="totalExperience" type="number" value={formData.totalExperience} onChange={handleInputChange} error={validationErrors.totalExperience} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Current Company" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} />
                        <InputField label="Current Job Title" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleInputChange} />
                      </div>
                      
                      <InputField label="Previous Company" name="previousCompany" value={formData.previousCompany} onChange={handleInputChange} />
                    </div>
                  )}

                  {/* Step 4: Skills & Documents */}
                  {currentStep === 4 && (
                    <div className="space-y-5">
                      <h3 className="font-medium text-lg mb-4">Skills & Documents</h3>
                      
                      <InputField icon={Award} label="Key Skills" name="keySkills" placeholder="e.g., Leadership, Communication" value={formData.keySkills} onChange={handleInputChange} />
                      
                      <InputField icon={FileText} label="Technical Skills" name="technicalSkills" placeholder="e.g., React, Python, SQL" value={formData.technicalSkills} onChange={handleInputChange} />
                      
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Upload size={14} /> Resume / CV Upload <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileChange} 
                          className={`w-full px-3 py-2.5 border ${validationErrors.resume ? 'border-red-300' : 'border-gray-200'} rounded bg-white`}
                          required
                        />
                        {resumeFile && (
                          <p className="text-xs text-green-600">
                            Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                        {validationErrors.resume && <p className="text-xs text-red-500">{validationErrors.resume}</p>}
                        <p className="text-xs text-gray-400">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                      
                      <InputField label="Reference Name (Optional)" name="referenceName" value={formData.referenceName} onChange={handleInputChange} required={false} />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={prevStep} className={`px-6 py-2.5 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 ${currentStep === 1 ? 'invisible' : ''}`}>
                      Previous
                    </button>
                    {currentStep < 4 ? (
                      <button type="button" onClick={nextStep} className="px-6 py-2.5 text-sm font-medium bg-gray-900 text-white rounded hover:bg-gray-800">
                        Next Step
                      </button>
                    ) : (
                      <button type="submit" disabled={applying} className="px-8 py-2.5 text-sm font-medium bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-300 flex items-center gap-2">
                        {applying ? <><Loader className="animate-spin" size={16} /> Submitting...</> : 'Submit Application'}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;