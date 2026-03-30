import React, { useState, useEffect } from 'react';
import BackNavbar from '../Career/BackNavbar';

const AttendanceStatusTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to convert US/UTC time string to IST
  const formatToIST = (timeStr) => {
    if (!timeStr) return "—";
    
    try {
      const dateObj = timeStr.includes('T') ? new Date(timeStr) : new Date(`1970-01-01T${timeStr}Z`);
      return new Intl.DateTimeFormat('en-IN', {
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata',
      }).format(dateObj);
    } catch (e) {
      return timeStr;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch("https://api.wemis.in/api/attendance/hr/all-status", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        const attendanceArray = Array.isArray(result) ? result : [];
        setData(attendanceArray);
        setFilteredData(attendanceArray);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    const filtered = data.filter(emp => 
      emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading attendance data...</p>
      </div>
    </div>
  );

  return (
    <>
        <BackNavbar/>

    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-light text-black tracking-tight">Attendance Monitoring</h1>
          <p className="text-gray-500 mt-1 text-sm">Employee check-in and check-out records</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search by name, employee ID, or department..."
              className="w-full md:w-96 px-4 py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((emp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-black">{emp.fullName || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{emp.employeeId || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {emp.department || <span className="text-gray-400">—</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-700">{formatToIST(emp.checkInTime)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-700">{formatToIST(emp.checkOutTime)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 text-xs font-medium ${
                      emp.status === 'PRESENT' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {emp.status || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500 text-sm">No matching records found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Footer with count */}
        <div className="mt-4 text-right">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length} of {data.length} employees
          </p>
        </div>
      </div>
    </div>
       </>
  );
};

export default AttendanceStatusTable;