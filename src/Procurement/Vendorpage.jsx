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
  AlertCircle 
} from "lucide-react";
import ProcurementNavbar from "./ProcurementNavbar";

/**
 * FIXED: FormInput is defined OUTSIDE the main component.
 * This prevents the input from losing focus or "repeating" while typing.
 */
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

function Vendorpage() {
  const [formData, setFormData] = useState({
    company_details: {
      company_name: "",
      business_type: "",
      gst_number: "",
      pan_number: "",
      certifications: "",
    },
    contact_details: {
      contact_person_name: "",
      email: "",
      phone_number: "",
      alternate_phone_number: "",
    },
    location_details: {
      address: "",
      city: "",
      state: "",
      country: "India",
      pin_code: "",
    },
    financial_details: {
      payment_terms: "",
      bank_account_details: "",
    },
    online_presence: {
      website: "",
    },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      setLoading(true);
      const res = await fetch(
        "https://python-backend-2-5uar.onrender.com/vendors/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const text = await res.text();
      let data = JSON.parse(text);

      if (!res.ok) throw new Error(data?.message || "Registration failed");

      setStatus({ type: "success", message: "Vendor registered successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <ProcurementNavbar/>
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Vendor Onboarding
          </h1>
          <p className="text-gray-500 mt-2">Complete all sections to submit your registration.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Company Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-blue-600">
              <Building2 size={22} />
              <h3 className="text-lg font-bold text-gray-800">Company Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput label="Company Name" placeholder="Acme Corp" section="company_details" field="company_name" value={formData.company_details.company_name} onChange={handleChange} />
              <FormInput label="Business Type" placeholder="Manufacturer/Service" section="company_details" field="business_type" value={formData.company_details.business_type} onChange={handleChange} />
              <FormInput label="GST Number" placeholder="22AAAAA0000A1Z5" section="company_details" field="gst_number" value={formData.company_details.gst_number} onChange={handleChange} />
              <FormInput label="PAN Number" placeholder="ABCDE1234F" section="company_details" field="pan_number" value={formData.company_details.pan_number} onChange={handleChange} />
              <FormInput label="Certifications" placeholder="ISO, MSME, etc." section="company_details" field="certifications" fullWidth value={formData.company_details.certifications} onChange={handleChange} />
            </div>
          </section>

          {/* Contact Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-indigo-600">
              <Contact2 size={22} />
              <h3 className="text-lg font-bold text-gray-800">Contact Person</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput label="Contact Name" placeholder="John Doe" section="contact_details" field="contact_person_name" value={formData.contact_details.contact_person_name} onChange={handleChange} />
              <FormInput label="Email" type="email" placeholder="john@acme.com" section="contact_details" field="email" value={formData.contact_details.email} onChange={handleChange} />
              <FormInput label="Phone Number" placeholder="+91 9876543210" section="contact_details" field="phone_number" value={formData.contact_details.phone_number} onChange={handleChange} />
              <FormInput label="Alt Phone" placeholder="+91 00000 00000" section="contact_details" field="alternate_phone_number" value={formData.contact_details.alternate_phone_number} onChange={handleChange} />
            </div>
          </section>

          {/* Location Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-red-500">
              <MapPin size={22} />
              <h3 className="text-lg font-bold text-gray-800">Location</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput label="Full Address" placeholder="Street, Building, Area" section="location_details" field="address" fullWidth value={formData.location_details.address} onChange={handleChange} />
              <FormInput label="City" placeholder="City" section="location_details" field="city" value={formData.location_details.city} onChange={handleChange} />
              <FormInput label="State" placeholder="State" section="location_details" field="state" value={formData.location_details.state} onChange={handleChange} />
              <FormInput label="Country" readOnly section="location_details" field="country" value={formData.location_details.country} onChange={handleChange} />
              <FormInput label="PIN Code" placeholder="000000" section="location_details" field="pin_code" value={formData.location_details.pin_code} onChange={handleChange} />
            </div>
          </section>

          {/* Financial & Website Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-emerald-600">
                <WalletCards size={22} />
                <h3 className="text-lg font-bold text-gray-800">Financials</h3>
              </div>
              <div className="space-y-4">
                <FormInput label="Payment Terms" placeholder="e.g. Net 30" section="financial_details" field="payment_terms" fullWidth value={formData.financial_details.payment_terms} onChange={handleChange} />
                <FormInput label="Bank Details" placeholder="Acc No, IFSC" section="financial_details" field="bank_account_details" fullWidth value={formData.financial_details.bank_account_details} onChange={handleChange} />
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50 text-sky-500">
                <Globe size={22} />
                <h3 className="text-lg font-bold text-gray-800">Presence</h3>
              </div>
              <FormInput label="Website" placeholder="https://..." section="online_presence" field="website" fullWidth value={formData.online_presence.website} onChange={handleChange} />
            </section>
          </div>

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
    </>
  );
}

export default Vendorpage;