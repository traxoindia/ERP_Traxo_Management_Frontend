import React, { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function NewHiresList() {
  const [newHires, setNewHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedHire, setSelectedHire] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');

  const fetchNewHires = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.wemis.in/api/hr/employees/status/NEW_HIRE', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (response.status === 403) {
        alert('Session expired. Please login again.');
        return;
      }
      
      const data = await response.json();
      setNewHires(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      alert('Failed to fetch new hires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNewHires(); }, []);

  const markAsCurrent = async (employee) => {
    setProcessingId(employee.employeeId);
    try {
      const response = await fetch(`https://api.wemis.in/api/hr/employees/${employee.employeeId}/mark-current`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.status === 403) {
        alert('Authentication failed. Please login again.');
        return;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to mark as current');
      }

      const data = await response.json();
      alert(`✅ ${employee.fullName} has been activated as CURRENT employee`);
      fetchNewHires(); // Refresh the list
    } catch (error) {
      console.error('Error marking as current:', error);
      alert(`❌ Failed to activate employee: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const viewDetails = (hire) => {
    setSelectedHire(hire);
    setShowDetails(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="animate-spin text-blue-600 mr-2" size={24} />
      <span className="text-gray-600">Loading New Hires...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">New Hires Awaiting Activation</h2>
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {newHires.length} Pending
          </span>
          <button 
            onClick={fetchNewHires}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {newHires.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <UserPlus size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No new hires pending</p>
          <p className="text-sm text-gray-400 mt-2">Add new employees using the "New Hire" tab</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 uppercase text-xs font-bold text-gray-600 border-b">
                <th className="p-4">Emp ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Department</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newHires.map((hire) => (
                <tr key={hire.employeeId} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-4 font-mono text-xs font-medium">{hire.employeeId}</td>
                  <td className="p-4 font-medium">{hire.fullName}</td>
                  <td className="p-4 text-gray-600">{hire.designation || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{hire.department || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{hire.emailAddress || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => viewDetails(hire)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={() => markAsCurrent(hire)}
                        disabled={processingId === hire.employeeId}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === hire.employeeId ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Details Modal */}
      {showDetails && selectedHire && (
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
              <DetailItem label="Employee ID" value={selectedHire.employeeId} />
              <DetailItem label="Full Name" value={selectedHire.fullName} />
              <DetailItem label="Date of Birth" value={selectedHire.dateOfBirth} />
              <DetailItem label="Gender" value={selectedHire.gender} />
              <DetailItem label="Phone" value={selectedHire.phoneNumber} />
              <DetailItem label="Email" value={selectedHire.emailAddress} />
              <DetailItem label="Department" value={selectedHire.department} />
              <DetailItem label="Designation" value={selectedHire.designation} />
              <DetailItem label="Employee Type" value={selectedHire.employeeType} />
              <DetailItem label="Date of Joining" value={selectedHire.dateOfJoining} />
              <DetailItem label="Work Location" value={selectedHire.workLocation} />
              <DetailItem label="Salary" value={selectedHire.salary} />
              <DetailItem label="PAN Number" value={selectedHire.panNumber} />
              <DetailItem label="Aadhaar Number" value={selectedHire.aadhaarNumber} />
              <DetailItem label="Emergency Contact" value={selectedHire.emergencyContactName} />
              <DetailItem label="Emergency Phone" value={selectedHire.emergencyContactNumber} />
              <DetailItem label="Education" value={selectedHire.educationQualification} />
              <DetailItem label="Experience" value={selectedHire.previousWorkExperience} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetails(false);
                  markAsCurrent(selectedHire);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Activate Employee
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