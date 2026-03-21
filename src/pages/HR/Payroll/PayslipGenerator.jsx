import React, { useState } from 'react';
import { Download, Search, Calendar, FileText, Printer, Mail, ChevronDown } from 'lucide-react';

const PayslipGenerator = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    { id: 1, name: 'John Smith', empId: 'EMP001', department: 'Engineering' },
    { id: 2, name: 'Sarah Johnson', empId: 'EMP002', department: 'Marketing' },
    { id: 3, name: 'Michael Chen', empId: 'EMP003', department: 'Engineering' },
    { id: 4, name: 'Emily Brown', empId: 'EMP004', department: 'Sales' },
    { id: 5, name: 'David Wilson', empId: 'EMP005', department: 'Finance' },
  ];

  const payslipData = {
    company: {
      name: 'Traxo India Pvt Ltd',
      address: '123 Business Park, Mumbai - 400001',
      pan: 'AAACT1234F',
      tan: 'MUMT12345E',
      cin: 'U12345MH2020PTC123456'
    },
    employee: {
      name: 'John Smith',
      empId: 'EMP001',
      department: 'Engineering',
      designation: 'Senior Developer',
      pan: 'ABCDE1234F',
      bankName: 'HDFC Bank',
      bankAccount: 'XXXXXX1234',
      uan: '123456789012',
      doj: '2023-01-15'
    },
    month: 'March 2026',
    earnings: [
      { name: 'Basic Salary', amount: 50000 },
      { name: 'House Rent Allowance', amount: 25000 },
      { name: 'Conveyance Allowance', amount: 2000 },
      { name: 'Medical Allowance', amount: 1250 },
      { name: 'Special Allowance', amount: 10000 },
      { name: 'Bonus', amount: 5000 },
      { name: 'Overtime Pay', amount: 3000 },
      { name: 'Reimbursement', amount: 1500 }
    ],
    deductions: [
      { name: 'Provident Fund', amount: 6000 },
      { name: 'Professional Tax', amount: 200 },
      { name: 'TDS', amount: 6000 },
      { name: 'Insurance Premium', amount: 1500 }
    ],
    attendance: {
      present: 22,
      absent: 2,
      leave: 3,
      workingDays: 27,
      overtime: 15
    }
  };

  const totalEarnings = payslipData.earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = payslipData.deductions.reduce((sum, item) => sum + item.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    console.log('Sending email...');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Payslip Generator</h1>
            <p className="text-sm text-gray-500 mt-1">Generate and download employee payslips</p>
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
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-4">
        {/* Employee Selection */}
        <div className="col-span-1 border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Select Employee</h3>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <div className="p-2 max-h-[500px] overflow-y-auto">
            {employees.map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmployee(emp.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  selectedEmployee === emp.id
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-sm">{emp.name}</p>
                <p className={`text-xs mt-1 ${
                  selectedEmployee === emp.id ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {emp.empId} • {emp.department}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Payslip Preview */}
        <div className="col-span-2 border border-gray-200 rounded-lg">
          {selectedEmployee ? (
            <>
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Payslip Preview - March 2026</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrint}
                    className="p-2 hover:bg-gray-50 rounded-lg"
                    title="Print"
                  >
                    <Printer size={16} className="text-gray-500" />
                  </button>
                  <button 
                    onClick={handleEmail}
                    className="p-2 hover:bg-gray-50 rounded-lg"
                    title="Email"
                  >
                    <Mail size={16} className="text-gray-500" />
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Payslip Content */}
              <div className="p-6 bg-gray-50">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{payslipData.company.name}</h2>
                    <p className="text-xs text-gray-500 mt-1">{payslipData.company.address}</p>
                    <p className="text-xs text-gray-500">PAN: {payslipData.company.pan} | TAN: {payslipData.company.tan}</p>
                    <p className="text-xs text-gray-500">CIN: {payslipData.company.cin}</p>
                    <div className="border-t border-gray-200 mt-3 pt-3">
                      <h3 className="text-lg font-medium text-gray-900">Salary Slip - {payslipData.month}</h3>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p><span className="text-gray-500">Employee Name:</span> <span className="font-medium">{payslipData.employee.name}</span></p>
                      <p><span className="text-gray-500">Employee ID:</span> {payslipData.employee.empId}</p>
                      <p><span className="text-gray-500">Department:</span> {payslipData.employee.department}</p>
                      <p><span className="text-gray-500">Designation:</span> {payslipData.employee.designation}</p>
                    </div>
                    <div>
                      <p><span className="text-gray-500">PAN:</span> {payslipData.employee.pan}</p>
                      <p><span className="text-gray-500">UAN:</span> {payslipData.employee.uan}</p>
                      <p><span className="text-gray-500">Bank Name:</span> {payslipData.employee.bankName}</p>
                      <p><span className="text-gray-500">Bank A/C:</span> {payslipData.employee.bankAccount}</p>
                    </div>
                  </div>

                  {/* Attendance Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div>
                        <p className="text-gray-500">Working Days</p>
                        <p className="font-medium">{payslipData.attendance.workingDays}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Present</p>
                        <p className="font-medium">{payslipData.attendance.present}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Absent</p>
                        <p className="font-medium">{payslipData.attendance.absent}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Leave</p>
                        <p className="font-medium">{payslipData.attendance.leave}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Overtime</p>
                        <p className="font-medium">{payslipData.attendance.overtime}h</p>
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Earnings */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 pb-1 border-b border-gray-200">Earnings</h4>
                      <div className="space-y-2">
                        {payslipData.earnings.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                          <span>Total Earnings</span>
                          <span>₹{totalEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 pb-1 border-b border-gray-200">Deductions</h4>
                      <div className="space-y-2">
                        {payslipData.deductions.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                          <span>Total Deductions</span>
                          <span>₹{totalDeductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="bg-gray-900 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-300">Net Payable</p>
                        <p className="text-2xl font-bold">₹{netPay.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">In Words</p>
                        <p className="text-sm">Rupees Eighty Four Thousand Fifty Only</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 text-xs text-gray-400 text-center">
                    <p>This is a computer generated payslip and does not require signature</p>
                    <p className="mt-1">Generated on: 2026-03-31</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Select an employee to generate payslip</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;