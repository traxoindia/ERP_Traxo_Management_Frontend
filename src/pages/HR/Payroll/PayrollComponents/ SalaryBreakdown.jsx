import React from 'react';

const SalaryBreakdown = ({ salaryData }) => {
  const defaultData = {
    earnings: [
      { label: 'Basic Salary', amount: 50000 },
      { label: 'HRA', amount: 25000 },
      { label: 'Conveyance', amount: 2000 },
      { label: 'Medical', amount: 1250 },
      { label: 'Special Allowance', amount: 10000 },
      { label: 'Bonus', amount: 5000 },
    ],
    deductions: [
      { label: 'Provident Fund', amount: 6000 },
      { label: 'Professional Tax', amount: 200 },
      { label: 'TDS', amount: 5000 },
      { label: 'Insurance', amount: 1500 },
    ]
  };

  const data = salaryData || defaultData;

  const totalEarnings = data.earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = data.deductions.reduce((sum, item) => sum + item.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Salary Breakdown</h3>
      
      {/* Earnings */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Earnings</h4>
        <div className="space-y-2">
          {data.earnings.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
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
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Deductions</h4>
        <div className="space-y-2">
          {data.deductions.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">₹{item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
            <span>Total Deductions</span>
            <span>₹{totalDeductions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className="bg-gray-900 text-white p-3 rounded-lg mt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Net Pay</span>
          <span className="text-lg font-bold">₹{netPay.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;