import React, { useState, useEffect } from 'react';
import {
  Search, Package, Building, Calendar,
  RefreshCw, ChevronRight, FileText,
  CheckCircle, XCircle, AlertCircle, Trash2,
  X, Info
} from 'lucide-react';
import VendorNavbar from './VendorNavbar';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`${getToastStyles()} border-l-4 rounded-lg shadow-lg p-4 min-w-[320px] backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcurementRequirementShowVendor = () => {
  const [requirements, setRequirements] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, requirementId: null, title: '' });

  const token = localStorage.getItem('token');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.traxoerp.com/vendors/vendor-see-requirements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("Fetched data:", data);

      const rawData = Array.isArray(data) ? data : (data.data || []);
      setRequirements(rawData);
      setFilteredRequirements(rawData);
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast('Failed to fetch requirements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  useEffect(() => {
    const filtered = requirements.filter(req =>
      req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.company_Name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequirements(filtered);
  }, [searchTerm, requirements]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'green', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'red', icon: XCircle, text: 'Rejected' },
      pending: { color: 'yellow', icon: AlertCircle, text: 'Pending' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase
        bg-${config.color}-100 text-${config.color}-700`}>
        <Icon className="h-3 w-3 mr-1.5" />
        {config.text}
      </span>
    );
  };

  const handleApprove = async (requirementId) => {
    setActionLoading(prev => ({ ...prev, [requirementId]: 'approve' }));
    
    try {
      const response = await fetch(`https://api.traxoerp.com/vendors/approve-requirement/${requirementId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Requirement approved successfully!', 'success');
        await fetchRequirements();
      } else {
        showToast(data.message || 'Failed to approve requirement', 'error');
      }
    } catch (err) {
      console.error('Error approving requirement:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [requirementId]: null }));
    }
  };

  const handleReject = async (requirementId) => {
    setActionLoading(prev => ({ ...prev, [requirementId]: 'reject' }));
    
    try {
      const response = await fetch('https://api.traxoerp.com/vendors/reject-requirement', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requirement_id: requirementId
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Requirement rejected successfully!', 'warning');
        await fetchRequirements();
      } else {
        showToast(data.message || 'Failed to reject requirement', 'error');
      }
    } catch (err) {
      console.error('Error rejecting requirement:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [requirementId]: null }));
    }
  };

  const handleDelete = async (requirementId) => {
    setActionLoading(prev => ({ ...prev, [requirementId]: 'delete' }));
    
    try {
      const response = await fetch(`https://api.traxoerp.com/vendors/delete-requirement/${requirementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Requirement deleted successfully!', 'success');
        setDeleteModal({ isOpen: false, requirementId: null, title: '' });
        await fetchRequirements();
      } else {
        showToast(data.message || 'Failed to delete requirement', 'error');
      }
    } catch (err) {
      console.error('Error deleting requirement:', err);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [requirementId]: null }));
    }
  };

  const openDeleteModal = (requirementId, title) => {
    setDeleteModal({
      isOpen: true,
      requirementId,
      title
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorNavbar />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading requirements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <VendorNavbar />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requirementId: null, title: '' })}
        onConfirm={() => handleDelete(deleteModal.requirementId)}
        title="Delete Requirement"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
        loading={actionLoading[deleteModal.requirementId] === 'delete'}
      />

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Requirements</p>
                  <p className="text-2xl font-bold text-gray-900">{requirements.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {requirements.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {requirements.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {requirements.filter(r => r.status === 'pending' || !r.status).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header / Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Procurement Requirements
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Managing {filteredRequirements.length} active requirements
                </p>
              </div>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, category, or company..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                    <th className="px-6 py-4">Title & ID</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Posted Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequirements
                    .slice()
                    .reverse()
                    .map((req) => (
                      <tr key={req._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {req.title}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              ID: {req._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                            {req.category}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {req.quantity?.toLocaleString()} units
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Building className="h-3.5 w-3.5 text-gray-400" />
                            {req.company_Name || req.company_id}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {formatDate(req.created_at)}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(req.status)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Approve Button */}
                            <button
                              onClick={() => handleApprove(req._id)}
                              disabled={actionLoading[req._id] === 'approve' || req.status === 'approved'}
                              className={`
                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                ${req.status === 'approved' 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 hover:shadow-sm'}
                              `}
                              title="Approve"
                            >
                              {actionLoading[req._id] === 'approve' ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                              Approve
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => handleReject(req._id)}
                              disabled={actionLoading[req._id] === 'reject' || req.status === 'rejected'}
                              className={`
                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                ${req.status === 'rejected' 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:shadow-sm'}
                              `}
                              title="Reject"
                            >
                              {actionLoading[req._id] === 'reject' ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              Reject
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => openDeleteModal(req._id, req.title)}
                              disabled={actionLoading[req._id] === 'delete'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200 hover:shadow-sm"
                              title="Delete"
                            >
                              {actionLoading[req._id] === 'delete' ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredRequirements.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-lg">No results found</p>
                {searchTerm && (
                  <p className="text-gray-400 text-sm mt-1">for "{searchTerm}"</p>
                )}
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Footer info */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
              <span>Data synced from Python Backend Service</span>
              <span className="font-medium">Showing {filteredRequirements.length} of {requirements.length} entries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProcurementRequirementShowVendor;