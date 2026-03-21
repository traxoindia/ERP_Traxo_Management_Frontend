import React, { useState } from 'react';

const TaxCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState('old');

  const calculateTax = () => {
    const taxableIncome = annualIncome - deductions;
    
    if (regime === 'old') {
      let tax = 0;
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.3;
        tax += 112500;
      } else if (taxableIncome > 500000) {
        tax += (taxableIncome - 500000) * 0.2;
        tax += 12500;
      } else if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }
      
      // Add cess
      tax += tax * 0.04;
      
      // Rebate u/s 87A
      if (taxableIncome <= 500000) {
        tax = Math.max(0, tax - 12500);
      }
      
      return Math.round(tax);
    } else {
      // New regime
      let tax = 0;
      if (taxableIncome > 1500000) {
        tax += (taxableIncome - 1500000) * 0.3;
        tax += 187500;
      } else if (taxableIncome > 1200000) {
        tax += (taxableIncome - 1200000) * 0.2;
        tax += 150000;
      } else if (taxableIncome > 900000) {
        tax += (taxableIncome - 900000) * 0.15;
        tax += 112500;
      } else if (taxableIncome > 600000) {
        tax += (taxableIncome - 600000) * 0.1;
        tax += 75000;
      } else if (taxableIncome > 300000) {
        tax += (taxableIncome - 300000) * 0.05;
        tax += 15000;
      } else if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }
      
      // Add cess
      tax += tax * 0.04;
      
      return Math.round(tax);
    }
  };

  const taxAmount = calculateTax();
  const taxableIncome = annualIncome - deductions;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Tax Calculator</h3>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Annual Income</label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Deductions (80C, etc.)</label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tax Regime</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="old"
                checked={regime === 'old'}
                onChange={(e) => setRegime(e.target.value)}
                className="text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm">Old Regime</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="new"
                checked={regime === 'new'}
                onChange={(e) => setRegime(e.target.value)}
                className="text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm">New Regime</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Taxable Income</span>
          <span className="font-medium">₹{taxableIncome.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span>Tax Payable (including cess)</span>
          <span className="text-gray-900">₹{taxAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;