import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, XCircle, Eye, Download, Clock } from 'lucide-react';

const Reimbursements = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const reimbursements = [
    {
      id: 1,
      employeeName: 'John Smith',
      empId: 'EMP001',
      type: 'Medical',
      amount: 1500,
      date: '2026-03-15',
      description: 'Doctor consultation and medicines',
      bills: ['bill1.pdf'],
      status: 'pending',
      submittedOn: '2026-03-16'
    },
    {
      id: 2,
      employeeName: 'Sarah Johnson',
      empId: 'EMP002',
      type: 'Travel',
      amount: 3500,
      date: '2026-03-10',
      description: 'Client meeting - Cab fare',
      bills: ['bill2.pdf', 'bill3.pdf'],
      status: 'approved',
      submittedOn: '2026-03-11',
      approvedOn: '2026-03-12'
    },
    {
      id: 3,
      employeeName: 'Michael Chen',
      empId: 'EMP003',
      type: 'Food',
      amount: 850,
      date: '2026-03-14',
      description: 'Team lunch',
      bills: ['bill4.pdf'],
      status: 'rejected',
      submittedOn: '2026-03-15',
      rejectedOn: '2026-03-16',
      rejectionReason: 'Bill not clear'
    },
    {
      id: 4,
      employeeName: 'Emily Brown',
      empId: 'EMP004',
      type: 'Travel',
      amount: 2200,
      date: '2026-03-17',
      description: 'Airport pickup',
      bills: ['bill5.pdf'],
      status: 'pending',
      submittedOn: '2026-03-18'
    },
    {
      id: 5,
      employeeName: 'David Wilson',
      empId: 'EMP005',
      type: 'Medical',
      amount: 2800,
      date: '2026-03-12',
      description: 'Dental checkup',
      bills: ['bill6.pdf', 'bill7.pdf'],
      status: 'approved',
      submittedOn: '2026-03-13',
      approvedOn: '2026-03-14'
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: reimbursements.filter(r => r.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: reimbursements.filter(r => r.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: reimbursements.filter(r => r.status === 'rejected').length },
    { id: 'all', label: 'All', count: reimbursements.length },
  ];

  const [showForm, setShowForm] = useState(false);

  const filteredReimbursements = reimbursements.filter(r => {
    if (activeTab !== 'all' && r.status !== activeTab) return false;
    if (searchTerm) {
      return r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
             r.empId.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const handleApprove = (id) => {
    console.log('Approve reimbursement:', id);
  };

  const handleReject = (id) => {
    console.log('Reject reimbursement:', id);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-900 text-white rounded-full">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded-full">Rejected</span>;
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
            <h1 className="text-xl font-medium text-gray-900">Reimbursements</h1>
            <p className="text-sm text-gray-500 mt-1">Manage employee expense claims</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            <Plus size={14} />
            <span>New Claim</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by employee, type, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Reimbursements List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredReimbursements.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{item.employeeName}</h3>
                    <span className="text-xs text-gray-500">{item.empId}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="text-gray-500">Type:</span> <span className="ml-2 text-gray-900">{item.type}</span></p>
                      <p><span className="text-gray-500">Date:</span> <span className="ml-2 text-gray-900">{item.date}</span></p>
                      <p><span className="text-gray-500">Amount:</span> <span className="ml-2 font-medium text-gray-900">₹{item.amount}</span></p>
                    </div>
                    <div>
                      <p><span className="text-gray-500">Submitted:</span> <span className="ml-2 text-gray-900">{item.submittedOn}</span></p>
                      <p><span className="text-gray-500">Description:</span> <span className="ml-2 text-gray-900">{item.description}</span></p>
                      <p><span className="text-gray-500">Bills:</span> <span className="ml-2 text-blue-600 cursor-pointer">{item.bills.length} file(s)</span></p>
                    </div>
                  </div>

                  {/* Approval/Rejection Info */}
                  {item.status === 'approved' && item.approvedOn && (
                    <p className="text-xs text-gray-500 mt-2">Approved on {item.approvedOn}</p>
                  )}
                  {item.status === 'rejected' && item.rejectionReason && (
                    <div className="mt-2 text-sm">
                      <p className="text-xs text-red-600">Reason: {item.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {item.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => handleApprove(item.id)}
                      className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => handleReject(item.id)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Reject"
                    >
                      <XCircle size={16} className="text-gray-500" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Eye size={16} className="text-gray-500" />
                    </button>
                  </div>
                )}

                {item.status !== 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Eye size={16} className="text-gray-500" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Download size={16} className="text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredReimbursements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reimbursement claims found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Claim Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">New Reimbursement Claim</h2>
            </div>
            <form className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                    <option>Select Employee</option>
                    <option>John Smith (EMP001)</option>
                    <option>Sarah Johnson (EMP002)</option>
                    <option>Michael Chen (EMP003)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                    <option>Medical</option>
                    <option>Travel</option>
                    <option>Food</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="₹"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe the expense..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bills</label>
                  <input
                    type="file"
                    multiple
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG files</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
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
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reimbursements;