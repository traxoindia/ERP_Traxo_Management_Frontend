import React, { useState } from 'react';
import { Search, ChevronDown, Download, Eye } from 'lucide-react';

const EmployeeAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = [
    { 
      id: 1, 
      name: 'John Smith', 
      department: 'Engineering', 
      designation: 'Senior Developer',
      totalPresent: 22,
      totalLate: 1,
      totalAbsent: 2,
      totalLeave: 3,
      attendance: [
        { date: '2026-03-01', status: 'present', checkIn: '09:00', checkOut: '18:00' },
        { date: '2026-03-02', status: 'present', checkIn: '08:55', checkOut: '18:05' },
        { date: '2026-03-03', status: 'late', checkIn: '09:30', checkOut: '18:30' },
        { date: '2026-03-04', status: 'absent', checkIn: '-', checkOut: '-' },
        { date: '2026-03-05', status: 'present', checkIn: '09:00', checkOut: '18:00' },
        { date: '2026-03-06', status: 'leave', checkIn: '-', checkOut: '-' },
      ]
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      department: 'Marketing', 
      designation: 'Marketing Manager',
      totalPresent: 20,
      totalLate: 0,
      totalAbsent: 1,
      totalLeave: 4,
      attendance: [
        { date: '2026-03-01', status: 'present', checkIn: '08:50', checkOut: '17:55' },
        { date: '2026-03-02', status: 'present', checkIn: '08:45', checkOut: '18:00' },
        { date: '2026-03-03', status: 'present', checkIn: '08:55', checkOut: '17:50' },
        { date: '2026-03-04', status: 'present', checkIn: '09:00', checkOut: '18:00' },
        { date: '2026-03-05', status: 'absent', checkIn: '-', checkOut: '-' },
        { date: '2026-03-06', status: 'leave', checkIn: '-', checkOut: '-' },
      ]
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      department: 'Engineering', 
      designation: 'Frontend Developer',
      totalPresent: 21,
      totalLate: 2,
      totalAbsent: 0,
      totalLeave: 2,
      attendance: [
        { date: '2026-03-01', status: 'present', checkIn: '09:05', checkOut: '18:10' },
        { date: '2026-03-02', status: 'late', checkIn: '09:20', checkOut: '18:15' },
        { date: '2026-03-03', status: 'present', checkIn: '08:58', checkOut: '18:02' },
        { date: '2026-03-04', status: 'present', checkIn: '09:02', checkOut: '18:00' },
        { date: '2026-03-05', status: 'present', checkIn: '08:55', checkOut: '17:58' },
        { date: '2026-03-06', status: 'leave', checkIn: '-', checkOut: '-' },
      ]
    },
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'hr', name: 'Human Resources' },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || 
                       emp.department.toLowerCase() === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'present':
        return <span className="text-xs px-2 py-1 bg-gray-900 text-white rounded">Present</span>;
      case 'late':
        return <span className="text-xs px-2 py-1 bg-gray-700 text-white rounded">Late</span>;
      case 'absent':
        return <span className="text-xs px-2 py-1 bg-gray-200 text-gray-900 rounded">Absent</span>;
      case 'leave':
        return <span className="text-xs px-2 py-1 border border-gray-900 rounded">Leave</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Employee Attendance</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="2026-03">March 2026</option>
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="p-6">
        <div className="grid gap-4">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Employee Header */}
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.designation} • {employee.department}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Present:</span>
                      <span className="ml-1 font-medium">{employee.totalPresent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Late:</span>
                      <span className="ml-1 font-medium">{employee.totalLate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Absent:</span>
                      <span className="ml-1 font-medium">{employee.totalAbsent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Leave:</span>
                      <span className="ml-1 font-medium">{employee.totalLeave}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEmployee(selectedEmployee === employee.id ? null : employee.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronDown size={16} className={`transform transition-transform ${selectedEmployee === employee.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Attendance Details */}
              {selectedEmployee === employee.id && (
                <div className="p-4 border-t border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-200">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left">Check In</th>
                        <th className="text-left">Check Out</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.attendance.map((record, idx) => {
                        const hours = record.checkIn !== '-' && record.checkOut !== '-'
                          ? `${parseInt(record.checkOut.split(':')[0]) - parseInt(record.checkIn.split(':')[0])}h`
                          : '-';
                        
                        return (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            <td className="py-2">{record.date}</td>
                            <td>{record.checkIn}</td>
                            <td>{record.checkOut}</td>
                            <td>{getStatusBadge(record.status)}</td>
                            <td>{hours}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;