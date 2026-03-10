import React, { useState } from 'react';

export default function NewHireForm() {
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
      
      // Auto-fill form with parsed resume data
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
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Resume upload failed. Please fill manually.');
      // Still set the filename even if parsing fails
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
      
      // Reset form after successful submission
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
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">New Hire Registration</h2>
        <p className="text-gray-500">Fill in all details to onboard the new employee into the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-md">
        
        {/* Resume Upload Section - Prominently placed */}
        <section className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 border-dashed">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">📄 Smart Resume Upload</h3>
          <p className="text-sm text-blue-600 mb-4">Upload resume to auto-fill employee details</p>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              disabled={isUploading}
              className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
            />
            {isUploading && <span className="text-blue-600">Uploading...</span>}
            {resumeFile && <span className="text-green-600 text-sm">✓ {resumeFile.name}</span>}
          </div>
        </section>

        {/* Basic Information */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">1. Personal Details</h3>
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

        {/* Job Information */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">2. Job Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Department" name="department" value={formData.department} onChange={handleChange} />
            <Field label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
            <Field label="Reporting Manager" name="reportingManager" value={formData.reportingManager} onChange={handleChange} />
            <SelectField label="Employee Type" name="employeeType" value={formData.employeeType} onChange={handleChange} options={['Full Time', 'Part Time', 'Contract', 'Intern']} />
            <Field label="Date of Joining" name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} />
            <Field label="Work Location" name="workLocation" value={formData.workLocation} onChange={handleChange} />
          </div>
        </section>

        {/* Payroll Information */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">3. Payroll & Banking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Salary / CTC" name="salary" value={formData.salary} onChange={handleChange} />
            <Field label="Bank Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
            <Field label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
            <Field label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            <Field label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} />
            <Field label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} />
          </div>
        </section>

        {/* Additional Identity & Background */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">4. Background & Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Passport Number" name="passport" value={formData.passport} onChange={handleChange} />
            <Field label="Emergency Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
            <Field label="Emergency Contact Number" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} />
            <Field label="Education Qualification" name="educationQualification" value={formData.educationQualification} onChange={handleChange} />
            <Field label="Previous Work Experience" name="previousWorkExperience" value={formData.previousWorkExperience} onChange={handleChange} />
          </div>
        </section>

        {/* Document Upload Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">5. Document Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FileUploadField label="Aadhaar Card" name="aadhaarCard" value={formData.aadhaarCard} onChange={(e) => handleFileUpload(e, 'aadhaarCard')} />
            <FileUploadField label="PAN Card" name="panCardDoc" value={formData.panCardDoc} onChange={(e) => handleFileUpload(e, 'panCardDoc')} />
            <FileUploadField label="Offer Letter" name="offerLetter" value={formData.offerLetter} onChange={(e) => handleFileUpload(e, 'offerLetter')} />
            <FileUploadField label="Education Certificates" name="educationalCertificates" value={formData.educationalCertificates} onChange={(e) => handleFileUpload(e, 'educationalCertificates')} />
          </div>
        </section>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all active:scale-[0.99] disabled:opacity-50 text-lg"
        >
          {isSubmitting ? '📡 Saving to Database...' : '✅ Register New Employee'}
        </button>
      </form>
    </div>
  );
}

// Helper Components
const Field = ({ label, name, type = "text", value, onChange, required = false, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-semibold mb-1 text-gray-600">{label} {required && <span className="text-red-500">*</span>}</label>
    <input 
      type={type} 
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all" 
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-600">{label}</label>
    <select name={name} value={value} onChange={onChange} className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
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
    <div className="flex flex-col border p-3 rounded-lg bg-gray-50">
      <label className="text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" 
      />
      {value && <span className="text-[10px] text-green-600 mt-1 truncate">✓ {value}</span>}
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