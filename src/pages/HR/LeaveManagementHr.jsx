import React, { useState, useEffect } from 'react';
import { Check, X, Search, Clock, Calendar, User, Loader2, ArrowUpRight, Sidebar } from 'lucide-react';
import MainNavbar from '../Career/MainNavbar';
import BackNavbar from '../Career/BackNavbar';


const LeaveManagementHr = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Stores ID of the leave being processed
  const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      // Note: Update this URL if there is a specific 'get all leaves' endpoint for HR
      const response = await fetch('https://api.wemis.in/api/leave/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      const response = await fetch(`https://api.wemis.in/api/leave/${id}/${status}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      if (response.ok) {
        // Refresh list after update
        fetchLeaves();
      }
    } catch (err) {
      console.error(`Error during ${status}:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLeaves = leaves.filter(l => l.status === filter);

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <Sidebar/>
      <div className="flex-1 flex flex-col min-w-0">
        <BackNavbar />
        
        <main className="flex-1 p-6 md:p-12 lg:p-16">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Administration</p>
                <h1 className="text-3xl font-light tracking-tight mt-1">Leave Requests</h1>
              </div>

              {/* Status Tabs */}
              <nav className="flex gap-8 border-b border-gray-100">
                {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`pb-4 text-[10px] tracking-[0.2em] uppercase transition-all relative ${
                      filter === s ? 'text-black font-medium' : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    {s}
                    {filter === s && <div className="absolute bottom-0 left-0 w-full h-px bg-black"></div>}
                  </button>
                ))}
              </nav>
            </header>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100">
                    <th className="pb-4 font-normal">Employee</th>
                    <th className="pb-4 font-normal">Duration</th>
                    <th className="pb-4 font-normal">Reason</th>
                    <th className="pb-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-[10px] tracking-widest text-gray-300 uppercase font-light">
                        <Loader2 className="animate-spin mx-auto mb-2" size={20} /> Loading Database...
                      </td>
                    </tr>
                  ) : filteredLeaves.length > 0 ? (
                    filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <User size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-normal text-gray-900">{leave.employeeName || 'Staff Member'}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{leave.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-xs text-gray-500 tabular-nums">
                          <div className="flex items-center gap-2">
                            <span>{leave.fromDate}</span>
                            <span className="text-gray-200">—</span>
                            <span>{leave.toDate}</span>
                          </div>
                        </td>
                        <td className="py-6">
                          <p className="text-xs text-gray-500 max-w-xs truncate" title={leave.reason}>
                            {leave.reason}
                          </p>
                        </td>
                        <td className="py-6 text-right">
                          {filter === 'PENDING' ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleStatusUpdate(leave.id, 'approve')}
                                disabled={actionLoading === leave.id}
                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-sm transition-all"
                                title="Approve"
                              >
                                {actionLoading === leave.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={16} />}
                              </button>
                              <button 
                                onClick={() => handleAction(leave.id, 'reject')}
                                disabled={actionLoading === leave.id}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-all"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[9px] tracking-widest uppercase px-3 py-1 rounded-sm border ${
                              filter === 'APPROVED' ? 'border-emerald-100 text-emerald-600 bg-emerald-50/30' : 'border-red-100 text-red-400 bg-red-50/30'
                            }`}>
                              {leave.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-[10px] tracking-widest text-gray-300 uppercase italic">
                        No {filter.toLowerCase()} requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <footer className="mt-12 pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-300 uppercase tracking-widest">
              <p>Traxo India Leave Management System</p>
              <div className="flex items-center gap-1 italic">
                Verified Records <ArrowUpRight size={10} />
              </div>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveManagementHr;