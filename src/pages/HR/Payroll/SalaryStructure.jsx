import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search, ChevronDown } from 'lucide-react';

const SalaryStructure = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [employees] = useState([
    { id: 1, name: 'John Smith', dept: 'Engineering', designation: 'Senior Developer', empId: 'EMP001' },
    { id: 2, name: 'Sarah Johnson', dept: 'Marketing', designation: 'Marketing Manager', empId: 'EMP002' },
    { id: 3, name: 'Michael Chen', dept: 'Engineering', designation: 'Frontend Developer', empId: 'EMP003' },
    { id: 4, name: 'Emily Brown', dept: 'Sales', designation: 'Sales Manager', empId: 'EMP004' },
    { id: 5, name: 'David Wilson', dept: 'Finance', designation: 'Accountant', empId: 'EMP005' },
  ]);

  const [salaryStructures, setSalaryStructures] = useState([
    {
      id: 1,
      employeeId: 1,
      effectiveFrom: '2026-01-01',
      components: {
        basic: 50000,
        hra: 25000,
        conveyance: 2000,
        medical: 1250,
        special: 10000,
        bonus: 5000,
        pf: 6000,
        pt: 200,
        tds: 5000,
        insurance: 1500
      },
      annualCTC: 1200000
    }
  ]);

  const [formData, setFormData] = useState({
    employeeId: '',
    effectiveFrom: '',
    basic: '',
    hra: '',
    conveyance: '',
    medical: '',
    special: '',
    bonus: '',
    pf: '',
    pt: '',
    tds: '',
    insurance: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateGross = () => {
    const earnings = ['basic', 'hra', 'conveyance', 'medical', 'special', 'bonus'];
    return earnings.reduce((sum, field) => sum + (Number(formData[field]) || 0), 0);
  };

  const calculateDeductions = () => {
    const deductions = ['pf', 'pt', 'tds', 'insurance'];
    return deductions.reduce((sum, field) => sum + (Number(formData[field]) || 0), 0);
  };

  const calculateNet = () => calculateGross() - calculateDeductions();

  const calculateCTC = () => {
    const earnings = ['basic', 'hra', 'conveyance', 'medical', 'special', 'bonus'];
    const monthlyEarnings = earnings.reduce((sum, field) => sum + (Number(formData[field]) || 0), 0);
    return monthlyEarnings * 12;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save logic here
    setShowForm(false);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeSalary = (empId) => {
    return salaryStructures.find(s => s.employeeId === empId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Salary Structure</h1>
            <p className="text-sm text-gray-500 mt-1">Define and manage employee salary components</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            <Plus size={14} />
            <span>New Structure</span>
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-4">
        {/* Employee List */}
        <div className="col-span-1 border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Employees</h3>
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
          <div className="p-2 max-h-[600px] overflow-y-auto">
            {filteredEmployees.map(emp => {
              const salary = getEmployeeSalary(emp.id);
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                    selectedEmployee === emp.id
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{emp.name}</p>
                      <p className={`text-xs mt-1 ${
                        selectedEmployee === emp.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {emp.empId} • {emp.designation}
                      </p>
                    </div>
                    {salary && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        selectedEmployee === emp.id 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Details */}
        <div className="col-span-2 border border-gray-200 rounded-lg">
          {selectedEmployee ? (
            (() => {
              const emp = employees.find(e => e.id === selectedEmployee);
              const salary = getEmployeeSalary(selectedEmployee);
              
              if (!salary) {
                return (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No salary structure defined for this employee</p>
                    <button
                      onClick={() => {
                        setFormData({ ...formData, employeeId: selectedEmployee });
                        setShowForm(true);
                      }}
                      className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                    >
                      Create Salary Structure
                    </button>
                  </div>
                );
              }

              return (
                <>
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{emp.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{emp.designation} • {emp.dept}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-50 rounded-lg">
                        <Edit2 size={14} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-50 rounded-lg">
                        <Trash2 size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Effective Date */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <span className="text-xs text-gray-500">Effective From</span>
                      <p className="text-sm font-medium">{salary.effectiveFrom}</p>
                    </div>

                    {/* Earnings */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Earnings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Basic Salary</span>
                          <span className="font-medium">₹{salary.components.basic.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">HRA</span>
                          <span className="font-medium">₹{salary.components.hra.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conveyance</span>
                          <span className="font-medium">₹{salary.components.conveyance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Medical Allowance</span>
                          <span className="font-medium">₹{salary.components.medical.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Special Allowance</span>
                          <span className="font-medium">₹{salary.components.special.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bonus</span>
                          <span className="font-medium">₹{salary.components.bonus.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Deductions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Provident Fund</span>
                          <span className="font-medium">₹{salary.components.pf.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Professional Tax</span>
                          <span className="font-medium">₹{salary.components.pt.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">TDS</span>
                          <span className="font-medium">₹{salary.components.tds.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Insurance</span>
                          <span className="font-medium">₹{salary.components.insurance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gross Earnings</span>
                        <span className="font-medium">₹{(Object.values(salary.components).slice(0,6).reduce((a,b) => a + b, 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">Total Deductions</span>
                        <span className="font-medium">₹{(Object.values(salary.components).slice(6,10).reduce((a,b) => a + b, 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold mt-3 pt-3 border-t border-gray-200">
                        <span>Net Salary</span>
                        <span>₹{((Object.values(salary.components).slice(0,6).reduce((a,b) => a + b, 0)) - 
                              (Object.values(salary.components).slice(6,10).reduce((a,b) => a + b, 0))).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Annual CTC</span>
                        <span>₹{salary.annualCTC.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="p-12 text-center">
              <Users size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Select an employee to view salary details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-medium text-gray-900">Create Salary Structure</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-50 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.empId})</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Effective From</label>
                  <input
                    type="date"
                    name="effectiveFrom"
                    value={formData.effectiveFrom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Earnings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Basic Salary</label>
                    <input
                      type="number"
                      name="basic"
                      value={formData.basic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">HRA</label>
                    <input
                      type="number"
                      name="hra"
                      value={formData.hra}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Conveyance</label>
                    <input
                      type="number"
                      name="conveyance"
                      value={formData.conveyance}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Medical</label>
                    <input
                      type="number"
                      name="medical"
                      value={formData.medical}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Special Allowance</label>
                    <input
                      type="number"
                      name="special"
                      value={formData.special}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bonus</label>
                    <input
                      type="number"
                      name="bonus"
                      value={formData.bonus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Deductions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">PF</label>
                    <input
                      type="number"
                      name="pf"
                      value={formData.pf}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Professional Tax</label>
                    <input
                      type="number"
                      name="pt"
                      value={formData.pt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">TDS</label>
                    <input
                      type="number"
                      name="tds"
                      value={formData.tds}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Insurance</label>
                    <input
                      type="number"
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      placeholder="₹"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Gross Earnings</span>
                  <span className="font-medium">₹{calculateGross().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Deductions</span>
                  <span className="font-medium">₹{calculateDeductions().toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span>Net Salary (Monthly)</span>
                  <span>₹{calculateNet().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Annual CTC</span>
                  <span>₹{calculateCTC().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Save Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryStructure;