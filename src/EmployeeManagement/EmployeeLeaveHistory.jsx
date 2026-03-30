import React, { useState, useEffect } from 'react';
import {
    Calendar, Search, Loader2, AlertCircle,
    CheckCircle2, XCircle, Clock, Send,
    Plus, History, ArrowRight
} from 'lucide-react';
import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeLeaveHistory = () => {
    const [activeTab, setActiveTab] = useState('apply'); // 'apply' or 'history'

    // Application Form State
    const [formLoading, setFormLoading] = useState(false);
    const [applyStatus, setApplyStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({ fromDate: '', toDate: '', reason: '' });

    // History State
    const [leaves, setLeaves] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const employeeId = localStorage.getItem('employeeId') || "TIA-126";
    const token = localStorage.getItem('accessToken');

    const fetchLeaveHistory = async () => {
        try {
            setHistoryLoading(true);
            const response = await fetch(`https://api.wemis.in/api/leave/employee/${employeeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setLeaves(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchLeaveHistory();
    }, [token]);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setApplyStatus({ type: '', message: '' });

        try {
            const response = await fetch('https://api.wemis.in/api/leave/apply', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ employeeId, ...formData })
            });

            if (response.ok) {
                setApplyStatus({ type: 'success', message: 'Application sent successfully' });
                setFormData({ fromDate: '', toDate: '', reason: '' });
                fetchLeaveHistory();
                // Optional: switch to history tab after success
                setTimeout(() => setActiveTab('history'), 1500);
            } else {
                throw new Error('Failed to submit request');
            }
        } catch (err) {
            setApplyStatus({ type: 'error', message: err.message });
        } finally {
            setFormLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toUpperCase();
        if (s === 'APPROVED') return "bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold";
        if (s === 'REJECTED') return "border border-gray-200 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold";
        return "bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold";
    };

    return (
        <>
            <EmployeeNavbar />
            <EmployeeSidebar />


            <div className="min-h-screen bg-white text-black font-sans antialiased">
                <div className="max-w-3xl mx-auto px-6 py-12">

                    {/* Simple Header */}
                    <header className="mb-12">
                        <h1 className="text-2xl font-bold tracking-tighter">LEAVE INTERFACE</h1>
                        <p className="text-gray-500 text-sm">Employee ID: {employeeId}</p>
                    </header>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100 mb-8">
                        <button
                            onClick={() => setActiveTab('apply')}
                            className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'apply' ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            Request Leave
                            {activeTab === 'apply' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            className={`pb-4 px-8 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            History
                            {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="animate-in fade-in duration-500">

                        {activeTab === 'apply' ? (
                            <div className="max-w-md">
                                <form onSubmit={handleApplyLeave} className="space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400">Start Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full border-b-2 border-gray-100 py-2 focus:border-black outline-none transition-colors text-sm"
                                                value={formData.fromDate}
                                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400">End Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full border-b-2 border-gray-100 py-2 focus:border-black outline-none transition-colors text-sm"
                                                value={formData.toDate}
                                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400">Reason</label>
                                        <textarea
                                            required
                                            rows="3"
                                            placeholder="Briefly describe the reason..."
                                            className="w-full border-b-2 border-gray-100 py-2 focus:border-black outline-none transition-colors text-sm resize-none"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        />
                                    </div>

                                    {applyStatus.message && (
                                        <div className={`text-[11px] font-bold uppercase p-3 rounded flex items-center gap-2 ${applyStatus.type === 'success' ? 'bg-gray-100 text-black' : 'bg-black text-white'
                                            }`}>
                                            {applyStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                            {applyStatus.message}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="group flex items-center gap-3 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-200"
                                    >
                                        {formLoading ? <Loader2 className="animate-spin" size={14} /> : (
                                            <>
                                                Submit Request
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-end mb-4">
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search history..."
                                            className="w-full border-b border-gray-100 py-2 pr-8 focus:border-black outline-none text-xs bg-transparent"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-100">
                                                <th className="py-4 text-left">Dates</th>
                                                <th className="py-4 text-left">Reason</th>
                                                <th className="py-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {historyLoading ? (
                                                <tr>
                                                    <td colSpan="3" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-gray-200" size={24} /></td>
                                                </tr>
                                            ) : leaves.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="py-20 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">Empty History</td>
                                                </tr>
                                            ) : (
                                                leaves
                                                    .filter(l => l.reason?.toLowerCase().includes(searchTerm.toLowerCase()))
                                                    .map((leave, idx) => (
                                                        <tr key={idx} className="group">
                                                            <td className="py-6 pr-4">
                                                                <div className="text-xs font-bold tabular-nums">{leave.fromDate}</div>
                                                                <div className="text-[10px] text-gray-400 mt-1 uppercase">to {leave.toDate}</div>
                                                            </td>
                                                            <td className="py-6 px-2 text-xs text-gray-500 max-w-[200px] truncate">
                                                                {leave.reason}
                                                            </td>
                                                            <td className="py-6 text-right">
                                                                <span className={getStatusBadge(leave.status)}>
                                                                    {leave.status || 'PENDING'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeLeaveHistory;