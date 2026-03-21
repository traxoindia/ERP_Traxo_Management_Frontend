import React, { useState } from 'react';
import { Download, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const BankFileExport = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [exportFormat, setExportFormat] = useState('hdfc');

  const bankFormats = [
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'sbi', name: 'SBI' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'yes', name: 'Yes Bank' },
  ];

  const payrollData = [
    { empId: 'EMP001', name: 'John Smith', accountNo: '12345678901', ifsc: 'HDFC0001234', amount: 84050 },
    { empId: 'EMP002', name: 'Sarah Johnson', accountNo: '23456789012', ifsc: 'ICIC0005678', amount: 72750 },
    { empId: 'EMP003', name: 'Michael Chen', accountNo: '34567890123', ifsc: 'SBIN0009012', amount: 65300 },
    { empId: 'EMP004', name: 'Emily Brown', accountNo: '45678901234', ifsc: 'UTIB0003456', amount: 89200 },
    { empId: 'EMP005', name: 'David Wilson', accountNo: '56789012345', ifsc: 'HDFC0007890', amount: 78100 },
  ];

  const totalAmount = payrollData.reduce((sum, emp) => sum + emp.amount, 0);

  const generateBankFile = () => {
    let content = '';
    
    switch(exportFormat) {
      case 'hdfc':
        content = payrollData.map(emp => 
          `${emp.empId},${emp.accountNo},${emp.ifsc},${emp.name},${emp.amount}`
        ).join('\n');
        break;
      case 'icici':
        content = payrollData.map(emp => 
          `${emp.accountNo}|${emp.ifsc}|${emp.name}|${emp.amount}`
        ).join('\n');
        break;
      default:
        content = payrollData.map(emp => 
          `${emp.accountNo},${emp.ifsc},${emp.name},${emp.amount}`
        ).join('\n');
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${selectedMonth}_${exportFormat}.txt`;
    a.click();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Bank File Export</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="2026-03">March 2026</option>
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Bank Format</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            {bankFormats.map(format => (
              <option key={format.id} value={format.id}>{format.name}</option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Employees</span>
            <span className="font-medium">{payrollData.length}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transactions</span>
            <span className="font-medium">{payrollData.length}</span>
          </div>
        </div>

        {/* Sample Format */}
        <div className="border border-gray-200 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1">Sample Format:</p>
          <code className="text-xs bg-gray-50 p-1 rounded block">
            {exportFormat === 'hdfc' ? 'EMP001,12345678901,HDFC0001234,John Smith,84050' :
             exportFormat === 'icici' ? '12345678901|ICIC0005678|Sarah Johnson|72750' :
             '12345678901,HDFC0001234,John Smith,84050'}
          </code>
        </div>

        <button
          onClick={generateBankFile}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
        >
          <Download size={14} />
          <span>Generate Bank File</span>
        </button>
      </div>
    </div>
  );
};

export default BankFileExport;