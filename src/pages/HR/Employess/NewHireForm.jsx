import React, { useState } from 'react';

export default function NewHireForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    department: '',
    designation: '',
    reportingManager: '',
    employeeType: 'Full Time',
    dateOfJoining: '',
    workLocation: '',
    employmentStatus: 'NEW_HIRE',
    salary: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    panNumber: '',
    aadhaarNumber: '',
    panCard: '',
    passport: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    educationQualification: '',
    previousWorkExperience: '',
    resume: '',
    aadhaarCard: '',
    panCardDoc: '',
    offerLetter: '',
    educationalCertificates: ''
  });

  const steps = [
    { number: 1, name: 'Resume Upload', description: 'Smart auto-fill' },
    { number: 2, name: 'Personal Details', description: 'Basic information' },
    { number: 3, name: 'Job Assignment', description: 'Role & department' },
    { number: 4, name: 'Payroll & Banking', description: 'Salary & bank details' },
    { number: 5, name: 'Background & Identity', description: 'Additional info' },
    { number: 6, name: 'Document Verification', description: 'Upload documents' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setIsUploading(true);

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.wemis.in/api/hr/employees/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        fullName: data.fullName || prev.fullName,
        phoneNumber: data.phoneNumber || prev.phoneNumber,
        emailAddress: data.emailAddress || prev.emailAddress,
        educationQualification: data.educationQualification || prev.educationQualification,
        previousWorkExperience: data.previousWorkExperience || prev.previousWorkExperience,
        resume: data.resume || file.name
      }));

      alert('✅ Resume parsed successfully! Form auto-filled.');
      setCurrentStep(2); // Move to next step after successful upload
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Resume upload failed. Please fill manually.');
      setFormData(prev => ({ ...prev, resume: file.name }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    try {
      const response = await fetch('https://api.wemis.in/api/hr/employees/new-hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 403) {
        alert('❌ Access Denied (403): Please login again.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }

      alert('✅ Employee saved successfully!');
      
      setFormData({
        employeeId: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        department: '',
        designation: '',
        reportingManager: '',
        employeeType: 'Full Time',
        dateOfJoining: '',
        workLocation: '',
        employmentStatus: 'NEW_HIRE',
        salary: '',
        bankAccountNumber: '',
        bankName: '',
        ifscCode: '',
        panNumber: '',
        aadhaarNumber: '',
        panCard: '',
        passport: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        educationQualification: '',
        previousWorkExperience: '',
        resume: '',
        aadhaarCard: '',
        panCardDoc: '',
        offerLetter: '',
        educationalCertificates: ''
      });
      setResumeFile(null);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepComplete = (step) => {
    switch(step) {
      case 1:
        return formData.resume !== '';
      case 2:
        return formData.fullName && formData.emailAddress;
      case 3:
        return formData.department && formData.designation;
      case 4:
        return true; // Optional
      case 5:
        return true; // Optional
      case 6:
        return true; // Optional
      default:
        return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">New Hire Registration</h2>
        <p className="text-gray-600">Complete all steps to onboard the new employee</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 relative">
              {step.number < steps.length && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  step.number < currentStep ? 'bg-gray-800' : 'bg-gray-300'
                }`} />
              )}
              <div className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${
                  step.number < currentStep 
                    ? 'bg-gray-800 border-gray-800 text-white' 
                    : step.number === currentStep
                    ? 'border-gray-800 bg-white text-gray-800'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-semibold ${
                    step.number <= currentStep ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-gray-300 shadow-lg">
        
        {/* Step 1: Resume Upload */}
        {currentStep === 1 && (
          <section className="bg-gray-50 p-6 rounded-lg border-2 border-gray-400 border-dashed">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">📄 Step 1: Smart Resume Upload</h3>
            <p className="text-sm text-gray-600 mb-4">Upload resume to auto-fill employee details</p>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={isUploading}
                className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900 disabled:opacity-50"
              />
              {isUploading && <span className="text-gray-600">Uploading...</span>}
              {resumeFile && <span className="text-gray-700 text-sm">✓ {resumeFile.name}</span>}
            </div>
          </section>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">Step 2: Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
              <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <Field label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
              <Field label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
              <Field label="Email Address" name="emailAddress" type="email" value={formData.emailAddress} onChange={handleChange} required />
              <Field label="Address" name="address" value={formData.address} onChange={handleChange} className="md:col-span-2 lg:col-span-3" />
            </div>
          </section>
        )}

        {/* Step 3: Job Assignment */}
        {currentStep === 3 && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">Step 3: Job Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Department" name="department" value={formData.department} onChange={handleChange} />
              <Field label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
              <Field label="Reporting Manager" name="reportingManager" value={formData.reportingManager} onChange={handleChange} />
              <SelectField label="Employee Type" name="employeeType" value={formData.employeeType} onChange={handleChange} options={['Full Time', 'Part Time', 'Contract', 'Intern']} />
              <Field label="Date of Joining" name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} />
              <Field label="Work Location" name="workLocation" value={formData.workLocation} onChange={handleChange} />
            </div>
          </section>
        )}

        {/* Step 4: Payroll & Banking */}
        {currentStep === 4 && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">Step 4: Payroll & Banking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Salary / CTC" name="salary" value={formData.salary} onChange={handleChange} />
              <Field label="Bank Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
              <Field label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
              <Field label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
              <Field label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} />
              <Field label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} />
            </div>
          </section>
        )}

        {/* Step 5: Background & Identity */}
        {currentStep === 5 && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">Step 5: Background & Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Passport Number" name="passport" value={formData.passport} onChange={handleChange} />
              <Field label="Emergency Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
              <Field label="Emergency Contact Number" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} />
              <Field label="Education Qualification" name="educationQualification" value={formData.educationQualification} onChange={handleChange} />
              <Field label="Previous Work Experience" name="previousWorkExperience" value={formData.previousWorkExperience} onChange={handleChange} />
            </div>
          </section>
        )}

        {/* Step 6: Document Verification */}
        {currentStep === 6 && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">Step 6: Document Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FileUploadField label="Aadhaar Card" name="aadhaarCard" value={formData.aadhaarCard} onChange={(e) => handleFileUpload(e, 'aadhaarCard')} />
              <FileUploadField label="PAN Card" name="panCardDoc" value={formData.panCardDoc} onChange={(e) => handleFileUpload(e, 'panCardDoc')} />
              <FileUploadField label="Offer Letter" name="offerLetter" value={formData.offerLetter} onChange={(e) => handleFileUpload(e, 'offerLetter')} />
              <FileUploadField label="Education Certificates" name="educationalCertificates" value={formData.educationalCertificates} onChange={(e) => handleFileUpload(e, 'educationalCertificates')} />
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            ← Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all"
            >
              Next Step →
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-900 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? '📡 Submitting...' : '✓ Complete Registration'}
            </button>
          )}
        </div>

        {/* Step Progress Indicator */}
        <div className="text-center text-sm text-gray-500">
          Step {currentStep} of {steps.length}: {steps[currentStep-1].name}
        </div>
      </form>
    </div>
  );
}

// Helper Components
const Field = ({ label, name, type = "text", value, onChange, required = false, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-semibold mb-1 text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <input 
      type={type} 
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className="border border-gray-400 p-2 rounded-lg focus:ring-2 focus:ring-gray-600 outline-none transition-all bg-white" 
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700">{label}</label>
    <select name={name} value={value} onChange={onChange} className="border border-gray-400 p-2 rounded-lg focus:ring-2 focus:ring-gray-600 outline-none bg-white">
      <option value="">Select...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const FileUploadField = ({ label, value, onChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col border border-gray-300 p-3 rounded-lg bg-gray-50">
      <label className="text-xs font-bold uppercase text-gray-600 mb-2">{label}</label>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300" 
      />
      {value && <span className="text-[10px] text-gray-700 mt-1 truncate">✓ {value}</span>}
    </div>
  );
};

// Keep the handleFileUpload function
const handleFileUpload = (e, fieldName) => {
  const file = e.target.files[0];
  if (file) {
    // This will be handled by the parent component's state
    // The function is defined in the parent component
  }
};