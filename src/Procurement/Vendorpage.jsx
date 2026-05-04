import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const Input = ({ placeholder, onChange, type = "text" }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
  />
);

const FileInput = ({ name, onChange, label }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="text-sm border p-2 rounded-lg file:bg-blue-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded-md file:cursor-pointer"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-gray-50 p-5 rounded-xl border space-y-4">
    <h2 className="font-semibold text-lg text-gray-700">{title}</h2>
    {children}
  </div>
);

const VendorForm = () => {
  const [loading, setLoading] = useState(false);

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

  const [files, setFiles] = useState({});

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("legal_details", JSON.stringify(formData.legal_details));
      formDataToSend.append("contact_details", JSON.stringify(formData.contact_details));
      formDataToSend.append("bank_details", JSON.stringify(formData.bank_details));
      formDataToSend.append("compliance", JSON.stringify(formData.compliance));

      Object.keys(files).forEach((key) => {
        if (files[key]) formDataToSend.append(key, files[key]);
      });

      await axios.post(
        "https://api.traxoerp.com/vendors/register",
        formDataToSend
      );

      toast.success("Vendor Registered Successfully ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center p-4">
      <Toaster position="top-right" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Vendor Registration
        </h1>

        {/* Legal */}
        <Section title="Legal Details">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Legal Entity Name"
              onChange={(e)=>handleChange("legal_details","legal_entity_name",e.target.value)} />
            <Input placeholder="Business Structure"
              onChange={(e)=>handleChange("legal_details","business_structure",e.target.value)} />
            <Input placeholder="PAN Number"
              onChange={(e)=>handleChange("legal_details","pan_number",e.target.value)} />
            <Input placeholder="GSTIN"
              onChange={(e)=>handleChange("legal_details","gstin",e.target.value)} />
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Details">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Contact Person Name"
              onChange={(e)=>handleChange("contact_details","contact_person_name",e.target.value)} />
            <Input placeholder="Email" type="email"
              onChange={(e)=>handleChange("contact_details","email",e.target.value)} />
            <Input placeholder="Phone Number"
              onChange={(e)=>handleChange("contact_details","phone_number",e.target.value)} />
          </div>
        </Section>

        {/* Bank */}
        <Section title="Bank Details">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Bank Name"
              onChange={(e)=>handleChange("bank_details","bank_name",e.target.value)} />
            <Input placeholder="Account Number"
              onChange={(e)=>handleChange("bank_details","account_number",e.target.value)} />
            <Input placeholder="IFSC Code"
              onChange={(e)=>handleChange("bank_details","ifsc_code",e.target.value)} />
          </div>
        </Section>

        {/* Compliance */}
        <Section title="Compliance">
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox"
                onChange={(e)=>handleChange("compliance","anti_bribery",e.target.checked)} />
              Anti Bribery
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox"
                onChange={(e)=>handleChange("compliance","conflict_of_interest",e.target.checked)} />
              Conflict of Interest
            </label>
          </div>
        </Section>

        {/* Files */}
        <Section title="Upload Documents">
          <div className="grid md:grid-cols-2 gap-4">
            <FileInput name="pan_card" label="PAN Card" onChange={handleFileChange} />
            <FileInput name="gst_certificate" label="GST Certificate" onChange={handleFileChange} />
            <FileInput name="cancelled_cheque" label="Cancelled Cheque" onChange={handleFileChange} />
            <FileInput name="address_proof" label="Address Proof" onChange={handleFileChange} />
            <FileInput name="iso_certificate" label="ISO Certificate" onChange={handleFileChange} />
          </div>
        </Section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default VendorForm;
