import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorManager = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('all'); // 'all' or 'pending'
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Toast notification component
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    
    // Fetch all vendors first, then filter based on status
    const url = 'https://api.traxoerp.com/vendors/';

    try {
      const response = await axios.get(url, {
        headers: {
          // Add any required authentication headers here
          // 'Authorization': `Bearer ${yourToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      let vendorsData = [];
      if (Array.isArray(response.data)) {
        vendorsData = response.data;
      } else if (response.data.vendors && Array.isArray(response.data.vendors)) {
        vendorsData = response.data.vendors;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        vendorsData = response.data.data;
      }
      
      setVendors(vendorsData);
      showToast('Vendors loaded successfully', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch vendor data. Please check the API connection.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Remove view dependency since we filter on frontend

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedVendor(null);
    setRejectReason('');
  };

  const handleApprove = async (vendorId) => {
    setActionLoading(true);
    try {
      // Using path parameter format: /approve/VEND1034
      const response = await axios.put(
        `https://api.traxoerp.com/vendors/approve/${vendorId}`,
        {},
        {
          headers: {
            // 'Authorization': `Bearer ${yourToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        showToast(`Vendor ${vendorId} approved successfully!`, 'success');
        // Refresh the data
        await fetchData();
        closeModal();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to approve vendor. Please try again.';
      showToast(errorMessage, 'error');
      console.error("Approve Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (vendorId) => {
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      // Using path parameter format: /reject/VEND1034
      const response = await axios.put(
        `https://api.traxoerp.com/vendors/reject/${vendorId}`,
        { reason: rejectReason },
        {
          headers: {
            // 'Authorization': `Bearer ${yourToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        showToast(`Vendor ${vendorId} rejected successfully!`, 'success');
        // Refresh the data
        await fetchData();
        setShowRejectModal(false);
        closeModal();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reject vendor. Please try again.';
      showToast(errorMessage, 'error');
      console.error("Reject Error:", err);
    } finally {
      setActionLoading(false);
      setRejectReason('');
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'APPROVED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter vendors based on view (frontend filtering)
  const filteredVendors = view === 'pending' 
    ? vendors.filter(v => v.status === 'PENDING')
    : vendors;

  const pendingCount = vendors.filter(v => v.status === 'PENDING').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            className="ml-4 text-white hover:text-gray-200 text-xl"
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Vendor Management</h1>
            <p className="text-gray-600">Manage and review your ERP vendors</p>
          </div>

          {/* Toggle Buttons */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setView('all')}
              className={`px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors ${
                view === 'all' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Vendors ({vendors.length})
            </button>
            <button
              onClick={() => setView('pending')}
              className={`px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors ${
                view === 'pending' 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Pending Approval ({pendingCount})
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 font-medium">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Vendor ID</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Legal Entity Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Contact Person</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor._id || vendor.vendor_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600 font-medium">
                          {vendor.vendor_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {vendor.legal_details?.legal_entity_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {vendor.contact_details?.contact_person_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {vendor.contact_details?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {vendor.contact_details?.phone_number || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                            {vendor.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleViewDetails(vendor)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        No {view === 'pending' ? 'pending ' : ''}vendors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Details Modal */}
      {showDetailsModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Vendor Details - {selectedVendor.vendor_id}</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={actionLoading}
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vendor Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 block">Vendor ID</label>
                    <p className="font-medium font-mono">{selectedVendor.vendor_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block">Status</label>
                    <p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedVendor.status)}`}>
                        {selectedVendor.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block">Created At</label>
                    <p className="font-medium">{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block">Code Sent</label>
                    <p className="font-medium">{selectedVendor.code_sent ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Legal Details */}
              {selectedVendor.legal_details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Legal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block">Legal Entity Name</label>
                      <p className="font-medium">{selectedVendor.legal_details.legal_entity_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">Business Structure</label>
                      <p className="font-medium">{selectedVendor.legal_details.business_structure}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">PAN Number</label>
                      <p className="font-medium font-mono">{selectedVendor.legal_details.pan_number}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">GSTIN</label>
                      <p className="font-medium font-mono">{selectedVendor.legal_details.gstin}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              {selectedVendor.contact_details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Contact Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block">Contact Person</label>
                      <p className="font-medium">{selectedVendor.contact_details.contact_person_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">Email</label>
                      <p className="font-medium">{selectedVendor.contact_details.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">Phone Number</label>
                      <p className="font-medium">{selectedVendor.contact_details.phone_number}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Details */}
              {selectedVendor.bank_details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Bank Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block">Bank Name</label>
                      <p className="font-medium">{selectedVendor.bank_details.bank_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">Account Number</label>
                      <p className="font-medium font-mono">{selectedVendor.bank_details.account_number}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block">IFSC Code</label>
                      <p className="font-medium font-mono">{selectedVendor.bank_details.ifsc_code}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedVendor.documents && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedVendor.documents.pan_card && (
                      <a href={selectedVendor.documents.pan_card} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        📄 PAN Card
                      </a>
                    )}
                    {selectedVendor.documents.gst_certificate && (
                      <a href={selectedVendor.documents.gst_certificate} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        📄 GST Certificate
                      </a>
                    )}
                    {selectedVendor.documents.address_proof && (
                      <a href={selectedVendor.documents.address_proof} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        📄 Address Proof
                      </a>
                    )}
                    {selectedVendor.documents.cancelled_cheque && (
                      <a href={selectedVendor.documents.cancelled_cheque} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        📄 Cancelled Cheque
                      </a>
                    )}
                    {selectedVendor.documents.iso_certificate && (
                      <a href={selectedVendor.documents.iso_certificate} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        📄 ISO Certificate
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Compliance */}
              {selectedVendor.compliance && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Compliance</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${selectedVendor.compliance.anti_bribery ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>Anti-Bribery Policy: {selectedVendor.compliance.anti_bribery ? 'Accepted' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${selectedVendor.compliance.conflict_of_interest ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>Conflict of Interest: {selectedVendor.compliance.conflict_of_interest ? 'Accepted' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading}
              >
                Close
              </button>
              {selectedVendor.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedVendor.vendor_id)}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Reject Vendor</h3>
              <p className="text-sm text-gray-600 mt-1">Please provide a reason for rejecting {selectedVendor.vendor_id}</p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter the reason for rejection..."
                disabled={actionLoading}
              />
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedVendor.vendor_id)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={actionLoading || !rejectReason.trim()}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VendorManager;