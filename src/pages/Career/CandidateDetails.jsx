import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Mail, Calendar, MapPin, 
  Briefcase, GraduationCap, CheckCircle, XCircle, FileText, ArrowLeft 
} from 'lucide-react';

const CandidateDetail = () => {
  const [view, setView] = useState('list'); // 'list' or 'review'
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "https://api.wemis.in/api/hr/bgv";
  const AUTH_TOKEN = localStorage.getItem('accessToken'); // Ensure this matches your login key

  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  };

  // 1. Fetch the BGV List
  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/list`, { headers });
      if (!response.ok) throw new Error('Failed to fetch BGV list');
      const data = await response.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  // 2. Fetch Specific Candidate Details (Review Screen)
  const handleReview = async (token) => {
    console.log(token)
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/get-details/${token}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch details');
      const data = await response.json();
      setSelectedCandidate(data);
      setView('review');
    } catch (err) {
      alert("Error loading details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Approve BGV
  const handleApprove = async (id) => {
    if (!window.confirm("Confirm BGV Approval?")) return;
    try {
      const response = await fetch(`${API_BASE}/${id}/approve-bgv`, {
        method: 'POST',
        headers
      });
      if (response.ok) {
        alert("Candidate Approved Successfully");
        setView('list');
        fetchList();
      }
    } catch (err) {
      alert("Approval failed");
    }
  };

  // --- UI COMPONENTS ---

  const ListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 font-semibold text-slate-700">Candidate Name</th>
            <th className="p-4 font-semibold text-slate-700">Email</th>
            <th className="p-4 font-semibold text-slate-700">Status</th>
            <th className="p-4 font-semibold text-slate-700 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-800">{c.fullName || 'N/A'}</td>
              <td className="p-4 text-slate-600">{c.emailAddress}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {c.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => handleReview(c.token)}
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Review Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ReviewView = () => {
    const data = selectedCandidate;
    return (
      <div className="space-y-6 pb-10">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{data.fullName}</h1>
            <p className="text-slate-500">{data.emailAddress}</p>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              {data.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Education Table */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                <GraduationCap className="text-indigo-500" /> Education Details
              </h2>
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b">
                  <tr>
                    <th className="pb-2 text-left">Institute</th>
                    <th className="pb-2 text-left">Passing Year</th>
                    <th className="pb-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.educationDetails?.map((edu, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 font-medium">{edu.institute || 'N/A'}</td>
                      <td className="py-3">{edu.passingYear}</td>
                      <td className="py-3 text-right">{edu.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Employment History */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                <Briefcase className="text-indigo-500" /> Work History
              </h2>
              {data.employmentHistory?.map((job, i) => (
                <div key={i} className="mb-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-bold text-slate-700">{job.companyName}</h4>
                  <p className="text-sm text-slate-500">{job.designation}</p>
                  <p className="text-xs text-slate-400 mt-1">{job.startDate} to {job.endDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Documents & Identity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Aadhaar No:</span>
                  <span className="font-mono font-medium">[Redacted]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-medium">{data.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Acc No:</span>
                  <span className="font-mono">{data.accountNumber}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                <button className="w-full text-left text-sm flex items-center gap-2 text-indigo-600 font-medium hover:underline">
                  <FileText size={16} /> View Aadhaar Card PDF
                </button>
                <button className="w-full text-left text-sm flex items-center gap-2 text-indigo-600 font-medium hover:underline">
                  <FileText size={16} /> View Degree Certificate
                </button>
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleApprove(data.id)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                <CheckCircle size={20} /> Approve Candidate
              </button>
              <button className="w-full bg-white text-red-600 border border-red-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
                <XCircle size={20} /> Reject Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Processing...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">BGV Administration</h1>
          <p className="text-slate-500">Background Verification & Compliance Dashboard</p>
        </header>

        {view === 'list' ? <ListView /> : <ReviewView />}
      </div>
    </div>
  );
};

export default CandidateDetail;