import React, { useState, useEffect } from 'react';
import {
  Search, Package, Building, Calendar,
  RefreshCw, ChevronRight, FileText,
  ExternalLink, ListFilter
} from 'lucide-react';
import VendorNavbar from './VendorNavbar';

const ProcurementTableVendor = () => {
  const [requirements, setRequirements] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://python-backend-2-5uar.onrender.com/vendors/vendor-see-requirements');
      const data = await response.json();


      // Ensure we handle the array response
      const rawData = Array.isArray(data) ? data : (data.data || []);
      setRequirements(rawData);
      setFilteredRequirements(rawData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // Filter logic
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Table Header / Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Procurement Inventory
              </h2>
              <p className="text-sm text-gray-500">Managing {requirements.length} active requirements</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, category, or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* The Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 border-b">Title & ID</th>
                  <th className="px-6 py-4 border-b">Category</th>
                  <th className="px-6 py-4 border-b">Quantity</th>
                  <th className="px-6 py-4 border-b">Company</th>
                  <th className="px-6 py-4 border-b">Posted Date</th>
                  <th className="px-6 py-4 border-b text-center">Status</th>
                  <th className="px-6 py-4 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequirements
                  .slice() 
                  .reverse()
                  .map((req) => (
                    <tr key={req._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {req.title}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            ID: {req._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border">
                          {req.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {req.quantity.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-3.5 w-3.5 opacity-50" />
                          {req.company_Name || req.company_id}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 opacity-50" />
                          {formatDate(req.created_at)}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 uppercase">
                          {req.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-xs">
                          VIEW <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredRequirements.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No results found for "{searchTerm}"</p>
            </div>
          )}

          {/* Footer info */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-400 flex justify-between items-center">
            <span>Data synced from Python Backend Service</span>
            <span>Showing {filteredRequirements.length} entries</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcurementTableVendor;