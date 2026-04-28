import React, { useState } from "react";
import { 
  Building2, 
  Contact2, 
  MapPin, 
  WalletCards, 
  Globe, 
  Send, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X
} from "lucide-react";

const FormInput = ({ 
  label, 
  placeholder, 
  section, 
  field, 
  type = "text", 
  fullWidth = false, 
  readOnly = false, 
  value, 
  onChange 
}) => (
  <div className={fullWidth ? "col-span-2" : "col-span-2 md:col-span-1"}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange(section, field, e.target.value)}
      className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 placeholder:text-gray-400 ${
        readOnly ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
      }`}
    />
  </div>
);

// File upload component
const FileUpload = ({ label, field, file, onFileChange, onRemove, required = false }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {!file ? (
      <div className="relative">
        <input
          type="file"
          id={field}
          onChange={(e) => onFileChange(field, e.target.files[0])}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label
          htmlFor={field}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <Upload size={20} className="text-gray-500" />
          <span className="text-gray-600">Click to upload {label}</span>
        </label>
      </div>
    ) : (
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Upload size={16} className="text-blue-600" />
          <span className="text-sm text-gray-700">{file.name}</span>
          <span className="text-xs text-gray-500">
            ({(file.size / 1024).toFixed(1)} KB)
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(field)}
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    )}
  </div>
);

function Vendorpage() {
  const [formData, setFormData] = useState({
    legal_details: {
      legal_entity_name: "",
      business_structure: "",
      pan_number: "",
      gstin: "",
    },
    contact_details: {
      contact_person_name: "",
      email: "",
      phone_number: "",
    },
    bank_details: {
      bank_name: "",
      account_number: "",
      ifsc_code: "",
    },
    compliance: {
      anti_bribery: false,
      conflict_of_interest: false,
    },
  });

  const [files, setFiles] = useState({
    pan_card: null,
    gst_certificate: null,
    cancelled_cheque: null,
    address_proof: null,
    iso_certificate: null,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleFileRemove = (field) => {
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
    // Reset the file input
    const fileInput = document.getElementById(field);
    if (fileInput) fileInput.value = "";
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData((prev) => ({
      ...prev,
      compliance: {
        ...prev.compliance,
        [field]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    
    // Validate required files
    const requiredFiles = ['pan_card', 'gst_certificate', 'cancelled_cheque', 'address_proof'];
    const missingFiles = requiredFiles.filter(file => !files[file]);
    
    if (missingFiles.length > 0) {
      setStatus({ 
        type: "error", 
        message: `Please upload: ${missingFiles.join(', ')}` 
      });
      return;
    }

    try {
      setLoading(true);
      
      const submitData = new FormData();
      
      // Append JSON fields as strings
      submitData.append("legal_details", JSON.stringify(formData.legal_details));
      submitData.append("contact_details", JSON.stringify(formData.contact_details));
      submitData.append("bank_details", JSON.stringify(formData.bank_details));
      submitData.append("compliance", JSON.stringify(formData.compliance));
      
      // Append files
      submitData.append("pan_card", files.pan_card);
      submitData.append("gst_certificate", files.gst_certificate);
      submitData.append("cancelled_cheque", files.cancelled_cheque);
      submitData.append("address_proof", files.address_proof);
      if (files.iso_certificate) {
        submitData.append("iso_certificate", files.iso_certificate);
      }

      const res = await fetch("https://api.traxoerp.com/vendors/register", {
        method: "POST",
        body: submitData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Registration failed");
      }

      const data = await res.json();
      setStatus({ type: "success", message: "Vendor registered successfully!" });
      
      // Optional: Reset form after successful submission
      // resetForm();
      
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Vendor Onboarding
          </h1>
          <p className="text-gray-500 mt-2">Complete all sections and upload required documents.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Legal Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-blue-600">
              <Building2 size={22} />
              <h3 className="text-lg font-bold text-gray-800">Legal Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput 
                label="Legal Entity Name" 
                placeholder="ABC Pvt Ltd" 
                section="legal_details" 
                field="legal_entity_name" 
                value={formData.legal_details.legal_entity_name} 
                onChange={handleChange} 
              />
              <FormInput 
                label="Business Structure" 
                placeholder="Private Limited / Sole Proprietorship" 
                section="legal_details" 
                field="business_structure" 
                value={formData.legal_details.business_structure} 
                onChange={handleChange} 
              />
              <FormInput 
                label="PAN Number" 
                placeholder="ABCDE1234F" 
                section="legal_details" 
                field="pan_number" 
                value={formData.legal_details.pan_number} 
                onChange={handleChange} 
              />
              <FormInput 
                label="GSTIN" 
                placeholder="29ABCDE1234F1Z5" 
                section="legal_details" 
                field="gstin" 
                value={formData.legal_details.gstin} 
                onChange={handleChange} 
              />
            </div>
          </section>

          {/* Contact Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-indigo-600">
              <Contact2 size={22} />
              <h3 className="text-lg font-bold text-gray-800">Contact Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput 
                label="Contact Person Name" 
                placeholder="Rahul Sharma" 
                section="contact_details" 
                field="contact_person_name" 
                value={formData.contact_details.contact_person_name} 
                onChange={handleChange} 
              />
              <FormInput 
                label="Email" 
                type="email" 
                placeholder="contact@company.com" 
                section="contact_details" 
                field="email" 
                value={formData.contact_details.email} 
                onChange={handleChange} 
              />
              <FormInput 
                label="Phone Number" 
                placeholder="9876543210" 
                section="contact_details" 
                field="phone_number" 
                value={formData.contact_details.phone_number} 
                onChange={handleChange} 
              />
            </div>
          </section>

          {/* Bank Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-emerald-600">
              <WalletCards size={22} />
              <h3 className="text-lg font-bold text-gray-800">Bank Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput 
                label="Bank Name" 
                placeholder="HDFC Bank" 
                section="bank_details" 
                field="bank_name" 
                value={formData.bank_details.bank_name} 
                onChange={handleChange} 
              />
              <FormInput 
                label="Account Number" 
                placeholder="1234567890" 
                section="bank_details" 
                field="account_number" 
                value={formData.bank_details.account_number} 
                onChange={handleChange} 
              />
              <FormInput 
                label="IFSC Code" 
                placeholder="HDFC0001234" 
                section="bank_details" 
                field="ifsc_code" 
                value={formData.bank_details.ifsc_code} 
                onChange={handleChange} 
              />
            </div>
          </section>

          {/* Compliance Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-purple-600">
              <CheckCircle2 size={22} />
              <h3 className="text-lg font-bold text-gray-800">Compliance</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.compliance.anti_bribery}
                  onChange={(e) => handleCheckboxChange("anti_bribery", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Anti-bribery and anti-corruption compliance</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.compliance.conflict_of_interest}
                  onChange={(e) => handleCheckboxChange("conflict_of_interest", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Conflict of interest disclosure</span>
              </label>
            </div>
          </section>

          {/* Documents Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-amber-600">
              <Upload size={22} />
              <h3 className="text-lg font-bold text-gray-800">Required Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FileUpload 
                label="PAN Card" 
                field="pan_card" 
                file={files.pan_card} 
                onFileChange={handleFileChange} 
                onRemove={handleFileRemove}
                required
              />
              <FileUpload 
                label="GST Certificate" 
                field="gst_certificate" 
                file={files.gst_certificate} 
                onFileChange={handleFileChange} 
                onRemove={handleFileRemove}
                required
              />
              <FileUpload 
                label="Cancelled Cheque" 
                field="cancelled_cheque" 
                file={files.cancelled_cheque} 
                onFileChange={handleFileChange} 
                onRemove={handleFileRemove}
                required
              />
              <FileUpload 
                label="Address Proof" 
                field="address_proof" 
                file={files.address_proof} 
                onFileChange={handleFileChange} 
                onRemove={handleFileRemove}
                required
              />
              <FileUpload 
                label="ISO Certificate (Optional)" 
                field="iso_certificate" 
                file={files.iso_certificate} 
                onFileChange={handleFileChange} 
                onRemove={handleFileRemove}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">Supported formats: PDF, JPG, JPEG, PNG (Max size: 5MB)</p>
          </section>

          {/* Status Alert */}
          {status.message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              status.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{status.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={24} />
            ) : (
              <div className="flex items-center gap-2">
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Submit Registration
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Vendorpage;