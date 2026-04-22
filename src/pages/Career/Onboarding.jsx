import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Users, CheckCircle, XCircle, Loader2, AlertCircle,
  FileText, Mail, Phone, Briefcase, Shield, RefreshCw,
  ArrowLeft, ChevronRight, Building2, CreditCard,
  UserCheck, Zap, BarChart3, Clock, Check, X,
  ChevronDown, Eye, Search, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "https://api.wemis.in/api";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const getToken = () => localStorage.getItem('accessToken');

const api = (method, url, data) =>
  axios({ method, url: `${API_BASE}${url}`, data, headers: { Authorization: `Bearer ${getToken()}` } });

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    BGV_SUBMITTED:       { label: 'BGV Submitted',       cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    BGV_APPROVED:        { label: 'BGV Approved',         cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ONBOARDING_SUBMITTED:{ label: 'Onboarding Submitted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    COMPLETED:           { label: 'Completed',            cls: 'bg-green-50 text-green-700 border-green-200' },
    BGV_IN_PROGRESS:     { label: 'BGV In Progress',      cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    ONBOARDING:          { label: 'Onboarding',           cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    CURRENT:             { label: 'Current Employee',     cls: 'bg-green-50 text-green-800 border-green-300' },
  };
  const b = map[status] || { label: status || 'Unknown', cls: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border rounded-full ${b.cls}`}>
      {b.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={18} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// CANDIDATE ROW
// ─────────────────────────────────────────────
const CandidateRow = ({ candidate, selected, onToggle, status }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`border-b border-gray-50 transition-colors ${selected ? 'bg-indigo-50/40' : 'hover:bg-gray-50/60'}`}
  >
    <td className="px-4 py-4">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="rounded border-gray-300 text-indigo-600 cursor-pointer"
      />
    </td>
    <td className="px-4 py-4">
      <div>
        <p className="font-semibold text-gray-900 text-sm">{candidate.fullName || candidate.name || 'N/A'}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
          <Mail size={9} /> {candidate.emailAddress || candidate.email || 'N/A'}
        </p>
        {(candidate.phoneNumber || candidate.phone) && (
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
            <Phone size={9} /> {candidate.phoneNumber || candidate.phone}
          </p>
        )}
      </div>
    </td>
    <td className="px-4 py-4">
      <p className="text-xs text-gray-600 flex items-center gap-1">
        <Briefcase size={11} className="text-gray-400" />
        {candidate.currentJobTitle || candidate.jobTitle || candidate.position || '—'}
      </p>
      {candidate.employeeId && (
        <p className="text-[10px] text-indigo-500 mt-0.5 font-mono">{candidate.employeeId}</p>
      )}
    </td>
    <td className="px-4 py-4">
      <Badge status={status || candidate.bgvStatus || candidate.status} />
    </td>
    <td className="px-4 py-4 text-[10px] text-gray-400">
      {formatDate(candidate.submittedAt || candidate.updatedAt || candidate.createdAt)}
    </td>
  </motion.tr>
);

// ─────────────────────────────────────────────
// CONFIRMATION MODAL
// ─────────────────────────────────────────────
const ConfirmModal = ({ open, title, message, count, onConfirm, onCancel, loading, actionLabel, color }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto ${color === 'emerald' ? 'bg-emerald-100' : 'bg-green-100'}`}>
            <CheckCircle size={28} className={color === 'emerald' ? 'text-emerald-600' : 'text-green-600'} />
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center mb-2">{message}</p>
          <p className="text-center text-2xl font-bold text-gray-900 mb-6">
            {count} candidate{count !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 text-white font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
                color === 'emerald'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {actionLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────
// SECTION: BGV APPROVAL (Step 2 of HR flow)
// ─────────────────────────────────────────────
const BGVApprovalSection = ({ onSuccess, onError }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api('get', '/hr/bgv/pending-approval');
      const data = res.data?.data || res.data || [];
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));
  };

  const handleBulkApprove = async () => {
    setProcessing(true);
    try {
      await api('post', '/hr/bgv/bulk-approve', selected);
      onSuccess(`✅ ${selected.length} candidate(s) approved! Employee records created in ONBOARDING status.`);
      setSelected([]);
      setShowConfirm(false);
      await fetchPending();
    } catch (err) {
      onError(err.response?.data?.message || 'Bulk approve failed');
      setShowConfirm(false);
    } finally {
      setProcessing(false);
    }
  };

  const filtered = candidates.filter(c =>
    (c.fullName || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.emailAddress || c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</div>
            BGV Bulk Approval
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5 ml-8">
            Candidates who completed BGV form submission — ready for HR approval
          </p>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors bg-white"
          />
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all"
          >
            <CheckCircle size={14} />
            Approve Selected ({selected.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
            <span className="text-xs text-gray-400">Loading candidates...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <CheckCircle size={32} className="text-gray-200" />
            <p className="text-sm text-gray-400">No candidates pending BGV approval</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-bold">Candidate</th>
                <th className="px-4 py-3 text-left font-bold">Position</th>
                <th className="px-4 py-3 text-left font-bold">BGV Status</th>
                <th className="px-4 py-3 text-left font-bold">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  selected={selected.includes(c.id)}
                  onToggle={() => setSelected(prev =>
                    prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id]
                  )}
                  status="BGV_SUBMITTED"
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Bulk Approve BGV"
        message="You are about to approve BGV for"
        count={selected.length}
        onConfirm={handleBulkApprove}
        onCancel={() => setShowConfirm(false)}
        loading={processing}
        actionLabel="Approve All"
        color="emerald"
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: ONBOARDING FINALIZATION (Step 4 of HR flow)
// ─────────────────────────────────────────────
const OnboardingFinalizeSection = ({ onSuccess, onError }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [search, setSearch] = useState('');

  const fetchReady = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api('get', '/hr/bgv/ready-to-finalize');
      const data = res.data?.data || res.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to fetch employees ready to finalize');
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => { fetchReady(); }, [fetchReady]);

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(e => e.employeeId || e.id));
  };

  const handleBulkFinalize = async () => {
    setProcessing(true);
    try {
      await api('post', '/hr/bgv/bulk-finalize', selected);
      onSuccess(`🎉 ${selected.length} employee(s) finalized! Status set to CURRENT. All data merged into employee profiles.`);
      setSelected([]);
      setShowConfirm(false);
      await fetchReady();
    } catch (err) {
      onError(err.response?.data?.message || 'Bulk finalize failed');
      setShowConfirm(false);
    } finally {
      setProcessing(false);
    }
  };

  const filtered = employees.filter(e =>
    (e.fullName || e.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.emailAddress || e.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">2</div>
            Onboarding Finalization
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5 ml-8">
            Employees who submitted bank & emergency details — ready for final activation
          </p>
        </div>
        <button
          onClick={fetchReady}
          disabled={loading}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-green-400 transition-colors bg-white"
          />
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            <Zap size={14} />
            Finalize Selected ({selected.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-green-400" />
            <span className="text-xs text-gray-400">Loading employees...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <UserCheck size={32} className="text-gray-200" />
            <p className="text-sm text-gray-400">No employees pending finalization</p>
            <p className="text-xs text-gray-300">Candidates need to submit bank & emergency info first</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-green-600 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-bold">Employee</th>
                <th className="px-4 py-3 text-left font-bold">Position / ID</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <CandidateRow
                  key={e.id || e.employeeId}
                  candidate={e}
                  selected={selected.includes(e.employeeId || e.id)}
                  onToggle={() => {
                    const eid = e.employeeId || e.id;
                    setSelected(prev =>
                      prev.includes(eid) ? prev.filter(x => x !== eid) : [...prev, eid]
                    );
                  }}
                  status="ONBOARDING_SUBMITTED"
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Bulk Finalize Onboarding"
        message="You are about to activate as CURRENT employees:"
        count={selected.length}
        onConfirm={handleBulkFinalize}
        onCancel={() => setShowConfirm(false)}
        loading={processing}
        actionLabel="Finalize All"
        color="green"
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// WORKFLOW GUIDE
// ─────────────────────────────────────────────
const WorkflowGuide = () => {
  const steps = [
    { num: 1, actor: 'Candidate', label: 'Submits BGV Form', desc: 'Portal → personal, education, work history', status: 'BGV_SUBMITTED', color: 'bg-indigo-500' },
    { num: 2, actor: 'HR', label: 'Bulk Approve BGV', desc: 'One click → creates employee in ONBOARDING', status: 'BGV_APPROVED', color: 'bg-emerald-500' },
    { num: 3, actor: 'Candidate', label: 'Submits Bank & Emergency Info', desc: 'Portal shows bank form after approval', status: 'ONBOARDING_SUBMITTED', color: 'bg-amber-500' },
    { num: 4, actor: 'HR', label: 'Bulk Finalize', desc: 'One click → Employee becomes CURRENT', status: 'CURRENT', color: 'bg-green-600' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-100 rounded-xl p-6 mb-8">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Onboarding Workflow</h3>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3">
              <div className={`w-8 h-8 rounded-full ${step.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                {step.num}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    step.actor === 'HR' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {step.actor}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">{step.label}</p>
                <p className="text-[10px] text-gray-400">{step.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Onboarding = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('bgv-approval');
  const [stats, setStats] = useState({ pendingApproval: 0, readyToFinalize: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 6000);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 5000);
  };

  // Fetch stats for overview
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const [pendingRes, finalizeRes] = await Promise.allSettled([
        api('get', '/hr/bgv/pending-approval'),
        api('get', '/hr/bgv/ready-to-finalize'),
      ]);

      const pending = pendingRes.status === 'fulfilled'
        ? (pendingRes.value.data?.data || pendingRes.value.data || []).length : 0;
      const finalize = finalizeRes.status === 'fulfilled'
        ? (finalizeRes.value.data?.data || finalizeRes.value.data || []).length : 0;

      setStats({ pendingApproval: pending, readyToFinalize: finalize, total: pending + finalize });
    } catch {}
    setStatsLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  // Re-fetch stats when success message fires (after bulk actions)
  useEffect(() => {
    if (success) fetchStats();
  }, [success]);

  const tabs = [
    { id: 'bgv-approval', label: 'BGV Approval', icon: Shield, count: stats.pendingApproval },
    { id: 'onboarding-finalize', label: 'Onboarding Finalize', icon: UserCheck, count: stats.readyToFinalize },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Onboarding Dashboard</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">HR · Background Verification & Employee Activation</p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw size={12} className={statsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4"
            >
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600 flex-1">{error}</p>
              <button onClick={() => setError(null)}>
                <X size={14} className="text-red-400 hover:text-red-600" />
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4"
            >
              <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700 flex-1">{success}</p>
              <button onClick={() => setSuccess(null)}>
                <X size={14} className="text-emerald-400 hover:text-emerald-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Pending BGV Approval"
            value={statsLoading ? '—' : stats.pendingApproval}
            sub="Candidates who submitted BGV form"
            color="bg-indigo-500"
            icon={Shield}
          />
          <StatCard
            label="Ready to Finalize"
            value={statsLoading ? '—' : stats.readyToFinalize}
            sub="Employees who submitted bank info"
            color="bg-green-500"
            icon={UserCheck}
          />
          <StatCard
            label="Total Pending Actions"
            value={statsLoading ? '—' : stats.total}
            sub="Across all onboarding stages"
            color="bg-purple-500"
            icon={BarChart3}
          />
        </div>

        {/* Workflow Guide */}
        <WorkflowGuide />

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${
                    active
                      ? 'text-gray-900 bg-white'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    />
                  )}
                  <Icon size={14} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'bgv-approval' && (
                <motion.div
                  key="bgv-approval"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <BGVApprovalSection onSuccess={showSuccess} onError={showError} />
                </motion.div>
              )}
              {activeTab === 'onboarding-finalize' && (
                <motion.div
                  key="onboarding-finalize"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <OnboardingFinalizeSection onSuccess={showSuccess} onError={showError} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* API Quick Reference */}
        <details className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <summary className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:bg-gray-50 flex items-center gap-2">
            <FileText size={14} />
            API Reference (Developer)
          </summary>
          <div className="px-6 pb-6 pt-2 space-y-3">
            {[
              { method: 'GET',  url: '/hr/bgv/pending-approval',  desc: 'Fetch candidates with BGV_SUBMITTED status' },
              { method: 'POST', url: '/hr/bgv/bulk-approve',       desc: 'Approve BGVs → creates employees in ONBOARDING', body: '["bgv_id_1", "bgv_id_2"]' },
              { method: 'GET',  url: '/hr/bgv/ready-to-finalize',  desc: 'Fetch employees with ONBOARDING_SUBMITTED status' },
              { method: 'POST', url: '/hr/bgv/bulk-finalize',      desc: 'Finalize onboarding → employee status becomes CURRENT', body: '["EMP-ID-1", "EMP-ID-2"]' },
            ].map(r => (
              <div key={r.url} className="flex items-start gap-3 text-xs font-mono bg-gray-50 rounded-lg p-3">
                <span className={`font-bold flex-shrink-0 ${r.method === 'GET' ? 'text-blue-500' : 'text-green-600'}`}>
                  {r.method}
                </span>
                <div className="flex-1">
                  <p className="text-gray-600">{r.url}</p>
                  <p className="text-gray-400 font-sans text-[10px] mt-0.5">{r.desc}</p>
                  {r.body && <p className="text-gray-500 mt-1 text-[10px]">Body: {r.body}</p>}
                </div>
              </div>
            ))}
          </div>
        </details>

      </div>
    </div>
  );
};

export default Onboarding;
