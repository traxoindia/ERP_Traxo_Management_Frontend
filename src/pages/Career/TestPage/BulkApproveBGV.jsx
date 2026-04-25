import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  Users, 
  CreditCard, 
  Zap, 
  RefreshCcw, 
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // Track specific row loading
  const [token, setToken] = useState("");
  
  const [pendingList, setPendingList] = useState([]);
  const [readyList, setReadyList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    emergencyContactName: "",
    emergencyContactNumber: ""
  });

  const BASE_URL = "https://api.wemis.in";

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken || "");
    fetchDashboardData(storedToken);
  }, []);

  const getHeaders = (t) => ({
    headers: { 
        Authorization: `Bearer ${t || token}`, 
        'Content-Type': 'application/json' 
    }
  });

  const fetchDashboardData = async (t) => {
    setLoading(true);
    try {
      const [resPending, resReady] = await Promise.all([
        axios.get(`${BASE_URL}/api/hr/bgv/pending-approval`, getHeaders(t)),
        axios.get(`${BASE_URL}/api/hr/bgv/ready-to-finalize`, getHeaders(t))
      ]);
      setPendingList(resPending.data || []);
      setReadyList(resReady.data || []);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * NEW: Handle Bulk Approve before moving to onboarding form
   */
  const handleApproveAndProceed = async (candidate) => {
    setActionLoading(candidate.id);
    console.log(`%c [API] Approving Candidate ID: ${candidate.id}`, "color: #fbbf24; font-weight: bold");

    try {
      // The API expects an array of IDs for "bulk" approval
      await axios.post(
        `${BASE_URL}/api/hr/bgv/bulk-approve`, 
        [candidate.id], 
        getHeaders()
      );
      
      console.log("Approval Successful");
      setSelectedCandidate(candidate);
      setActiveTab('onboarding');
    } catch (err) {
      console.error("Approval Error:", err);
      alert("Failed to approve candidate. Please check your permissions or token.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    setLoading(true);
    try {
      // Note: Using the provided token and updated headers
      await axios.post(
        `${BASE_URL}/api/public/bgv/submit-onboarding/${selectedCandidate.id}`, 
        bankDetails,
        getHeaders()
      );
      
      setBankDetails({ bankName: "", accountNumber: "", ifscCode: "", emergencyContactName: "", emergencyContactNumber: "" });
      setSelectedCandidate(null);
      await fetchDashboardData(); // Refresh lists
      setActiveTab('finalize');
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed to submit onboarding details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkFinalize = async () => {
    const ids = readyList.map(emp => emp.id);
    if (ids.length === 0) return;

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/hr/bgv/bulk-finalize`, ids, getHeaders());
      fetchDashboardData();
      alert("All employees have been finalized successfully.");
    } catch (err) {
      console.error("Finalize Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">OnboardFlow</span>
          </div>
          <button 
            onClick={() => fetchDashboardData()}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center w-full max-w-3xl">
            {[
              { id: 'pending', label: 'Approval', icon: Users },
              { id: 'onboarding', label: 'Bank Details', icon: CreditCard },
              { id: 'finalize', label: 'Finalize', icon: CheckCircle },
            ].map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center group relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 
                    ${activeTab === step.id ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white border-slate-200'}`}>
                    <step.icon className={`w-5 h-5 ${activeTab === step.id ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <span className={`absolute -bottom-7 text-xs font-bold uppercase tracking-wider whitespace-nowrap
                    ${activeTab === step.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {idx !== 2 && <div className="flex-1 h-[2px] bg-slate-200 mx-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tab Content: 1. PENDING (With Integrated Approval) */}
        {activeTab === 'pending' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">Candidates Pending Approval</h2>
                <span className="text-sm text-slate-500 font-medium">{pendingList.length} total</span>
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 text-left">Candidate Name</th>
                      <th className="px-6 py-4 text-left">Internal ID</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingList.map(c => (
                      <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-700">{c.fullName}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{c.id}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            disabled={actionLoading === c.id}
                            onClick={() => handleApproveAndProceed(c)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 disabled:text-slate-300"
                          >
                            {actionLoading === c.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>Approve & Next <ChevronRight className="w-4 h-4" /></>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pendingList.length === 0 && !loading && (
                    <div className="p-20 text-center text-slate-400 italic">No pending candidates.</div>
                )}
              </div>
            </div>
            <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-100">
               <h3 className="text-xl font-bold mb-4">Approval Process</h3>
               <p className="text-indigo-100 text-sm leading-relaxed">
                 Clicking <strong>Approve & Next</strong> will verify the candidate's background via the Bulk Approval API and automatically proceed to bank detail collection.
               </p>
            </div>
          </div>
        )}

        {/* Tab Content: 2. ONBOARDING (Bank Details) */}
        {activeTab === 'onboarding' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Step 2: Bank & Emergency Info</p>
                  <h2 className="text-2xl font-bold">
                    {selectedCandidate ? `Onboarding: ${selectedCandidate.fullName}` : "Select a candidate"}
                  </h2>
                </div>
                <button 
                  onClick={() => setActiveTab('pending')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              
              <form onSubmit={handleOnboardingSubmit} className="p-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bank Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Bank Name"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      required
                    />
                    <input 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Account Number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      required
                    />
                    <div className="md:col-span-2">
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="IFSC Code"
                        value={bankDetails.ifscCode}
                        onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Contacts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Contact Name"
                      value={bankDetails.emergencyContactName}
                      onChange={(e) => setBankDetails({...bankDetails, emergencyContactName: e.target.value})}
                      required
                    />
                    <input 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Contact Number"
                      value={bankDetails.emergencyContactNumber}
                      onChange={(e) => setBankDetails({...bankDetails, emergencyContactNumber: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading || !selectedCandidate}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-slate-200"
                >
                  {loading ? "Saving Details..." : "Complete Submission"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Content: 3. FINALIZE */}
        {activeTab === 'finalize' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">Finalize Activation</h2>
                <p className="text-slate-500">Profiles ready for system activation</p>
              </div>
              <button 
                onClick={handleBulkFinalize}
                disabled={loading || readyList.length === 0}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 disabled:bg-slate-200"
              >
                Execute Bulk Finalize ({readyList.length})
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Full Name</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Data Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {readyList.map(e => (
                    <tr key={e.id}>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{e.id}</td>
                      <td className="px-6 py-4 font-semibold">{e.fullName}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3 h-3" /> Ready
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs font-bold text-slate-400 italic">Complete</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {readyList.length === 0 && <div className="p-20 text-center text-slate-400">No profiles pending finalization.</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;