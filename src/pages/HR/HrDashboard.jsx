import React, { useState, useEffect } from "react";
import { Users, UserCheck, Clock, Plus, Loader } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <div className="bg-white border rounded-lg p-5 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      {loading ? (
        <div className="h-8 w-12 bg-gray-100 animate-pulse rounded mt-1" />
      ) : (
        <h2 className="text-2xl font-semibold">{value}</h2>
      )}
    </div>
    <Icon size={24} className="text-gray-600" />
  </div>
);

const HrDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get token (Update this based on your auth logic)
  const getToken = () => localStorage.getItem("accessToken");

  const fetchCurrent = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.wemis.in/api/hr/employees/status/CURRENT', {
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        }
      });
      if (response.status === 403) {
        alert('Session expired. Please login again.');
        // Optional: window.location.href = "/login";
        return;
      }
      
      const data = await response.json();
      // Adjusting based on common API structures (e.g., if data is wrapped in a .data property)
      const empList = Array.isArray(data) ? data : (data.data || []);
      setEmployees(empList);
    } catch (error) {
      console.error("Fetch error:", error);
      alert('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrent();
  }, []);

  // Calculate dynamic stats
  const totalStaff = employees.length;
  // If your API provides an 'onDuty' or 'attendance' status, filter it here
  // For now, using placeholders as requested
  const onDutyCount = employees.filter(emp => emp.onDuty === true).length || 0; 

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">HR Dashboard</h1>
              <p className="text-gray-500 text-sm">Overview for March 2026</p>
            </div>

           <Link to="/employees" className="flex items-center gap-1 bg-black  text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95">
              <Plus size={14} />
              Add Employee
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Staff" 
              value={totalStaff} 
              icon={Users} 
              loading={loading}
            />
            <StatCard 
              title="On Duty" 
              value={onDutyCount} 
              icon={UserCheck} 
              loading={loading}
            />
            <StatCard 
              title="Leave Requests" 
              value="0" 
              icon={Clock} 
              loading={loading}
            />
          </div>

          {/* Placeholder for future sections */}
          {!loading && employees.length === 0 && (
            <div className="bg-white border rounded-lg p-12 text-center">
              <Users className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No employee data available.</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin text-gray-400" />
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default HrDashboard;