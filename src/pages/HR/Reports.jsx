import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart3, Users, CalendarCheck, Wallet, UserPlus, 
  Search, Download, Filter, RefreshCcw, ChevronRight, FileText,
  Clock, Calendar as CalendarIcon, AlertCircle, CheckCircle,
  XCircle, Printer, Eye, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Make sure to initialize autoTable properly
// If the above import doesn't work, use this instead:
// import autoTable from 'jspdf-autotable';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [filters, setFilters] = useState({
    employeeId: '',
    employeeName: '',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    day: new Date().getDate().toString().padStart(2, '0')
  });

  // Add API log
  const addApiLog = (url, method, status, response, requestData = null) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      url,
      method,
      status,
      response: response ? (typeof response === 'object' ? JSON.stringify(response, null, 2) : response) : null,
      success: status >= 200 && status < 300
    };
    setApiLogs(prev => [log, ...prev].slice(0, 50));
    console.log(`[API ${method}] ${url} - Status: ${status}`, response);
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTime = (isoString) => {
    if (!isoString || isoString === "null") return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) { return '--:--'; }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '--';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return '--'; }
  };

  // Fetch Employee Names
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const token = localStorage.getItem('accessToken');
      const url = 'https://api.wemis.in/api/hr/employees/names';
      
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        addApiLog(url, 'GET', response.status, result);
        
        if (response.ok) {
          setEmployeeList(Array.isArray(result) ? result : []);
          showNotification('Employee list loaded successfully', 'success');
        }
      } catch (error) {
        console.error("Error fetching employee names:", error);
        addApiLog(url, 'GET', 500, { error: error.message });
      }
    };

    fetchEmployeeNames();
  }, []);

  const reportConfigs = {
    attendance: {
      title: 'HR ATTENDANCE REPORT',
      subtitle: 'Employee Attendance Tracking',
      icon: <CalendarCheck size={18} />,
      requiresEmployee: true,
      getUrl: () => {
        const baseUrl = `https://api.wemis.in/api/hr/reports/attendance/${filters.employeeId}`;
        const params = new URLSearchParams();
        if (filters.year) params.append('year', filters.year);
        if (filters.month) params.append('month', filters.month);
        if (filters.day && filters.day !== '') params.append('day', filters.day);
        return params.toString() ? `${baseUrl}?${params}` : baseUrl;
      },
      columns: ['DATE', 'EMP ID', 'EMPLOYEE NAME', 'STATUS', 'CHECK-IN', 'CHECK-OUT', 'WORK HOURS']
    },
    payroll: {
      title: 'PAYROLL REPORT',
      subtitle: 'Salary & Compensation Details',
      icon: <Wallet size={18} />,
      requiresEmployee: true,
      getUrl: () => {
        const baseUrl = `https://api.wemis.in/api/hr/reports/payroll/${filters.employeeId}`;
        const params = new URLSearchParams();
        if (filters.year) params.append('year', filters.year);
        if (filters.month) params.append('month', filters.month);
        return params.toString() ? `${baseUrl}?${params}` : baseUrl;
      },
      columns: ['EMP ID', 'EMPLOYEE NAME', 'BASE SALARY', 'ALLOWANCES', 'DEDUCTIONS', 'NET PAY', 'MONTH']
    },
    leave: {
      title: 'LEAVE REPORT',
      subtitle: 'Leave Balance & History',
      icon: <BarChart3 size={18} />,
      requiresEmployee: true,
      getUrl: () => {
        const baseUrl = `https://api.wemis.in/api/hr/reports/leave/${filters.employeeId}`;
        const params = new URLSearchParams();
        if (filters.year) params.append('year', filters.year);
        if (filters.month) params.append('month', filters.month);
        return params.toString() ? `${baseUrl}?${params}` : baseUrl;
      },
      columns: ['LEAVE TYPE', 'START DATE', 'END DATE', 'DAYS', 'STATUS', 'REASON']
    },
    hiring: {
      title: 'NEW HIRE REPORT',
      subtitle: 'Recent Joinings',
      icon: <UserPlus size={18} />,
      requiresEmployee: false,
      getUrl: () => {
        const url = 'https://api.wemis.in/api/hr/reports/new-hire';
        const params = new URLSearchParams();
        if (filters.year) params.append('year', filters.year);
        if (filters.month) params.append('month', filters.month);
        return params.toString() ? `${url}?${params}` : url;
      },
      columns: ['EMP ID', 'NAME', 'DEPARTMENT', 'DESIGNATION', 'JOINING DATE', 'STATUS']
    },
    summary: {
      title: 'EMPLOYEE SUMMARY',
      subtitle: 'Complete Staff Directory',
      icon: <Users size={18} />,
      requiresEmployee: false,
      getUrl: () => {
        const url = 'https://api.wemis.in/api/hr/reports/employee-summary';
        const params = new URLSearchParams();
        if (filters.employeeName) params.append('employeeName', filters.employeeName);
        return params.toString() ? `${url}?${params}` : url;
      },
      columns: ['EMP ID', 'NAME', 'DEPARTMENT', 'DESIGNATION', 'EMAIL', 'PHONE', 'STATUS']
    }
  };

  // Fetch Report Data
  const fetchReportData = useCallback(async () => {
    const config = reportConfigs[activeTab];
    
    if (config.requiresEmployee && !filters.employeeId) {
      setData([]);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const url = config.getUrl();
    
    console.log(`\n========== FETCHING ${config.title} ==========`);
    console.log(`URL: ${url}`);
    console.log(`Filters:`, filters);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log(`Response Status: ${response.status}`);
      console.log(`Data:`, result);
      
      addApiLog(url, 'GET', response.status, result);
      
      if (response.ok) {
        const reportData = Array.isArray(result) ? result : (result.data || []);
        setData(reportData);
        setCurrentPage(1);
        showNotification(`${config.title} loaded: ${reportData.length} records`, 'success');
      } else {
        setData([]);
        showNotification(result.message || 'Failed to load data', 'error');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      addApiLog(url, 'GET', 500, { error: error.message });
      setData([]);
      showNotification(`Network error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReportData();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, filters.employeeId, filters.employeeName, filters.year, filters.month, filters.day, fetchReportData]);

  // Filter and paginate data
  const filteredData = useMemo(() => {
    if (activeTab !== 'attendance') return data;
    if (!data || data.length === 0) return [];
    
    return data.filter(item => {
      if (!item.date) return true;
      const [itemYear, itemMonth] = item.date.split('-');
      const matchYear = itemYear === filters.year;
      const matchMonth = !filters.month || parseInt(itemMonth, 10) === parseInt(filters.month, 10);
      return matchYear && matchMonth;
    });
  }, [data, activeTab, filters.year, filters.month]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fixed PDF Export Function
  const handleExportPDF = () => {
    const config = reportConfigs[activeTab];
    
    // Check if there's data to export
    if (currentItems.length === 0) {
      showNotification('No data to export', 'info');
      return;
    }
    
    // Create new PDF document (landscape for more columns)
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 15;

    // Header Background
    doc.setFillColor(25, 55, 110); // Dark blue
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TRAXO TECHNOLOGIES", pageWidth / 2, 20, { align: "center" });
    
    // Report Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(config.title, pageWidth / 2, 32, { align: "center" });
    
    // Report Metadata
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    const dateStr = new Date().toLocaleDateString('en-IN');
    doc.text(`Generated on: ${dateStr}`, pageWidth - margin, 12, { align: "right" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    currentY = 55;
    
    // Filter Information
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 25, 'F');
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Report Parameters:", margin + 5, currentY + 7);
    doc.setFont("helvetica", "normal");
    
    let filterText = "";
    if (config.requiresEmployee && filters.employeeId) {
      const emp = employeeList.find(e => e.employeeId === filters.employeeId);
      filterText += `Employee: ${emp?.fullName || filters.employeeId} | `;
    }
    if (filters.year) filterText += `Year: ${filters.year} | `;
    if (filters.month) filterText += `Month: ${new Date(2000, parseInt(filters.month)-1, 1).toLocaleString('default', { month: 'long' })} | `;
    if (filters.day && activeTab === 'attendance') filterText += `Day: ${filters.day}`;
    
    doc.text(filterText || "All Records", margin + 5, currentY + 15);
    currentY += 35;
    
    // Prepare table data
    const body = currentItems.map(row => {
      if (activeTab === 'attendance') {
        const emp = employeeList.find(e => e.employeeId === row.employeeId);
        return [
          row.date || '--',
          row.employeeId || '--',
          emp?.fullName?.split(' ')[0] || '--',
          row.status || '--',
          formatTime(row.checkIn),
          formatTime(row.checkOut),
          `${row.workingHours || 0}h`
        ];
      }
      return Object.values(row).map(v => v?.toString() || '-');
    });
    
    // Add table using autoTable
    doc.autoTable({
      startY: currentY,
      head: [config.columns],
      body: body,
      headStyles: { 
        fillColor: [25, 55, 110], 
        textColor: [255, 255, 255], 
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { 
        fontSize: 8, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        valign: 'middle'
      },
      alternateRowStyles: { fillColor: [248, 248, 250] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' }
      }
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page 1 of 1 | Total Records: ${filteredData.length}`, pageWidth / 2, finalY, { align: "center" });
    doc.text("This is a system generated document", pageWidth / 2, finalY + 5, { align: "center" });
    
    // Save the PDF
    doc.save(`Traxo_${activeTab}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('PDF exported successfully!', 'success');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredData.length) {
      showNotification('No data to export', 'info');
      return;
    }
    
    const config = reportConfigs[activeTab];
    const headers = config.columns;
    const csvRows = [headers.join(',')];
    
    for (const row of currentItems) {
      let values;
      if (activeTab === 'attendance') {
        const emp = employeeList.find(e => e.employeeId === row.employeeId);
        values = [
          row.date,
          row.employeeId,
          emp?.fullName,
          row.status,
          formatTime(row.checkIn),
          formatTime(row.checkOut),
          `${row.workingHours}h`
        ];
      } else {
        values = Object.values(row).map(v => String(v || ''));
      }
      csvRows.push(values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Traxo_${activeTab}_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('CSV exported successfully!', 'success');
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PRESENT': return 'bg-emerald-100 text-emerald-700';
      case 'ABSENT': return 'bg-red-100 text-red-700';
      case 'HALF_DAY': return 'bg-amber-100 text-amber-700';
      case 'LATE': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.type === 'success' && <CheckCircle size={18} />}
          {notification.type === 'error' && <XCircle size={18} />}
          {notification.type === 'info' && <AlertCircle size={18} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
              T
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Traxo Admin</h2>
              <p className="text-xs text-slate-400">HR Management Suite</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {Object.entries(reportConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setData([]); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {config.icon}
                <div className="text-left">
                  <div className="text-sm font-semibold">{config.title}</div>
                  <div className="text-xs opacity-75">{config.subtitle}</div>
                </div>
              </div>
              {activeTab === key && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-xs"
          >
            <AlertCircle size={14} />
            {showLogs ? 'Hide API Logs' : 'Show API Logs'} ({apiLogs.length})
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{reportConfigs[activeTab].title}</h1>
              <p className="text-slate-500 text-sm mt-1">{reportConfigs[activeTab].subtitle}</p>
            </div>
            <div className="flex gap-3">
              {filteredData.length > 0 && (
                <>
                  <button onClick={handleExportPDF} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition">
                    <FileText size={16} /> PDF
                  </button>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition">
                    <Download size={16} /> CSV
                  </button>
                </>
              )}
              <button onClick={fetchReportData} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(activeTab === 'attendance' || activeTab === 'payroll' || activeTab === 'leave') && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Users size={12} /> Employee *
                  </label>
                  <select 
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                    value={filters.employeeId}
                    onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
                  >
                    <option value="">Select Employee</option>
                    {employeeList.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.fullName} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {activeTab === 'summary' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Search size={12} /> Employee Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Search by name..."
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={filters.employeeName}
                    onChange={(e) => setFilters({...filters, employeeName: e.target.value})}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Year</label>
                <select className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm" value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
                  {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Month</label>
                <select className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm" value={filters.month} onChange={(e) => setFilters({...filters, month: e.target.value})}>
                  <option value="">All Months</option>
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={(i+1).toString().padStart(2, '0')}>
                      {new Date(0, i).toLocaleString('en', {month: 'long'})}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'attendance' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Day (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="DD"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={filters.day}
                    onChange={(e) => setFilters({...filters, day: e.target.value})}
                    min="1"
                    max="31"
                  />
                </div>
              )}
              
              <div className="flex items-end">
                <button onClick={fetchReportData} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition">
                  <Search size={16} /> Generate Report
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-auto p-8 pt-6">
          {/* API Logs Panel */}
          {showLogs && (
            <div className="mb-6 bg-slate-900 rounded-xl overflow-hidden shadow-xl">
              <div className="flex justify-between items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
                <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                  <AlertCircle size={14} /> API Call Logs
                </h3>
                <button onClick={() => setApiLogs([])} className="text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded">
                  Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto text-xs">
                {apiLogs.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No API calls yet</div>
                ) : (
                  apiLogs.map(log => (
                    <div key={log.id} className={`p-3 border-b border-slate-800 font-mono ${log.success ? 'bg-slate-900' : 'bg-red-900/20'}`}>
                      <div className="flex items-start gap-2">
                        <div className={log.success ? 'text-green-400' : 'text-red-400'}>
                          {log.success ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-blue-400 font-semibold">{log.method}</span>
                            <span className="text-gray-500">{log.timestamp}</span>
                          </div>
                          <div className="text-gray-400 break-all mb-1">{log.url}</div>
                          <div className="text-gray-500">Status: <span className={log.success ? 'text-green-400' : 'text-red-400'}>{log.status}</span></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading report data...</p>
              </div>
            ) : currentItems.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-gray-200">
                      <tr>
                        {reportConfigs[activeTab].columns.map((col, i) => (
                          <th key={i} className="px-4 py-4 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentItems.map((row, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors duration-150">
                          {activeTab === 'attendance' ? (
                            <>
                              <td className="px-4 py-3 text-sm font-medium text-gray-700">{row.date}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{row.employeeId}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {employeeList.find(e => e.employeeId === row.employeeId)?.fullName || '--'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(row.status)}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{formatTime(row.checkIn)}</td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{formatTime(row.checkOut)}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-600">{row.workingHours || 0}h</td>
                            </>
                          ) : (
                            Object.values(row).map((val, i) => (
                              <td key={i} className="px-4 py-3 text-sm text-gray-700">
                                {val?.toString() || '-'}
                              </td>
                            ))
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                      >
                        <ChevronRightIcon size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                <Filter size={64} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">
                  {reportConfigs[activeTab].requiresEmployee && !filters.employeeId 
                    ? 'Please select an employee to view the report' 
                    : 'No records found matching your criteria'}
                </p>
                <p className="text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
          
          {/* Summary Stats */}
          {filteredData.length > 0 && !loading && (
            <div className="mt-4 flex justify-between items-center px-4 py-2 bg-indigo-50 rounded-lg">
              <span className="text-sm text-indigo-800 font-medium">
                Total Records: {filteredData.length}
              </span>
              {activeTab === 'attendance' && (
                <span className="text-sm text-indigo-800 font-medium">
                  Present: {filteredData.filter(d => d.status === 'PRESENT').length} | 
                  Absent: {filteredData.filter(d => d.status === 'ABSENT').length} |
                  Half Day: {filteredData.filter(d => d.status === 'HALF_DAY').length}
                </span>
              )}
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Reports;