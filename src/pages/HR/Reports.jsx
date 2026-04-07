import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  CalendarCheck, 
  Wallet, 
  UserPlus, 
  Search, 
  Download,
  Filter
} from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  // Filter States
  const [filters, setFilters] = useState({
    employeeId: '',
    employeeName: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  });

  const reportConfigs = {
    attendance: {
      title: 'Attendance Report',
      icon: <CalendarCheck size={20} />,
      url: `https://api.wemis.in/api/hr/reports/attendance/${filters.employeeId}?year=${filters.year}&month=${filters.month}&day=${filters.day}`,
      columns: ['Date', 'Employee ID', 'Status', 'Check-In', 'Check-Out']
    },
    payroll: {
      title: 'Payroll Report',
      icon: <Wallet size={20} />,
      url: `https://api.wemis.in/api/hr/reports/payroll/${filters.employeeId}?year=${filters.year}&month=${filters.month}`,
      columns: ['Employee ID', 'Base Salary', 'Allowances', 'Deductions', 'Net Pay']
    },
    leave: {
      title: 'Leave Report',
      icon: <BarChart3 size={20} />,
      url: `https://api.wemis.in/api/hr/reports/leave/${filters.employeeId}?year=${filters.year}&month=${filters.month}`,
      columns: ['Leave Type', 'Start Date', 'End Date', 'Days', 'Status']
    },
    hiring: {
      title: 'New Hire Report',
      icon: <UserPlus size={20} />,
      url: `https://api.wemis.in/api/hr/reports/new-hire?year=${filters.year}&month=${filters.month}`,
      columns: ['Name', 'Department', 'Designation', 'Joining Date']
    },
    summary: {
      title: 'Employee Summary',
      icon: <Users size={20} />,
      url: `https://api.wemis.in/api/hr/reports/employee-summary?employeeName=${filters.employeeName}`,
      columns: ['ID', 'Name', 'Department', 'Role', 'Status']
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Note: In a real app, ensure your API handles CORS
      const response = await fetch(reportConfigs[activeTab].url);
      const result = await response.json();
      setData(result || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]); // Fallback to empty for demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">W</div>
          WeMIS HR
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {Object.entries(reportConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {config.icon}
              <span className="font-medium">{config.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header & Filters */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{reportConfigs[activeTab].title}</h1>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">
              <Download size={18} /> Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            {(activeTab !== 'hiring' && activeTab !== 'summary') && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee ID</label>
                <input 
                  type="text" 
                  placeholder="EMP001"
                  className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.employeeId}
                  onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
                />
              </div>
            )}
            
            {activeTab === 'summary' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Name</label>
                <input 
                  type="text" 
                  placeholder="Search name..."
                  className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.employeeName}
                  onChange={(e) => setFilters({...filters, employeeName: e.target.value})}
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Year/Month</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                />
                <input 
                  type="number" 
                  className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.month}
                  onChange={(e) => setFilters({...filters, month: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button 
                onClick={fetchData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Search size={18} /> Generate Report
              </button>
            </div>
          </div>
        </header>

        {/* Data Table Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Fetching report data...</p>
              </div>
            ) : data.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {reportConfigs[activeTab].columns.map((col, idx) => (
                      <th key={idx} className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Map your actual API data here. Below is a generic row renderer */}
                  {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition">
                      {/* This is a placeholder for your dynamic keys */}
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-6 py-4 text-sm text-gray-700">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Filter size={48} className="mb-2 opacity-20" />
                <p>No data found for the selected criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;