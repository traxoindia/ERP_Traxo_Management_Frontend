import React, { useState, useEffect } from 'react';
import { Trash2, History, RefreshCw, AlertTriangle, Eye } from 'lucide-react';

export default function PastEmployees() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');

  const fetchPast = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.wemis.in/api/hr/employees/status/LEFT', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (response.status === 403) {
        alert('Session expired. Please login again.');
        return;
      }
      
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      alert('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPast(); }, []);

  const handleDelete = async (empId) => {
    try {
      const response = await fetch(`https://api.wemis.in/api/hr/employees/${empId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (response.ok) {
        setHistory(history.filter(e => e.employeeId !== empId));
        setDeleteConfirm(null);
        alert("✅ Employee record deleted permanently");
      } else {
        alert("❌ Delete failed");
      }
    } catch (error) {
      alert("❌ Delete failed");
    }
  };

  const viewDetails = (emp) => {
    setSelectedEmp(emp);
    setShowDetails(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="animate-spin text-blue-600 mr-2" size={24} />
      <span className="text-gray-600">Loading History...</span>
    </div>
  );

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-in fade-in duration-500 bg-white rounded-xl border">
        <History size={48} className="mb-4 opacity-20" />
        <p className="text-lg">No historical records found</p>
        <p className="text-sm text-gray-400 mt-2">Exited employees will appear here</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Exited Employees</h2>
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {history.length} Records
          </span>
          <button 
            onClick={fetchPast}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 uppercase text-xs font-bold text-gray-600 border-b">
              <th className="p-4">Emp ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Left On</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Designation</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((emp) => (
              <tr key={emp.employeeId} className="hover:bg-red-50/30 transition-colors">
                <td className="p-4 font-mono text-xs font-medium">{emp.employeeId}</td>
                <td className="p-4 font-medium">{emp.fullName}</td>
                <td className="p-4 text-sm text-gray-600">
                  {emp.leavingDate ? new Date(emp.leavingDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    emp.leavingReason === 'Resigned' ? 'bg-yellow-100 text-yellow-700' :
                    emp.leavingReason === 'Terminated' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {emp.leavingReason || 'Exited'}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{emp.designation || 'N/A'}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => viewDetails(emp)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded-full transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(emp)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded-full transition-all"
                      title="Delete permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {showDetails && selectedEmp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Employee Details (Exited)</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Employee ID" value={selectedEmp.employeeId} />
              <DetailItem label="Full Name" value={selectedEmp.fullName} />
              <DetailItem label="Date of Birth" value={selectedEmp.dateOfBirth} />
              <DetailItem label="Gender" value={selectedEmp.gender} />
              <DetailItem label="Phone" value={selectedEmp.phoneNumber} />
              <DetailItem label="Email" value={selectedEmp.emailAddress} />
              <DetailItem label="Department" value={selectedEmp.department} />
              <DetailItem label="Designation" value={selectedEmp.designation} />
              <DetailItem label="Leaving Date" value={selectedEmp.leavingDate} />
              <DetailItem label="Leaving Reason" value={selectedEmp.leavingReason} />
              <DetailItem label="Employee Type" value={selectedEmp.employeeType} />
              <DetailItem label="Work Location" value={selectedEmp.workLocation} />
              <DetailItem label="PAN Number" value={selectedEmp.panNumber} />
              <DetailItem label="Aadhaar Number" value={selectedEmp.aadhaarNumber} />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Confirm Permanent Delete</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to permanently delete <span className="font-semibold">{deleteConfirm.fullName}</span>'s record?
            </p>
            <p className="text-xs text-red-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm.employeeId)} 
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <div className="border-b pb-2">
    <p className="text-xs text-gray-500 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
  </div>
);