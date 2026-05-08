import React, { useState, useEffect } from 'react';
import ProcurementNavbar from './ProcurementNavbar';

function ProcureMentSeeOwnProducts() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.traxoerp.com/requirement/See-requirements');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data)
        setRequirements(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch requirements");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading requirements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
   <>
    <ProcurementNavbar/>
     <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2 inline-block">
        Created  Requirements
      </h1>
      
      {requirements.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg text-center">
          No requirements found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {requirements.reverse().map((req) => (
            <div 
              key={req._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 truncate" title={req.title}>
                    {req.title || 'Untitled'}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {req.status || 'N/A'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={req.description}>
                  {req.description || 'No description provided'}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Quantity:</span>
                    <span className="text-gray-900">{req.quantity || 0}</span>
                  </div>
                  
                  {req.product_Name && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24">Product:</span>
                      <span className="text-gray-900">{req.product_Name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Category:</span>
                    <span className="text-gray-900">{req.category || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-24">Company:</span>
                    <span className="text-gray-900">{req.company_Name || req.company_id || 'N/A'}</span>
                  </div>
                  
                  {req.created_at && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24">Created:</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {req.ApproveVendor_ids && req.ApproveVendor_ids.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700 block mb-1">Approved Vendors:</span>
                      <div className="flex flex-wrap gap-1">
                        {req.ApproveVendor_ids.map((vendor, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {vendor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
   </>
  );
}

export default ProcureMentSeeOwnProducts;