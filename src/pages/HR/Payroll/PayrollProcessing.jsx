import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  Filter,
  Clock,
  ChevronRight,
  FileText
} from 'lucide-react';

const PayrollProcessing = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [processingStep, setProcessingStep] = useState('review'); // review, processing, completed
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const employees = [
    {
      id: 1,
      name: 'John Smith',
      empId: 'EMP001',
      dept: 'Engineering',
      basic: 50000,
      present: 22,
      absent: 2,
      leave: 3,
      overtime: 15,
      earnings: 97750,
      deductions: 13700,
      netPay: 84050,
      bankAccount: 'XXXX1234',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      empId: 'EMP002',
      dept: 'Marketing',
      basic: 45000,
      present: 23,
      absent: 1,
      leave: 2,
      overtime: 0,
      earnings: 85250,
      deductions: 12500,
      netPay: 72750,
      bankAccount: 'XXXX5678',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Michael Chen',
      empId: 'EMP003',
      dept: 'Engineering',
      basic: 40000,
      present: 21,
      absent: 1,
      leave: 4,
      overtime: 10,
      earnings: 76500,
      deductions: 11200,
      netPay: 65300,
      bankAccount: 'XXXX9012',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Emily Brown',
      empId: 'EMP004',
      dept: 'Sales',
      basic: 55000,
      present: 24,
      absent: 0,
      leave: 1,
      overtime: 5,
      earnings: 105000,
      deductions: 15800,
      netPay: 89200,
      bankAccount: 'XXXX3456',
      status: 'pending'
    },
    {
      id: 5,
      name: 'David Wilson',
      empId: 'EMP005',
      dept: 'Finance',
      basic: 48000,
      present: 22,
      absent: 2,
      leave: 2,
      overtime: 8,
      earnings: 91200,
      deductions: 13100,
      netPay: 78100,
      bankAccount: 'XXXX7890',
      status: 'pending'
    },
  ];

  const summary = {
    totalEmployees: employees.length,
    selectedCount: selectedEmployees.length,
    totalPayroll: employees.reduce((sum, emp) => sum + emp.netPay, 0),
    selectedPayroll: selectedEmployees.reduce((sum, id) => {
      const emp = employees.find(e => e.id === id);
      return sum + (emp ? emp.netPay : 0);
    }, 0)
  };

  const handleProcessPayroll = () => {
    setProcessingStep('processing');
    // Simulate processing
    setTimeout(() => {
      setProcessingStep('completed');
    }, 2000);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const handleSelectEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(eId => eId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={16} className="text-gray-700" />;
      case 'processing':
        return <Clock size={16} className="text-gray-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Process Payroll</h1>
            <p className="text-sm text-gray-500 mt-1">Review and process monthly payroll</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            >
              <option value="2026-03">March 2026</option>
              <option value="2026-02">February 2026</option>
              <option value="2026-01">January 2026</option>
            </select>
            {processingStep === 'review' && (
              <button
                onClick={handleProcessPayroll}
                disabled={selectedEmployees.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  selectedEmployees.length > 0
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Play size={14} />
                <span>Process Selected ({selectedEmployees.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`flex items-center gap-2 ${processingStep === 'review' ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
              processingStep === 'review' ? 'border-gray-900' : 'border-gray-200'
            }`}>1</div>
            <span className="text-sm font-medium">Review</span>
          </div>
          <ChevronRight size={16} className="mx-2 text-gray-300" />
          <div className={`flex items-center gap-2 ${processingStep === 'processing' ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
              processingStep === 'processing' ? 'border-gray-900' : 'border-gray-200'
            }`}>2</div>
            <span className="text-sm font-medium">Processing</span>
          </div>
          <ChevronRight size={16} className="mx-2 text-gray-300" />
          <div className={`flex items-center gap-2 ${processingStep === 'completed' ? 'text-gray-900' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
              processingStep === 'completed' ? 'border-gray-900' : 'border-gray-200'
            }`}>3</div>
            <span className="text-sm font-medium">Completed</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Employees</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">{summary.totalEmployees}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Selected</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">{summary.selectedCount}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Payroll</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">₹{summary.totalPayroll.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Selected Payroll</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">₹{summary.selectedPayroll.toLocaleString()}</p>
        </div>
      </div>

      {/* Processing View */}
      {processingStep === 'processing' && (
        <div className="px-6 mb-4">
          <div className="border border-gray-200 rounded-lg p-8 text-center">
            <Clock size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payroll</h3>
            <p className="text-sm text-gray-500 mb-4">Please wait while we process the payroll for selected employees</p>
            <div className="w-64 h-2 bg-gray-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gray-900 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-gray-400 mt-3">Processing 3 of 5 employees...</p>
          </div>
        </div>
      )}

      {processingStep === 'completed' && (
        <div className="px-6 mb-4">
          <div className="border border-gray-200 rounded-lg p-8 text-center">
            <CheckCircle size={40} className="mx-auto text-gray-700 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payroll Processed Successfully</h3>
            <p className="text-sm text-gray-500 mb-4">Payroll has been processed for {selectedEmployees.length} employees</p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
                <Download size={14} />
                <span>Download Report</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                <FileText size={14} />
                <span>View Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      {processingStep === 'review' && (
        <div className="px-6">
          <div className="border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === employees.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </label>
                <span className="text-sm text-gray-500">{selectedEmployees.length} selected</span>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                <Filter size={14} />
                <span>Filter</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-8 px-4 py-3"></th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Department</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Basic</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Present</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Overtime</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Earnings</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Deductions</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Net Pay</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(emp.id)}
                          onChange={() => handleSelectEmployee(emp.id)}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{emp.empId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{emp.dept}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{emp.basic.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{emp.present}</td>
                      <td className="px-4 py-3 text-right">{emp.overtime}h</td>
                      <td className="px-4 py-3 text-right">₹{emp.earnings.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">₹{emp.deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{emp.netPay.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          {getStatusIcon(emp.status)}
                          <span className="capitalize">{emp.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye size={14} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollProcessing;