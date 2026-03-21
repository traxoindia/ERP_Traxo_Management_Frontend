import React, { useState } from 'react';
import { Calculator, Download, Search, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const TaxManagement = () => {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('2025-26');
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    {
      id: 1,
      name: 'John Smith',
      empId: 'EMP001',
      department: 'Engineering',
      pan: 'ABCDE1234F',
      grossIncome: 1200000,
      exemptIncome: 150000,
      taxableIncome: 1050000,
      tdsDeducted: 50000,
      taxPayable: 58500,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      empId: 'EMP002',
      department: 'Marketing',
      pan: 'FGHIJ5678K',
      grossIncome: 980000,
      exemptIncome: 120000,
      taxableIncome: 860000,
      tdsDeducted: 42000,
      taxPayable: 46800,
      status: 'pending'
    },
    {
      id: 3,
      name: 'Michael Chen',
      empId: 'EMP003',
      department: 'Engineering',
      pan: 'KLMNO9012P',
      grossIncome: 850000,
      exemptIncome: 100000,
      taxableIncome: 750000,
      tdsDeducted: 36000,
      taxPayable: 37500,
      status: 'completed'
    },
  ];

  const taxSlabs = [
    { range: '0 - ₹2,50,000', rate: '0%', tax: 0 },
    { range: '₹2,50,001 - ₹5,00,000', rate: '5%', tax: 12500 },
    { range: '₹5,00,001 - ₹10,00,000', rate: '20%', tax: 100000 },
    { range: 'Above ₹10,00,000', rate: '30%', tax: 15000 },
  ];

  const summary = {
    totalEmployees: employees.length,
    completedReturns: employees.filter(e => e.status === 'completed').length,
    pendingReturns: employees.filter(e => e.status === 'pending').length,
    totalTDS: employees.reduce((sum, e) => sum + e.tdsDeducted, 0),
    totalTaxPayable: employees.reduce((sum, e) => sum + e.taxPayable, 0)
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Tax Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage TDS and tax computations</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedFinancialYear}
              onChange={(e) => setSelectedFinancialYear(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            >
              <option value="2025-26">FY 2025-26</option>
              <option value="2024-25">FY 2024-25</option>
              <option value="2023-24">FY 2023-24</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
              <Download size={14} />
              <span>Download Report</span>
            </button>
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
          <p className="text-xs text-gray-500">Returns Completed</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">{summary.completedReturns}</p>
          <p className="text-xs text-gray-500 mt-1">Pending: {summary.pendingReturns}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total TDS Deducted</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">₹{summary.totalTDS.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Tax Payable</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">₹{summary.totalTaxPayable.toLocaleString()}</p>
        </div>
      </div>

      <div className="px-6 grid grid-cols-3 gap-4">
        {/* Tax Slabs */}
        <div className="col-span-1 border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Tax Slabs (Old Regime)</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="text-left py-2">Income Range</th>
                  <th className="text-left">Rate</th>
                  <th className="text-right">Tax</th>
                </tr>
              </thead>
              <tbody>
                {taxSlabs.map((slab, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-2">{slab.range}</td>
                    <td>{slab.rate}</td>
                    <td className="text-right">₹{slab.tax.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Health & Education Cess: 4%</p>
              <p className="text-xs text-gray-500 mt-1">Rebate u/s 87A: Up to ₹12,500</p>
            </div>
          </div>
        </div>

        {/* Employee Tax List */}
        <div className="col-span-2 border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Employee Tax Details</h3>
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
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="text-left py-2">Employee</th>
                  <th className="text-left">PAN</th>
                  <th className="text-right">Gross Income</th>
                  <th className="text-right">Taxable Income</th>
                  <th className="text-right">TDS</th>
                  <th className="text-right">Tax Payable</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.empId}</p>
                      </div>
                    </td>
                    <td className="py-3">{emp.pan}</td>
                    <td className="py-3 text-right">₹{emp.grossIncome.toLocaleString()}</td>
                    <td className="py-3 text-right">₹{emp.taxableIncome.toLocaleString()}</td>
                    <td className="py-3 text-right">₹{emp.tdsDeducted.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium">₹{emp.taxPayable.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      {emp.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <AlertCircle size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxManagement;