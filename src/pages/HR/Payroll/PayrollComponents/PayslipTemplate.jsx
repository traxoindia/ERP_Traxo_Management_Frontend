import React from 'react';

const PayslipTemplate = ({ data, onClose }) => {
  const defaultData = {
    company: {
      name: 'Traxo India Pvt Ltd',
      address: '123 Business Park, Mumbai - 400001',
      pan: 'AAACT1234F',
      tan: 'MUMT12345E',
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
    },
    month: 'March 2026',
    earnings: [
      { name: 'Basic Salary', amount: 50000 },
      { name: 'HRA', amount: 25000 },
      { name: 'Conveyance', amount: 2000 },
      { name: 'Medical', amount: 1250 },
      { name: 'Special Allowance', amount: 10000 },
      { name: 'Bonus', amount: 5000 },
    ],
    deductions: [
      { name: 'PF', amount: 6000 },
      { name: 'Professional Tax', amount: 200 },
      { name: 'TDS', amount: 5000 },
      { name: 'Insurance', amount: 1500 },
    ],
    attendance: {
      present: 22,
      workingDays: 27,
    }
  };

  const payslip = data || defaultData;
  const totalEarnings = payslip.earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = payslip.deductions.reduce((sum, item) => sum + item.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Payslip Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg">
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-lg p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{payslip.company.name}</h2>
              <p className="text-xs text-gray-500 mt-1">{payslip.company.address}</p>
              <p className="text-xs text-gray-500">PAN: {payslip.company.pan} | TAN: {payslip.company.tan}</p>
              <div className="border-t border-gray-200 mt-3 pt-3">
                <h3 className="text-lg font-medium text-gray-900">Salary Slip - {payslip.month}</h3>
              </div>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p><span className="text-gray-500">Employee Name:</span> <span className="font-medium">{payslip.employee.name}</span></p>
                <p><span className="text-gray-500">Employee ID:</span> {payslip.employee.empId}</p>
                <p><span className="text-gray-500">Department:</span> {payslip.employee.department}</p>
                <p><span className="text-gray-500">Designation:</span> {payslip.employee.designation}</p>
              </div>
              <div>
                <p><span className="text-gray-500">PAN:</span> {payslip.employee.pan}</p>
                <p><span className="text-gray-500">UAN:</span> {payslip.employee.uan}</p>
                <p><span className="text-gray-500">Bank Name:</span> {payslip.employee.bankName}</p>
                <p><span className="text-gray-500">Bank A/C:</span> {payslip.employee.bankAccount}</p>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-gray-50 p-2 rounded-lg mb-4 text-sm">
              <div className="flex justify-between">
                <span><span className="text-gray-500">Present Days:</span> {payslip.attendance.present}</span>
                <span><span className="text-gray-500">Working Days:</span> {payslip.attendance.workingDays}</span>
              </div>
            </div>

            {/* Salary Table */}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-t border-b border-gray-200">
                  <th className="py-2 text-left font-medium text-gray-900">Earnings</th>
                  <th className="py-2 text-right font-medium text-gray-900">Amount</th>
                  <th className="py-2 text-left font-medium text-gray-900">Deductions</th>
                  <th className="py-2 text-right font-medium text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payslip.earnings.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1 text-gray-600">{item.name}</td>
                    <td className="py-1 text-right">₹{item.amount.toLocaleString()}</td>
                    {idx < payslip.deductions.length ? (
                      <>
                        <td className="py-1 text-gray-600">{payslip.deductions[idx].name}</td>
                        <td className="py-1 text-right">₹{payslip.deductions[idx].amount.toLocaleString()}</td>
                      </>
                    ) : (
                      <>
                        <td></td>
                        <td></td>
                      </>
                    )}
                  </tr>
                ))}
                <tr className="border-t border-gray-200 font-bold">
                  <td className="py-2">Total Earnings</td>
                  <td className="py-2 text-right">₹{totalEarnings.toLocaleString()}</td>
                  <td className="py-2">Total Deductions</td>
                  <td className="py-2 text-right">₹{totalDeductions.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Net Pay */}
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg">Net Payable</span>
                <span className="text-2xl font-bold">₹{netPay.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-gray-400 text-center">
              <p>This is a computer generated payslip</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipTemplate;