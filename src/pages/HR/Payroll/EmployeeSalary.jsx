import React, { useState } from 'react';
import { Search, Download, Eye, Filter, Calendar, ChevronDown, FileText } from 'lucide-react';

const EmployeeSalary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const employees = [
    {
      id: 1,
      name: 'John Smith',
      empId: 'EMP001',
      department: 'Engineering',
      designation: 'Senior Developer',
      joiningDate: '2023-01-15',
      bankName: 'HDFC Bank',
      accountNo: 'XXXX1234',
      ifsc: 'HDFC0001234',
      pan: 'ABCDE1234F',
      monthlySalary: 84050,
      ytdEarnings: 252150,
      ytdDeductions: 41100,
      ytdNet: 211050,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      empId: 'EMP002',
      department: 'Marketing',
      designation: 'Marketing Manager',
      joiningDate: '2023-03-10',
      bankName: 'ICICI Bank',
      accountNo: 'XXXX5678',
      ifsc: 'ICIC0005678',
      pan: 'FGHIJ5678K',
      monthlySalary: 72750,
      ytdEarnings: 218250,
      ytdDeductions: 37500,
      ytdNet: 180750,
    },
    {
      id: 3,
      name: 'Michael Chen',
      empId: 'EMP003',
      department: 'Engineering',
      designation: 'Frontend Developer',
      joiningDate: '2023-06-20',
      bankName: 'SBI Bank',
      accountNo: 'XXXX9012',
      ifsc: 'SBIN0009012',
      pan: 'KLMNO9012P',
      monthlySalary: 65300,
      ytdEarnings: 195900,
      ytdDeductions: 33600,
      ytdNet: 162300,
    },
    {
      id: 4,
      name: 'Emily Brown',
      empId: 'EMP004',
      department: 'Sales',
      designation: 'Sales Manager',
      joiningDate: '2022-11-05',
      bankName: 'Axis Bank',
      accountNo: 'XXXX3456',
      ifsc: 'UTIB0003456',
      pan: 'QRSTU3456V',
      monthlySalary: 89200,
      ytdEarnings: 267600,
      ytdDeductions: 47400,
      ytdNet: 220200,
    },
    {
      id: 5,
      name: 'David Wilson',
      empId: 'EMP005',
      department: 'Finance',
      designation: 'Accountant',
      joiningDate: '2023-08-12',
      bankName: 'HDFC Bank',
      accountNo: 'XXXX7890',
      ifsc: 'HDFC0007890',
      pan: 'WXYZA7890B',
      monthlySalary: 78100,
      ytdEarnings: 156200,
      ytdDeductions: 26200,
      ytdNet: 130000,
    },
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'finance', name: 'Finance' },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || 
                       emp.department.toLowerCase() === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Employee Salaries</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage employee salary details</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Download size={14} />
            <span>Export List</span>
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
              placeholder="Search by name, ID, or designation..."
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
        <div className="border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Employee</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Bank Details</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Monthly Salary</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">YTD Earnings</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">YTD Deductions</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">YTD Net</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{emp.empId} • {emp.designation}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{emp.department}</p>
                      <p className="text-xs text-gray-500 mt-1">Joined: {emp.joiningDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{emp.bankName}</p>
                      <p className="text-xs text-gray-500 mt-1">A/C: {emp.accountNo} | IFSC: {emp.ifsc}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">₹{emp.monthlySalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">₹{emp.ytdEarnings.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">₹{emp.ytdDeductions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">₹{emp.ytdNet.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setSelectedEmployee(selectedEmployee === emp.id ? null : emp.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Eye size={14} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              {(() => {
                const emp = employees.find(e => e.id === selectedEmployee);
                return (
                  <>
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Employee Details</h2>
                        <p className="text-sm text-gray-500 mt-1">{emp.name} • {emp.empId}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedEmployee(null)}
                        className="p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div className="p-6">
                      {/* Personal Info */}
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Name:</span>
                            <span className="ml-2 text-gray-900">{emp.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Employee ID:</span>
                            <span className="ml-2 text-gray-900">{emp.empId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Department:</span>
                            <span className="ml-2 text-gray-900">{emp.department}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Designation:</span>
                            <span className="ml-2 text-gray-900">{emp.designation}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Joining Date:</span>
                            <span className="ml-2 text-gray-900">{emp.joiningDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">PAN:</span>
                            <span className="ml-2 text-gray-900">{emp.pan}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Bank Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Bank Name:</span>
                            <span className="ml-2 text-gray-900">{emp.bankName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Account No:</span>
                            <span className="ml-2 text-gray-900">{emp.accountNo}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">IFSC Code:</span>
                            <span className="ml-2 text-gray-900">{emp.ifsc}</span>
                          </div>
                        </div>
                      </div>

                      {/* Salary Summary */}
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Salary Summary</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Monthly Salary</p>
                            <p className="text-lg font-medium text-gray-900 mt-1">₹{emp.monthlySalary.toLocaleString()}</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">YTD Earnings</p>
                            <p className="text-lg font-medium text-gray-900 mt-1">₹{emp.ytdEarnings.toLocaleString()}</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500">YTD Net</p>
                            <p className="text-lg font-medium text-gray-900 mt-1">₹{emp.ytdNet.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSalary;