import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowLeft, Loader2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeNavbar from './EmployeeNavbar';

const EmployeeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const employeeId = localStorage.getItem('employeeId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`https://api.wemis.in/api/attendance/${employeeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate stats for the current view
  const stats = {
    present: history.filter(h => h.status === 'PRESENT').length,
    absent: history.filter(h => h.status === 'ABSENT').length,
    halfDay: history.filter(h => h.status === 'HALF_DAY').length,
  };

  const filteredHistory = history.filter(h => 
    h.date.includes(searchQuery) || h.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EmployeeNavbar />
        
        <main className="flex-1 p-6 md:p-12 lg:p-16">
          <div className="max-w-5xl mx-auto">
            
            {/* Page Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <button 
                  onClick={() => navigate(-1)} 
                  className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-4"
                >
                  <ArrowLeft size={12} /> Back to Dashboard
                </button>
                <h1 className="text-3xl font-light tracking-tight text-gray-900">Attendance Archive</h1>
                <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Employee Log / {employeeId}</p>
              </div>

              {/* Stats Summary - Minimalist */}
              <div className="flex gap-10 border-l border-gray-100 pl-10">
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-1">Present</p>
                  <p className="text-xl font-light">{stats.present}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-1">Absent</p>
                  <p className="text-xl font-light text-red-400">{stats.absent}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-1">Half-Day</p>
                  <p className="text-xl font-light text-orange-400">{stats.halfDay}</p>
                </div>
              </div>
            </header>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-gray-50">
              <div className="relative w-full max-w-sm group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="SEARCH BY DATE OR STATUS..." 
                  className="w-full bg-transparent pl-7 py-2 text-[10px] tracking-widest border-none focus:ring-0 outline-none uppercase placeholder:text-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="flex items-center gap-2 text-[9px] tracking-widest uppercase text-gray-500 hover:text-black transition-all">
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100">
                    <th className="pb-4 font-medium">Calendar Date</th>
                    <th className="pb-4 font-medium">Punch In</th>
                    <th className="pb-4 font-medium">Punch Out</th>
                    <th className="pb-4 font-medium">Total Hours</th>
                    <th className="pb-4 font-medium text-right">Session Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-gray-200" size={24} />
                        <p className="text-[10px] tracking-widest text-gray-400 mt-4 uppercase font-light">Retrieving Logs...</p>
                      </td>
                    </tr>
                  ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 font-normal text-gray-900">
                          {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-6 text-gray-500 tabular-nums">
                          <span className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                            {formatTime(row.checkIn)}
                          </span>
                        </td>
                        <td className="py-6 text-gray-500 tabular-nums">
                          {row.checkOut ? (
                            <span className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                              {formatTime(row.checkOut)}
                            </span>
                          ) : "--:--"}
                        </td>
                        <td className="py-6 text-gray-400 tabular-nums font-light">
                          {row.workingHours ? `${row.workingHours.toFixed(1)} hrs` : "—"}
                        </td>
                        <td className="py-6 text-right">
                          <span className={`text-[9px] tracking-widest uppercase px-3 py-1 rounded-sm border ${
                            row.status === 'PRESENT' 
                              ? 'border-gray-100 text-gray-900 bg-white' 
                              : row.status === 'ABSENT' 
                                ? 'border-red-100 text-red-400 bg-red-50/30' 
                                : 'border-orange-100 text-orange-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-[10px] tracking-widest text-gray-300 uppercase italic">
                        No archive data available for this criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-50 flex justify-between items-center">
              <p className="text-[10px] text-gray-300 uppercase tracking-widest italic font-light">
                Showing {filteredHistory.length} entries
              </p>
              <div className="flex gap-4">
                <button className="text-[10px] text-gray-300 hover:text-black transition-colors uppercase tracking-widest">Prev</button>
                <button className="text-[10px] text-gray-300 hover:text-black transition-colors uppercase tracking-widest">Next</button>
              </div>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeHistory;