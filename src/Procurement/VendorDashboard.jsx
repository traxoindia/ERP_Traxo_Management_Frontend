import React, { useState } from 'react';
import VendorNavbar from './VendorNavbar'; // Assuming the previous component is in the same folder

function VendorDashboard() {
  // Sample data - in a real app, you would fetch this from your backend
  const [requirements] = useState([
    { id: 'REQ-001', item: 'Structural Steel', quantity: '50 Tons', date: '2026-05-10', status: 'Open', priority: 'High' },
    { id: 'REQ-002', item: 'Portland Cement', quantity: '500 Bags', date: '2026-05-15', status: 'Open', priority: 'Medium' },
    { id: 'REQ-003', item: 'Electrical Wiring (Copper)', quantity: '1000m', date: '2026-04-30', status: 'In Review', priority: 'High' },
    { id: 'REQ-004', item: 'Plywood Sheets (12mm)', quantity: '200 Units', date: '2026-06-01', status: 'Closed', priority: 'Low' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Navbar */}
      <VendorNavbar vendorName="BuildMart Vendor" />

      {/* 2. Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, Vendor
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Here is what's happening with your requirements today.
            </p>
          </div>
        </div>

        {/* 3. Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <StatCard title="Active Requirements" value={requirements.filter(r => r.status !== 'Closed').length} color="indigo" />
          <StatCard title="Quotes Submitted" value="12" color="green" />
          <StatCard title="Urgent Requests" value={requirements.filter(r => r.priority === 'High').length} color="red" />
        </div>

        {/* 4. Requirements Table Section */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Available Requirements</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-500">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{req.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{req.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors">
                        Submit Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Small helper component for Stats
function StatCard({ title, value, color }) {
  const colors = {
    indigo: 'text-indigo-600 bg-indigo-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100'
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-bold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;