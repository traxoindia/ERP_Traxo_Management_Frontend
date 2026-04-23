import React, { useState } from "react";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";

const CreateRequirementModal = ({ isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    category: "",
    // Changed to match your schema requirement
    company_name: "Traxo India Automotion Pvt Ltd", 
    status: "open"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      quantity: Number(formData.quantity), // Ensures integer type
      created_at: new Date().toISOString()
    };

    try {
      const response = await axios.post(
        "https://python-backend-2-5uar.onrender.com/requirement/create-requirement",
        payload
      );

      setSuccess(true);
      // Wait a moment to show success state, then close and refresh parent list
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onRefresh) onRefresh(); 
        // Reset form
        setFormData({
            title: "",
            description: "",
            quantity: "",
            category: "",
            company_name: "Traxo India Automotion Pvt Ltd",
            status: "open"
        });
      }, 1500);

    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Failed to submit. Please check your backend endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Post New Requirement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle2 size={16} />
              Requirement posted successfully!
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Requirement Title</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Industrial Steel Pipes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quantity</label>
              <input
                required
                type="number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Hardware"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Company</label>
            <input
              disabled
              type="text"
              className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
              value={formData.company_name}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
            <textarea
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Detail your procurement needs..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-blue-200"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Confirm Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequirementModal;