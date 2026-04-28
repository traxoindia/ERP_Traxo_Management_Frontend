import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API CONFIGURATION ---
const API_BASE_URL = 'https://api.traxoerp.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

const api = {
  // Fetch all companies
  getCompanies: () => axios.get(`${API_BASE_URL}/company/get-companies`, getAuthHeaders()),
  
  // Create a new branch
  createBranch: (data) => axios.post(`${API_BASE_URL}/branches/`, data, getAuthHeaders()),
  
  // Fetch branches for a specific company
  getBranchesByCompany: (companyId) => 
    axios.post(`${API_BASE_URL}/branches/get-by-company`, { company_id: companyId }, getAuthHeaders()),
  
  // Delete a branch via query parameter
  deleteBranch: (branchId) => 
    axios.delete(`${API_BASE_URL}/branches/?branch_id=${branchId}`, getAuthHeaders()),
};

// --- MAIN COMPONENT ---
export default function BranchManager() {
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [loading, setLoading] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', location: '' });

  // Load companies on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.getCompanies();
      // Accessing the 'companies' array from the nested response
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const fetchBranches = async (compId) => {
    if (!compId) {
      setBranches([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getBranchesByCompany(compId);
      // UPDATED: Accessing res.data.branches based on your response structure
      setBranches(res.data.branches || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCompId) return alert("Please select a company first!");
    
    try {
      await api.createBranch({ 
        name: newBranch.name, 
        location: newBranch.location, 
        company_id: selectedCompId 
      });
      setNewBranch({ name: '', location: '' });
      fetchBranches(selectedCompId); // Refresh the list
    } catch (err) {
      alert("Failed to create branch. Check console for details.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await api.deleteBranch(id);
      // Update UI locally
      setBranches(branches.filter(b => b._id !== id));
    } catch (err) {
      alert("Error deleting branch.");
    }
  };

  const selectedCompany = companies.find(c => c._id === selectedCompId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="bg-indigo-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">B</div>
            <span className="text-xl font-bold tracking-tight">BranchManager</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="text-sm bg-indigo-800 hover:bg-red-500 px-4 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SELECTION & CREATION (4 Units) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Company Selection Card */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Select Context</h2>
            <select 
              className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 border focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={selectedCompId}
              onChange={(e) => {
                setSelectedCompId(e.target.value);
                fetchBranches(e.target.value);
              }}
            >
              <option value="">-- Choose a Company --</option>
              {companies.map(c => (
                <option key={c._id} value={c._id}>
                  {c.companyInfo?.companyName || 'Unnamed Company'}
                </option>
              ))}
            </select>

            {selectedCompany && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-700 font-bold uppercase tracking-tighter">Active Company</p>
                <p className="text-lg font-bold text-indigo-900 leading-tight">
                  {selectedCompany.companyInfo?.companyName}
                </p>
                <p className="text-xs text-indigo-600 mt-1">{selectedCompany.address?.city}, {selectedCompany.address?.state}</p>
              </div>
            )}
          </section>

          {/* Create Branch Card */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Add New Branch</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input 
                type="text" placeholder="Branch Name (e.g. Main Office)"
                className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 border focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newBranch.name}
                onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                required
              />
              <input 
                type="text" placeholder="Location (e.g. Bhubaneswar)"
                className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 border focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newBranch.location}
                onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
                required
              />
              <button 
                disabled={!selectedCompId}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-30 disabled:grayscale transition-all shadow-md active:scale-95"
              >
                Create Branch
              </button>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: BRANCH LIST (8 Units) */}
        <div className="lg:col-span-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
            <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Branches</h2>
                <p className="text-sm text-slate-400">Total Registered: {branches.length}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Branch Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                          <span className="text-slate-400 text-sm font-medium">Loading branches...</span>
                        </div>
                      </td>
                    </tr>
                  ) : branches.length > 0 ? (
                    branches.map((branch) => (
                      <tr key={branch._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-700">{branch.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{branch._id}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {branch.location}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(branch._id)}
                            className="text-red-400 hover:text-red-600 font-bold text-xs p-2 hover:bg-red-50 rounded-lg transition-all"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-20 text-center">
                        <p className="text-slate-300 font-medium">
                          {selectedCompId ? 'No branches found for this company.' : 'Please select a company on the left to see branches.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}