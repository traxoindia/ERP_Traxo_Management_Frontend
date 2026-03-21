import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart2, Users, Clock, AlertCircle } from 'lucide-react';

const AttendanceReports = () => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  const reportTypes = [
    { id: 'summary', label: 'Summary Report', icon: BarChart2 },
    { id: 'detailed', label: 'Detailed Report', icon: Users },
    { id: 'late', label: 'Late Arrivals', icon: Clock },
    { id: 'absent', label: 'Absenteeism', icon: AlertCircle },
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'hr', name: 'Human Resources' },
  ];

  const summaryData = {
    totalEmployees: 45,
    totalPresent: 38,
    totalAbsent: 4,
    totalLate: 3,
    totalLeave: 5,
    averageWorkingHours: '8.2',
    overtimeHours: 24,
  };

  const departmentStats = [
    { department: 'Engineering', present: 12, absent: 1, late: 2, leave: 1, total: 15 },
    { department: 'Marketing', present: 8, absent: 1, late: 0, leave: 1, total: 10 },
    { department: 'Sales', present: 10, absent: 1, late: 1, leave: 2, total: 12 },
    { department: 'HR', present: 5, absent: 1, late: 0, leave: 1, total: 6 },
    { department: 'Finance', present: 3, absent: 0, late: 0, leave: 0, total: 2 },
  ];

  const detailedReports = [
    { date: '2026-03-01', present: 40, absent: 3, late: 2, leave: 2 },
    { date: '2026-03-02', present: 41, absent: 2, late: 1, leave: 2 },
    { date: '2026-03-03', present: 39, absent: 4, late: 3, leave: 2 },
    { date: '2026-03-04', present: 42, absent: 2, late: 1, leave: 1 },
    { date: '2026-03-05', present: 41, absent: 2, late: 2, leave: 2 },
    { date: '2026-03-06', present: 38, absent: 4, late: 1, leave: 3 },
  ];

  const lateArrivals = [
    { name: 'John Smith', department: 'Engineering', date: '2026-03-03', checkIn: '09:30', lateBy: 30 },
    { name: 'Michael Chen', department: 'Engineering', date: '2026-03-02', checkIn: '09:20', lateBy: 20 },
    { name: 'Emma Davis', department: 'Sales', date: '2026-03-03', checkIn: '09:45', lateBy: 45 },
    { name: 'Robert Wilson', department: 'Marketing', date: '2026-03-05', checkIn: '09:15', lateBy: 15 },
  ];

  const handleExport = () => {
    console.log('Exporting report...');
    // CSV export logic here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Attendance Reports</h1>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex gap-2 py-2">
          {reportTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                  reportType === type.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

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

          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter size={14} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6">
        {/* Summary Report */}
        {reportType === 'summary' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">Total Employees</div>
                <div className="text-2xl font-medium text-gray-900 mt-1">{summaryData.totalEmployees}</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">Present Today</div>
                <div className="text-2xl font-medium text-gray-900 mt-1">{summaryData.totalPresent}</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(summaryData.totalPresent/summaryData.totalEmployees*100)}% attendance</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">Average Hours</div>
                <div className="text-2xl font-medium text-gray-900 mt-1">{summaryData.averageWorkingHours}h</div>
                <div className="text-xs text-gray-500 mt-1">per day</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">Overtime</div>
                <div className="text-2xl font-medium text-gray-900 mt-1">{summaryData.overtimeHours}h</div>
                <div className="text-xs text-gray-500 mt-1">total this month</div>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Department-wise Attendance</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-200">
                      <th className="text-left py-2">Department</th>
                      <th className="text-left">Present</th>
                      <th className="text-left">Absent</th>
                      <th className="text-left">Late</th>
                      <th className="text-left">Leave</th>
                      <th className="text-left">Total</th>
                      <th className="text-left">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map((dept, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium">{dept.department}</td>
                        <td>{dept.present}</td>
                        <td>{dept.absent}</td>
                        <td>{dept.late}</td>
                        <td>{dept.leave}</td>
                        <td>{dept.total}</td>
                        <td>{Math.round(dept.present/dept.total*100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Report */}
        {reportType === 'detailed' && (
          <div className="border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Daily Attendance Details</h3>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left">Present</th>
                    <th className="text-left">Absent</th>
                    <th className="text-left">Late</th>
                    <th className="text-left">On Leave</th>
                    <th className="text-left">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedReports.map((day, idx) => {
                    const total = day.present + day.absent + day.late + day.leave;
                    const percentage = Math.round(day.present/total*100);
                    return (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-3">{day.date}</td>
                        <td>{day.present}</td>
                        <td>{day.absent}</td>
                        <td>{day.late}</td>
                        <td>{day.leave}</td>
                        <td>
                          <span className={`px-2 py-1 text-xs rounded ${
                            percentage > 90 ? 'bg-gray-900 text-white' :
                            percentage > 80 ? 'bg-gray-700 text-white' :
                            'bg-gray-200 text-gray-900'
                          }`}>
                            {percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Late Arrivals Report */}
        {reportType === 'late' && (
          <div className="border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Late Arrivals</h3>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="text-left py-2">Employee</th>
                    <th className="text-left">Department</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Check In</th>
                    <th className="text-left">Late By</th>
                  </tr>
                </thead>
                <tbody>
                  {lateArrivals.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td>{item.department}</td>
                      <td>{item.date}</td>
                      <td>{item.checkIn}</td>
                      <td>
                        <span className="text-orange-600">{item.lateBy} min</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Absenteeism Report */}
        {reportType === 'absent' && (
          <div className="border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Absenteeism Analysis</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Total Absences</div>
                  <div className="text-xl font-medium text-gray-900">18</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Avg. per Day</div>
                  <div className="text-xl font-medium text-gray-900">3.2</div>
                </div>
              </div>
              
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="text-left py-2">Employee</th>
                    <th className="text-left">Department</th>
                    <th className="text-left">Absent Days</th>
                    <th className="text-left">Last Absence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">John Smith</td>
                    <td>Engineering</td>
                    <td>2</td>
                    <td>2026-03-04</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">Sarah Johnson</td>
                    <td>Marketing</td>
                    <td>1</td>
                    <td>2026-03-05</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-medium">Emma Davis</td>
                    <td>Sales</td>
                    <td>3</td>
                    <td>2026-03-06</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;