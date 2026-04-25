

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';

// const BGVPortal = () => {
//   const [token, setToken] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   // Text Data State
//   const [formData, setFormData] = useState({
//     fullName: "",
//     dob: "",
//     contactNumber: "",
//     currentAddress: "",
//     permanentAddress: "",
//     aadharNumber: "",
//     panNumber: "",
//     lastDrawnSalary: "",
//     criminalRecordDeclaration: "",
//     educationDetails: [{ level: "", institute: "", passingYear: "", percentage: "" }],
//     employmentHistory: [{ company: "", designation: "", duration: "", hrContact: "" }],
//     references: [{ name: "", company: "", contact: "" }]
//   });

//   // Files State
//   const [files, setFiles] = useState({
//     aadharCard: null,
//     panCard: null,
//     photo: null,
//     marksheet10: null,
//     marksheet12: null,
//     degree: null
//   });

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     setToken(urlParams.get('token') || "DEMO_TOKEN_123");
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     if (selectedFiles[0]) {
//       setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
//       toast.success(`${name} attached`);
//     }
//   };

//   const handleNestedChange = (index, field, value, section) => {
//     const updatedSection = [...formData[section]];
//     updatedSection[index][field] = value;
//     setFormData(prev => ({ ...prev, [section]: updatedSection }));
//   };

//   const addRow = (section, template) => {
//     setFormData(prev => ({ ...prev, [section]: [...prev[section], template] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const submissionData = new FormData();

//     // 1. Create the JSON Blob for the "data" part
//     const jsonBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
//     submissionData.append('data', jsonBlob);

//     // 2. Append individual files
//     Object.keys(files).forEach(key => {
//       if (files[key]) {
//         submissionData.append(key, files[key]);
//       }
//     });

//     console.log("Payload being sent:", formData);

//     try {
//       const response = await axios.post(
//         `https://api.wemis.in/api/public/bgv/submit-verification?token=${token}`, 
//         submissionData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       console.log("Success:", response.data);
//       toast.success("All data and documents submitted successfully!");
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err.response?.data?.message || "Submission failed. Please check all fields.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UI Styles
//   const cardStyle = "bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8";
//   const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
//   const inputStyle = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm";

//   return (
//     <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
//       <Toaster position="top-center" />
      
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-10 text-center">
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">VERIFICATION PORTAL</h1>
//           <p className="text-slate-500 mt-2">Please provide your details and upload required documents</p>
//         </div>

//         <form onSubmit={handleSubmit}>
          
//           {/* PERSONAL INFO */}
//           <div className={cardStyle}>
//             <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
//               <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">01</span>
//               Personal Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className={labelStyle}>Full Name</label>
//                 <input className={inputStyle} type="text" name="fullName" placeholder="As per Aadhaar" onChange={handleChange} required />
//               </div>
//               <div>
//                 <label className={labelStyle}>Date of Birth</label>
//                 <input className={inputStyle} type="date" name="dob" onChange={handleChange} required />
//               </div>
//               <div>
//                 <label className={labelStyle}>Contact Number</label>
//                 <input className={inputStyle} type="text" name="contactNumber" placeholder="+91" onChange={handleChange} required />
//               </div>
//               <div>
//                 <label className={labelStyle}>Aadhar Number</label>
//                 <input className={inputStyle} type="text" name="aadharNumber" placeholder="XXXX XXXX XXXX" onChange={handleChange} />
//               </div>
//               <div>
//                 <label className={labelStyle}>PAN Number</label>
//                 <input className={inputStyle} type="text" name="panNumber" placeholder="ABCDE1234F" onChange={handleChange} />
//               </div>
//               <div className="md:col-span-2">
//                 <label className={labelStyle}>Current Address</label>
//                 <textarea className={inputStyle} name="currentAddress" rows="2" onChange={handleChange} />
//               </div>
//               <div className="md:col-span-2">
//                 <label className={labelStyle}>Permanent Address</label>
//                 <textarea className={inputStyle} name="permanentAddress" rows="2" onChange={handleChange} />
//               </div>
//               <div>
//                 <label className={labelStyle}>Last Drawn Salary (Annual)</label>
//                 <input className={inputStyle} type="text" name="lastDrawnSalary" onChange={handleChange} />
//               </div>
//               <div>
//                 <label className={labelStyle}>Criminal Record Declaration</label>
//                 <select className={inputStyle} name="criminalRecordDeclaration" onChange={handleChange}>
//                   <option value="">Select Option</option>
//                   <option value="No">No</option>
//                   <option value="Yes">Yes</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* DOCUMENT UPLOADS */}
//           <div className={cardStyle}>
//             <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
//               <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">02</span>
//               Required Documents
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {[
//                 { label: "Aadhar Card *", name: "aadharCard" },
//                 { label: "PAN Card *", name: "panCard" },
//                 { label: "Passport Photo *", name: "photo" },
//                 { label: "10th Marksheet", name: "marksheet10" },
//                 { label: "12th Marksheet", name: "marksheet12" },
//                 { label: "Highest Degree", name: "degree" },
//               ].map((file) => (
//                 <div key={file.name} className={`relative p-4 border-2 border-dashed rounded-xl text-center transition-all ${files[file.name] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
//                   <label className="cursor-pointer block">
//                     <span className="block text-xs font-bold text-slate-700 mb-2">{file.label}</span>
//                     <div className="flex flex-col items-center gap-1">
//                       <svg className={`w-6 h-6 ${files[file.name] ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                       </svg>
//                       <span className="text-[10px] text-slate-500 font-medium truncate w-full">
//                         {files[file.name] ? files[file.name].name : "Choose File"}
//                       </span>
//                     </div>
//                     <input type="file" name={file.name} className="hidden" onChange={handleFileChange} />
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* EDUCATION DETAILS */}
//           <div className={cardStyle}>
//             <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">03</span>
//               Education History
//             </h2>
//             <div className="space-y-4">
//               {formData.educationDetails.map((edu, i) => (
//                 <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
//                   <input className={inputStyle} placeholder="Level" value={edu.level} onChange={(e) => handleNestedChange(i, 'level', e.target.value, 'educationDetails')} />
//                   <input className={inputStyle} placeholder="Institute" value={edu.institute} onChange={(e) => handleNestedChange(i, 'institute', e.target.value, 'educationDetails')} />
//                   <input className={inputStyle} placeholder="Year" value={edu.passingYear} onChange={(e) => handleNestedChange(i, 'passingYear', e.target.value, 'educationDetails')} />
//                   <input className={inputStyle} placeholder="%" value={edu.percentage} onChange={(e) => handleNestedChange(i, 'percentage', e.target.value, 'educationDetails')} />
//                 </div>
//               ))}
//             </div>
//             <button type="button" className="mt-3 text-blue-600 text-xs font-bold hover:underline" onClick={() => addRow('educationDetails', { level: "", institute: "", passingYear: "", percentage: "" })}>+ ADD EDUCATION</button>
//           </div>

//           {/* EMPLOYMENT HISTORY */}
//           <div className={cardStyle}>
//             <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">04</span>
//               Employment History
//             </h2>
//             <div className="space-y-4">
//               {formData.employmentHistory.map((emp, i) => (
//                 <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
//                   <input className={inputStyle} placeholder="Company" value={emp.company} onChange={(e) => handleNestedChange(i, 'company', e.target.value, 'employmentHistory')} />
//                   <input className={inputStyle} placeholder="Designation" value={emp.designation} onChange={(e) => handleNestedChange(i, 'designation', e.target.value, 'employmentHistory')} />
//                   <input className={inputStyle} placeholder="Duration" value={emp.duration} onChange={(e) => handleNestedChange(i, 'duration', e.target.value, 'employmentHistory')} />
//                   <input className={inputStyle} placeholder="HR Contact" value={emp.hrContact} onChange={(e) => handleNestedChange(i, 'hrContact', e.target.value, 'employmentHistory')} />
//                 </div>
//               ))}
//             </div>
//             <button type="button" className="mt-3 text-blue-600 text-xs font-bold hover:underline" onClick={() => addRow('employmentHistory', { company: "", designation: "", duration: "", hrContact: "" })}>+ ADD EMPLOYMENT</button>
//           </div>

//           {/* REFERENCES */}
//           <div className={cardStyle}>
//             <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">05</span>
//               Professional References
//             </h2>
//             <div className="space-y-4">
//               {formData.references.map((ref, i) => (
//                 <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
//                   <input className={inputStyle} placeholder="Name" value={ref.name} onChange={(e) => handleNestedChange(i, 'name', e.target.value, 'references')} />
//                   <input className={inputStyle} placeholder="Company" value={ref.company} onChange={(e) => handleNestedChange(i, 'company', e.target.value, 'references')} />
//                   <input className={inputStyle} placeholder="Contact" value={ref.contact} onChange={(e) => handleNestedChange(i, 'contact', e.target.value, 'references')} />
//                 </div>
//               ))}
//             </div>
//             <button type="button" className="mt-3 text-blue-600 text-xs font-bold hover:underline" onClick={() => addRow('references', { name: "", company: "", contact: "" })}>+ ADD REFERENCE</button>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading} 
//             className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl transition-all ${
//               loading ? "bg-slate-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
//             }`}
//           >
//             {loading ? "Submitting Application..." : "Finalize & Submit Details"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BGVPortal;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BGVPortal = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Single Unified State
  const [formData, setFormData] = useState({
    // Text Data
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
    references: [{ name: "", company: "", contact: "" }],
    // Files
    aadharCard: null,
    panCard: null,
    photo: null,
    marksheet10: null,
    marksheet12: null,
    degree: null
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token') || "DEMO_TOKEN_123");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      toast.success(`${name} attached!`);
    }
  };

  const handleNestedChange = (index, field, value, section) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = value;
    setFormData(prev => ({ ...prev, [section]: updatedSection }));
  };

  const addRow = (section, template) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], template] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = new FormData();

    // 1. Separate Text Data from Files
    const fileKeys = ["aadharCard", "panCard", "photo", "marksheet10", "marksheet12", "degree"];
    
    const textData = Object.keys(formData).reduce((acc, key) => {
      if (!fileKeys.includes(key)) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    // Part A: JSON Blob named 'data' with Content-Type: application/json
    const jsonBlob = new Blob([JSON.stringify(textData)], { type: 'application/json' });
    submissionData.append('data', jsonBlob);

    // Part B: Individual File Parts
    fileKeys.forEach(key => {
      if (formData[key]) {
        submissionData.append(key, formData[key]);
      }
    });

    console.log("Submitting JSON Part (data):", textData);
    console.log("Submitting File Parts:", fileKeys.filter(k => formData[k]));

    try {
      const response = await axios.post(
        `https://api.wemis.in/api/public/bgv/submit-verification?token=${token}`, 
        submissionData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log("Server Response:", response.data);
      toast.success("Application Submitted Successfully!");
      
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.response?.data?.message || "Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  // UI Utilities
  const card = "bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8";
  const label = "block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2";
  const input = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all text-sm";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Verification Desk</h1>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* PERSONAL INFORMATION */}
          <div className={card}>
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight italic border-b pb-2 border-slate-100">01. Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={label}>Full Name</label>
                <input className={input} name="fullName" placeholder="Full legal name" onChange={handleChange} required />
              </div>
              <div>
                <label className={label}>Date of Birth</label>
                <input className={input} type="date" name="dob" onChange={handleChange} required />
              </div>
              <div>
                <label className={label}>Contact Number</label>
                <input className={input} name="contactNumber" placeholder="+91" onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Current Address</label>
                <textarea className={input} name="currentAddress" rows="2" onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Permanent Address</label>
                <textarea className={input} name="permanentAddress" rows="2" onChange={handleChange} />
              </div>
              <div>
                <label className={label}>Aadhar Number</label>
                <input className={input} name="aadharNumber" onChange={handleChange} />
              </div>
              <div>
                <label className={label}>PAN Number</label>
                <input className={input} name="panNumber" onChange={handleChange} />
              </div>
              <div>
                <label className={label}>Last Salary</label>
                <input className={input} name="lastDrawnSalary" onChange={handleChange} />
              </div>
              <div>
                <label className={label}>Criminal Record</label>
                <select className={input} name="criminalRecordDeclaration" onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* DOCUMENT UPLOADS */}
          <div className={card}>
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight italic border-b pb-2 border-slate-100">02. Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Aadhar Card (Req)", key: "aadharCard" },
                { label: "PAN Card (Req)", key: "panCard" },
                { label: "Passport Photo (Req)", key: "photo" },
                { label: "10th Marksheet", key: "marksheet10" },
                { label: "12th Marksheet", key: "marksheet12" },
                { label: "Highest Degree", key: "degree" }
              ].map((doc) => (
                <div key={doc.key} className={`p-4 border-2 border-dashed rounded-2xl transition-all ${formData[doc.key] ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}>
                  <label className="cursor-pointer block text-center">
                    <span className={label}>{doc.label}</span>
                    <div className="flex flex-col items-center">
                      <svg className={`w-6 h-6 mb-1 ${formData[doc.key] ? 'text-emerald-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[10px] font-bold text-slate-500 truncate w-full italic">
                        {formData[doc.key] ? formData[doc.key].name : "Select File"}
                      </span>
                    </div>
                    <input type="file" name={doc.key} className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION TABLE */}
          <div className={card}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase italic">03. Education</h2>
              <button type="button" onClick={() => addRow('educationDetails', { level: "", institute: "", passingYear: "", percentage: "" })} className="text-[10px] font-black text-blue-600 border-b-2 border-blue-600 tracking-tighter">ADD ROW +</button>
            </div>
            {formData.educationDetails.map((edu, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div><label className={label}>Level</label><input className={input} value={edu.level} onChange={(e) => handleNestedChange(i, 'level', e.target.value, 'educationDetails')} /></div>
                <div><label className={label}>Institute</label><input className={input} value={edu.institute} onChange={(e) => handleNestedChange(i, 'institute', e.target.value, 'educationDetails')} /></div>
                <div><label className={label}>Year</label><input className={input} value={edu.passingYear} onChange={(e) => handleNestedChange(i, 'passingYear', e.target.value, 'educationDetails')} /></div>
                <div><label className={label}>%</label><input className={input} value={edu.percentage} onChange={(e) => handleNestedChange(i, 'percentage', e.target.value, 'educationDetails')} /></div>
              </div>
            ))}
          </div>

          {/* EMPLOYMENT TABLE */}
          <div className={card}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase italic">04. Employment</h2>
              <button type="button" onClick={() => addRow('employmentHistory', { company: "", designation: "", duration: "", hrContact: "" })} className="text-[10px] font-black text-blue-600 border-b-2 border-blue-600 tracking-tighter">ADD ROW +</button>
            </div>
            {formData.employmentHistory.map((emp, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div><label className={label}>Company</label><input className={input} value={emp.company} onChange={(e) => handleNestedChange(i, 'company', e.target.value, 'employmentHistory')} /></div>
                <div><label className={label}>Designation</label><input className={input} value={emp.designation} onChange={(e) => handleNestedChange(i, 'designation', e.target.value, 'employmentHistory')} /></div>
                <div><label className={label}>Duration</label><input className={input} value={emp.duration} onChange={(e) => handleNestedChange(i, 'duration', e.target.value, 'employmentHistory')} /></div>
                <div><label className={label}>HR Contact</label><input className={input} value={emp.hrContact} onChange={(e) => handleNestedChange(i, 'hrContact', e.target.value, 'employmentHistory')} /></div>
              </div>
            ))}
          </div>

          {/* REFERENCES TABLE */}
          <div className={card}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase italic">05. References</h2>
              <button type="button" onClick={() => addRow('references', { name: "", company: "", contact: "" })} className="text-[10px] font-black text-blue-600 border-b-2 border-blue-600 tracking-tighter">ADD ROW +</button>
            </div>
            {formData.references.map((ref, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div><label className={label}>Name</label><input className={input} value={ref.name} onChange={(e) => handleNestedChange(i, 'name', e.target.value, 'references')} /></div>
                <div><label className={label}>Company</label><input className={input} value={ref.company} onChange={(e) => handleNestedChange(i, 'company', e.target.value, 'references')} /></div>
                <div><label className={label}>Contact</label><input className={input} value={ref.contact} onChange={(e) => handleNestedChange(i, 'contact', e.target.value, 'references')} /></div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-5 rounded-[2rem] text-white font-black text-lg tracking-widest transition-all ${
              loading ? "bg-slate-400" : "bg-blue-600 hover:bg-slate-900 shadow-xl shadow-blue-200"
            }`}
          >
            {loading ? "TRANSMITTING DATA..." : "SUBMIT VERIFICATION"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default BGVPortal;