import React, { useState, useEffect } from 'react';
import { UserMinus, RefreshCw, Eye } from 'lucide-react';

export default function CurrentEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [exitData, setExitData] = useState({ 
    leavingDate: new Date().toISOString().split('T')[0], 
    leavingReason: 'Resigned' 
  });

  const getToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');

  const fetchCurrent = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.wemis.in/api/hr/employees/status/CURRENT', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (response.status === 403) {
        alert('Session expired. Please login again.');
        return;
      }
      
      const data = await response.json();
      console.log(data)
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      alert('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurrent(); }, []);

  const handleMarkLeft = async () => {
    if (!exitData.leavingDate) {
      alert('Please select leaving date');
      return;
    }

    try {
      const response = await fetch(`https://api.wemis.in/api/hr/employees/${selectedEmp.employeeId}/mark-left`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(exitData)
      });

      if (response.ok) {
        alert(`✅ ${selectedEmp.fullName} marked as LEFT successfully`);
        setSelectedEmp(null);
        fetchCurrent();
      } else {
        const error = await response.json();
        alert(`❌ Failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert("❌ Failed to update status");
    }
  };

  const viewDetails = (emp) => {
    setSelectedEmp(emp);
    setShowDetails(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="animate-spin text-blue-600 mr-2" size={24} />
      <span className="text-gray-600">Loading Active Directory...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Active Directory</h2>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {employees.length} Active Employees
          </span>
          <button 
            onClick={fetchCurrent}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <UserMinus size={48} className="mx-auto mb-4 opacity-30" />
          <p>No active employees found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 uppercase text-xs font-bold text-gray-600 border-b">
                <th className="p-4">Emp ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Department</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs font-medium">{emp.employeeId}</td>
                  <td className="p-4 font-medium">{emp.fullName}</td>
                  <td className="p-4 text-gray-600">{emp.designation || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{emp.department || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{emp.emailAddress || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => viewDetails(emp)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setSelectedEmp(emp)}
                        className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      >
                        Mark Left
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && selectedEmp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Employee Details</h3>
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
              <DetailItem label="Employee Type" value={selectedEmp.employeeType} />
              <DetailItem label="Date of Joining" value={selectedEmp.dateOfJoining} />
              <DetailItem label="Work Location" value={selectedEmp.workLocation} />
              <DetailItem label="Salary" value={selectedEmp.salary} />
              <DetailItem label="PAN Number" value={selectedEmp.panNumber} />
              <DetailItem label="Aadhaar Number" value={selectedEmp.aadhaarNumber} />
              <DetailItem label="Emergency Contact" value={selectedEmp.emergencyContactName} />
              <DetailItem label="Emergency Phone" value={selectedEmp.emergencyContactNumber} />
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

      {/* Mark Left Modal */}
      {selectedEmp && !showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-4">Offboard Employee</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mark <span className="font-semibold">{selectedEmp.fullName}</span> as left
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-700">Leaving Date *</label>
                <input 
                  type="date" 
                  value={exitData.leavingDate}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setExitData({...exitData, leavingDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-700">Reason</label>
                <select 
                   className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                   value={exitData.leavingReason}
                   onChange={(e) => setExitData({...exitData, leavingReason: e.target.value})}
                >
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Retired">Retired</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setSelectedEmp(null)} 
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMarkLeft} 
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  Confirm Left
                </button>
              </div>
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
