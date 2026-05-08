import React, { useState, useEffect } from 'react';
import ProcurementNavbar from './ProcurementNavbar';

const RequirementsWithApprovedVendors = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approvedVendorsData, setApprovedVendorsData] = useState({});
  const [vendorsLoading, setVendorsLoading] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all requirements
  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.traxoerp.com/requirement/See-requirements');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRequirements(Array.isArray(data) ? [...data].reverse() : []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch requirements");
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved vendors
  const fetchApprovedVendors = async (requirementId) => {
    try {
      setVendorsLoading(prev => ({ ...prev, [requirementId]: true }));
      const response = await fetch(`https://api.traxoerp.com/requirement/see-all-Vendor-Approve-requirements?requirement_id=${requirementId}`);
      if (!response.ok) throw new Error(`Error fetching vendors: ${response.status}`);
      
      const data = await response.json();
      let vendorsArray = [];
      if (data && data.approved_vendors && Array.isArray(data.approved_vendors)) {
        vendorsArray = [...data.approved_vendors].reverse();
      } else if (Array.isArray(data)) {
        vendorsArray = [...data].reverse();
      }
      
      setApprovedVendorsData(prev => ({ ...prev, [requirementId]: vendorsArray }));
    } catch (err) {
      console.error(err);
      setApprovedVendorsData(prev => ({ ...prev, [requirementId]: [] }));
    } finally {
      setVendorsLoading(prev => ({ ...prev, [requirementId]: false }));
    }
  };

  const toggleRow = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!approvedVendorsData[id]) {
        await fetchApprovedVendors(id);
      }
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const filteredRequirements = requirements.filter(req => 
    req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.product_Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
   <>
    <ProcurementNavbar/>
     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Requirement Master List</h1>
            <p className="text-sm text-gray-500">View requirements and their approved vendor status</p>
          </div>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search requirements..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-80"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <th className="px-6 py-4 border-b">Title & Description</th>
                <th className="px-6 py-4 border-b">Category / Product</th>
                <th className="px-6 py-4 border-b">Quantity</th>
               
               
                <th className="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequirements.map((req) => (
                <React.Fragment key={req._id}>
                  {/* Main Row */}
                  <tr className={`hover:bg-blue-50/30 transition-colors ${expandedId === req._id ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{req.title || 'Untitled'}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{req.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {req.product_Name || req.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {req.quantity || 0}
                    </td>
                   
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleRow(req._id)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          expandedId === req._id 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        {expandedId === req._id ? 'Hide Vendors' : 'View Vendors'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Vendors Row */}
                  {expandedId === req._id && (
                    <tr>
                      <td colSpan="6" className="px-8 py-6 bg-gray-50/80 border-y border-gray-200">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 bg-gray-800 text-white flex justify-between items-center">
                            <h3 className="text-sm font-bold tracking-wide uppercase">Approved Vendors for {req.title}</h3>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">
                              Count: {approvedVendorsData[req._id]?.length || 0}
                            </span>
                          </div>

                          {vendorsLoading[req._id] ? (
                            <div className="p-10 text-center text-gray-500">
                              <div className="animate-pulse flex flex-col items-center">
                                <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                                <p>Fetching vendor records...</p>
                              </div>
                            </div>
                          ) : !approvedVendorsData[req._id] || approvedVendorsData[req._id].length === 0 ? (
                            <div className="p-10 text-center text-gray-400 italic">
                              No approved vendors found for this requirement.
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-gray-100 text-gray-600 border-b">
                                  <tr>
                                    <th className="px-4 py-3">Vendor Entity</th>
                                    <th className="px-4 py-3">Point of Contact</th>
                                    <th className="px-4 py-3">Legal (GST/PAN)</th>
                                    <th className="px-4 py-3">Bank Details</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {approvedVendorsData[req._id].map((vendor, idx) => (
                                    <tr key={vendor._id || idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-3">
                                        <div className="font-bold text-gray-800">
                                          {vendor.legal_details?.legal_entity_name || vendor.vendor_name || 'N/A'}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase">Code: {vendor.vendor_code || 'N/A'}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="font-medium text-gray-700">{vendor.contact_details?.contact_person_name || 'N/A'}</div>
                                        <div className="text-blue-500">{vendor.contact_details?.email}</div>
                                        <div className="text-gray-500">{vendor.contact_details?.phone_number}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div><span className="text-gray-400">GST:</span> {vendor.legal_details?.gstin || 'N/A'}</div>
                                        <div><span className="text-gray-400">PAN:</span> {vendor.legal_details?.pan_number || 'N/A'}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="font-medium">{vendor.bank_details?.bank_name}</div>
                                        <div className="text-gray-500">A/C: {vendor.bank_details?.account_number}</div>
                                        <div className="text-gray-400">IFSC: {vendor.bank_details?.ifsc_code}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          vendor.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                          {vendor.status || 'APPROVED'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <button className="text-indigo-600 hover:underline font-bold">Manage</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {filteredRequirements.length === 0 && (
            <div className="p-20 text-center text-gray-500">
              No matching requirements found.
            </div>
          )}
        </div>
      </div>
    </div>
   </>
  );
};

export default RequirementsWithApprovedVendors;