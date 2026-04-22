import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, AlertCircle, Users, Send } from 'lucide-react';

const API_BASE = "https://api.wemis.in/api";

const BulkApproveBGV = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Candidates ready for approval (Step 2 in your workflow)
  const fetchPendingApproval = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    
    try {
      const response = await axios.get(`${API_BASE}/hr/bgv/pending-approval`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Log the data as requested
      console.log("Pending Approval Data:", response.data);
      setCandidates(response.data?.data || response.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApproval();
  }, []);

  // 2. Toggle Selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 3. Handle Bulk Approval (Step 3 in your workflow)
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    
    setProcessing(true);
    const token = localStorage.getItem("accessToken");

    try {
      console.log("Sending IDs for Bulk Approval:", selectedIds);
      
      const response = await axios.post(
        `${API_BASE}/hr/bgv/bulk-approve`, 
        selectedIds, // Sending the array of strings directly
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Bulk Approval Response:", response.data);
      alert(`Success! ${selectedIds.length} candidates moved to Onboarding.`);
      
      // Reset and Refresh
      setSelectedIds([]);
      fetchPendingApproval();
    } catch (err) {
      console.error("Bulk Approve Error:", err);
      setError(err.response?.data?.message || "Bulk approval failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={24} /> BGV Pending Approval
          </h1>
          <p className="text-gray-500 text-sm">Step 3: One-Click Bulk Approval to Onboarding</p>
        </div>
        
        <button
          onClick={handleBulkApprove}
          disabled={selectedIds.length === 0 || processing}
          className="bg-black text-white px-6 py-2 rounded flex items-center gap-2 disabled:bg-gray-300 transition-colors"
        >
          {processing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          Approve Selected ({selectedIds.length})
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(candidates.map(c => c.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="p-4 text-xs uppercase font-bold text-gray-400">Candidate ID / Name</th>
                <th className="p-4 text-xs uppercase font-bold text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(candidate.id)}
                      onChange={() => toggleSelect(candidate.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{candidate.fullName || "Unnamed Candidate"}</div>
                    <div className="text-xs text-gray-400">{candidate.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold">
                      {candidate.status || 'BGV_SUBMITTED'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-400">No candidates ready for approval.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkApproveBGV;