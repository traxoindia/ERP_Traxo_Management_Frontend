import React, { useState } from 'react';
import { Search, Filter, Check, X, Eye } from 'lucide-react';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const leaveRequests = [
    {
      id: 1,
      employeeName: 'John Smith',
      employeeId: 'EMP001',
      department: 'Engineering',
      type: 'Sick Leave',
      startDate: '2026-03-20',
      endDate: '2026-03-22',
      days: 3,
      reason: 'Flu and fever',
      status: 'pending',
      appliedOn: '2026-03-18'
    },
    {
      id: 2,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP002',
      department: 'Marketing',
      type: 'Casual Leave',
      startDate: '2026-03-25',
      endDate: '2026-03-26',
      days: 2,
      reason: 'Personal work',
      status: 'pending',
      appliedOn: '2026-03-17'
    },
    {
      id: 3,
      employeeName: 'Michael Chen',
      employeeId: 'EMP003',
      department: 'Engineering',
      type: 'Annual Leave',
      startDate: '2026-04-01',
      endDate: '2026-04-05',
      days: 5,
      reason: 'Vacation',
      status: 'approved',
      appliedOn: '2026-03-15',
      approvedBy: 'HR Manager',
      approvedOn: '2026-03-16'
    },
    {
      id: 4,
      employeeName: 'Emily Brown',
      employeeId: 'EMP004',
      department: 'Sales',
      type: 'Sick Leave',
      startDate: '2026-03-19',
      endDate: '2026-03-19',
      days: 1,
      reason: 'Doctor appointment',
      status: 'rejected',
      appliedOn: '2026-03-18',
      rejectedBy: 'HR Manager',
      rejectedOn: '2026-03-18',
      rejectionReason: 'Insufficient notice'
    },
    {
      id: 5,
      employeeName: 'David Wilson',
      employeeId: 'EMP005',
      department: 'Sales',
      type: 'Casual Leave',
      startDate: '2026-03-27',
      endDate: '2026-03-28',
      days: 2,
      reason: 'Family function',
      status: 'pending',
      appliedOn: '2026-03-19'
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: 3 },
    { id: 'approved', label: 'Approved', count: 1 },
    { id: 'rejected', label: 'Rejected', count: 1 },
    { id: 'all', label: 'All', count: 5 },
  ];

  const filteredRequests = leaveRequests.filter(request => {
    if (activeTab !== 'all' && request.status !== activeTab) return false;
    if (searchTerm) {
      return request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
             request.type.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const handleApprove = (id) => {
    console.log('Approve leave:', id);
    // API call here
  };

  const handleReject = (id) => {
    console.log('Reject leave:', id);
    // API call here
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded-full">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 border border-gray-300 text-gray-600 text-xs rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-medium text-gray-900">Leave Management</h1>
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
              {tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, ID, or leave type..."
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

      {/* Leave Requests List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium">
                    {request.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{request.employeeName}</h3>
                      <span className="text-xs text-gray-500">{request.employeeId}</span>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{request.department} • {request.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-1 text-gray-900">{request.startDate} to {request.endDate}</span>
                        <span className="ml-2 text-xs text-gray-500">({request.days} days)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Applied:</span>
                        <span className="ml-1 text-gray-900">{request.appliedOn}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Reason:</span>
                      <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                        {request.reason}
                      </p>
                    </div>
                    
                    {/* Approval/Rejection Info */}
                    {request.status === 'approved' && (
                      <div className="mt-2 text-xs text-gray-500">
                        Approved by {request.approvedBy} on {request.approvedOn}
                      </div>
                    )}
                    {request.status === 'rejected' && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          Rejected by {request.rejectedBy} on {request.rejectedOn}
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          Reason: {request.rejectionReason}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(request.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => handleReject(request.id)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {request.status !== 'pending' && (
                  <button className="p-2 hover:bg-gray-50 rounded-lg">
                    <Eye size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No leave requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;