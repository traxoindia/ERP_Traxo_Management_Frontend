import React, { useState, useEffect } from 'react';
import { Check, Clock, Loader2, Building2, Mail, MapPin, XCircle, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminVendorApprove = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('PENDING'); // Default filter

  const BASE_URL = 'https://api.traxoerp.com';

  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/vendors`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setVendors(data);
      } else {
        setVendors([]);
      }
    } catch (error) {
      toast.error('Failed to fetch vendors');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Logic to filter vendors based on status
  const filteredVendors = vendors.filter(vendor => 
    activeFilter === 'ALL' ? true : vendor.status === activeFilter
  );

  // Get counts for the badges
  const getCount = (status) => vendors.filter(v => v.status === status).length;

  const handleAction = async (vendorId, action) => {
    const actionPath = action === 'approve' ? 'approve' : 'rejects';
    const targetUrl = `${BASE_URL}/vendors/${actionPath}/${vendorId}`;
    const loadingToast = toast.loading(`Processing ${action}...`);

    try {
      const response = await fetch(targetUrl, {
        method: 'PUT',
        headers: { 
          ...getAuthHeader(),
          'Content-Type': 'application/json' 
        }
      });

      if (response.ok) {
        toast.success(`Vendor ${action}ed successfully!`, { id: loadingToast });
        // Refresh data to reflect status change across all filters
        fetchVendors();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to ${action} vendor.`, { id: loadingToast });
      }
    } catch (error) {
      toast.error('Server error. Please try again.', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Vendor Management</h1>
          <p className="text-slate-500 mt-1 text-lg">Review and manage vendor onboarding statuses.</p>
        </header>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { id: 'PENDING', label: 'Pending', icon: <Clock size={16} />, color: 'blue' },
            { id: 'APPROVED', label: 'Approved', icon: <Check size={16} />, color: 'emerald' },
            { id: 'REJECTED', label: 'Rejected', icon: <XCircle size={16} />, color: 'rose' },
            { id: 'ALL', label: 'All Vendors', icon: <Filter size={16} />, color: 'slate' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border-2 ${
                activeFilter === tab.id 
                ? `bg-white border-${tab.color}-500 text-${tab.color}-600 shadow-md` 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeFilter === tab.id ? `bg-${tab.color}-100` : 'bg-slate-200'
              }`}>
                {tab.id === 'ALL' ? vendors.length : getCount(tab.id)}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Company</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance</th>
                  <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></td>
                  </tr>
                ) : filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-slate-500">
                      No vendors found with status: <strong>{activeFilter}</strong>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-slate-50 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${vendor.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                            <Building2 size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{vendor.company_details?.company_name}</div>
                            <div className="text-xs text-slate-500">{vendor.contact_details?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          vendor.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                          vendor.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="text-xs font-mono text-slate-600">GST: {vendor.company_details?.gst_number}</div>
                        <div className="text-xs font-mono text-slate-600">PAN: {vendor.company_details?.pan_number}</div>
                      </td>
                      <td className="p-6 text-right">
                        {vendor.status === 'PENDING' ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleAction(vendor.vendor_id, 'approve')} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"><Check size={18} /></button>
                            <button onClick={() => handleAction(vendor.vendor_id, 'reject')} className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"><XCircle size={18} /></button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVendorApprove;