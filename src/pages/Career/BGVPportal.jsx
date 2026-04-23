import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BGVPortal = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Initialize state with the exact structure of your JSON schema
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    contactNumber: "",
    currentAddress: "",
    permanentAddress: "",
    aadharNumber: "",
    panNumber: "",
    lastDrawnSalary: "",
    criminalRecordDeclaration: "",
    educationDetails: [{ level: "", institute: "", passingYear: "", percentage: "" }],
    employmentHistory: [{ company: "", designation: "", duration: "", hrContact: "" }],
    references: [{ name: "", company: "", contact: "" }]
  });

  // Extract token from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token') || "DEMO_TOKEN_123");
  }, []);

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generic handler for nested array fields (Education, Employment, References)
  const handleNestedChange = (index, field, value, section) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = value;
    setFormData(prev => ({ ...prev, [section]: updatedSection }));
  };

  // Generic helper to add new rows to arrays
  const addRow = (section, template) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], template] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Log the data to console as requested
    console.log("Submitting Payload:", formData);

    try {
      const response = await axios.post(
        `https://api.wemis.in/api/public/bgv/submit-verification?token=${token}`, 
        formData
      );
      console.log("Server Response:", response.data);
      alert("Success! Data submitted and logged to console.");
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error: " + (err.response?.data?.message || "Check console for details"));
    } finally {
      setLoading(false);
    }
  };

  // Common input style
  const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '8px' };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Background Verification Portal</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        
        {/* SECTION 1: Personal Information */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>Personal Information</legend>
          <input style={inputStyle} type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input style={inputStyle} type="date" name="dob" onChange={handleChange} required />
          <input style={inputStyle} type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
          <textarea style={inputStyle} name="currentAddress" placeholder="Current Address" onChange={handleChange} rows="2" />
          <textarea style={inputStyle} name="permanentAddress" placeholder="Permanent Address" onChange={handleChange} rows="2" />
          <input style={inputStyle} type="text" name="aadharNumber" placeholder="Aadhar Number" onChange={handleChange} />
          <input style={inputStyle} type="text" name="panNumber" placeholder="PAN Number" onChange={handleChange} />
          <input style={inputStyle} type="text" name="lastDrawnSalary" placeholder="Last Drawn Salary" onChange={handleChange} />
          <select style={inputStyle} name="criminalRecordDeclaration" onChange={handleChange}>
             <option value="">Any Criminal Records?</option>
             <option value="No">No</option>
             <option value="Yes">Yes</option>
          </select>
        </fieldset>

        {/* SECTION 2: Education Details */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>Education Details</legend>
          {formData.educationDetails.map((edu, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="Level" value={edu.level} onChange={(e) => handleNestedChange(i, 'level', e.target.value, 'educationDetails')} />
              <input placeholder="Institute" value={edu.institute} onChange={(e) => handleNestedChange(i, 'institute', e.target.value, 'educationDetails')} />
              <input placeholder="Year" value={edu.passingYear} onChange={(e) => handleNestedChange(i, 'passingYear', e.target.value, 'educationDetails')} />
              <input placeholder="%" value={edu.percentage} onChange={(e) => handleNestedChange(i, 'percentage', e.target.value, 'educationDetails')} />
            </div>
          ))}
          <button type="button" onClick={() => addRow('educationDetails', { level: "", institute: "", passingYear: "", percentage: "" })}>+ Add Row</button>
        </fieldset>

        {/* SECTION 3: Employment History */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>Employment History</legend>
          {formData.employmentHistory.map((emp, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="Company" value={emp.company} onChange={(e) => handleNestedChange(i, 'company', e.target.value, 'employmentHistory')} />
              <input placeholder="Designation" value={emp.designation} onChange={(e) => handleNestedChange(i, 'designation', e.target.value, 'employmentHistory')} />
              <input placeholder="Duration" value={emp.duration} onChange={(e) => handleNestedChange(i, 'duration', e.target.value, 'employmentHistory')} />
              <input placeholder="HR Contact" value={emp.hrContact} onChange={(e) => handleNestedChange(i, 'hrContact', e.target.value, 'employmentHistory')} />
            </div>
          ))}
          <button type="button" onClick={() => addRow('employmentHistory', { company: "", designation: "", duration: "", hrContact: "" })}>+ Add Row</button>
        </fieldset>

        {/* SECTION 4: References */}
        <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
          <legend style={{ fontWeight: 'bold' }}>Professional References</legend>
          {formData.references.map((ref, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="Referee Name" value={ref.name} onChange={(e) => handleNestedChange(i, 'name', e.target.value, 'references')} />
              <input placeholder="Company" value={ref.company} onChange={(e) => handleNestedChange(i, 'company', e.target.value, 'references')} />
              <input placeholder="Contact/Email" value={ref.contact} onChange={(e) => handleNestedChange(i, 'contact', e.target.value, 'references')} />
            </div>
          ))}
          <button type="button" onClick={() => addRow('references', { name: "", company: "", contact: "" })}>+ Add Reference</button>
        </fieldset>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : '#28a745', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? "Submitting..." : "Submit Verification Data"}
        </button>
      </form>
    </div>
  );
};

export default BGVPortal;