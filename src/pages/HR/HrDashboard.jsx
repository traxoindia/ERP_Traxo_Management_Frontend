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
  const [leaves, setLeaves] = useState([]); // New state for leaves
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("accessToken");

  const fetchData = async () => {
    setLoading(true);
    const token = getToken();

    try {
      // Run both fetches in parallel for better performance
      const [empRes, leaveRes] = await Promise.all([
        fetch('https://api.wemis.in/api/hr/employees/status/CURRENT', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        }),
        fetch('https://api.wemis.in/api/leave/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (empRes.status === 403 || leaveRes.status === 403) {
        alert('Session expired. Please login again.');
        return;
      }

      const empData = await empRes.json();
      const leaveData = await leaveRes.json();

      setEmployees(Array.isArray(empData) ? empData : (empData.data || []));
      setLeaves(Array.isArray(leaveData) ? leaveData : (leaveData.data || []));
      
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logic for Stat Cards
  const totalStaff = employees.length;
  const onDutyCount = employees.filter(emp => emp.onDuty === true).length;
  
  // Filter for pending leaves if you only want to show requests needing action
  const leaveRequestsCount = leaves.filter(l => l.status === 'PENDING').length || leaves.length;

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
            <Link to="/employees" className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95">
              <Plus size={14} />
              Add Employee
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Staff" value={totalStaff} icon={Users} loading={loading} />
            <StatCard title="On Duty" value={onDutyCount} icon={UserCheck} loading={loading} />
            <StatCard title="Leave Requests" value={leaveRequestsCount} icon={Clock} loading={loading} />
          </div>

          {/* Loading & Empty States */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader className="animate-spin text-gray-400" /></div>
          ) : (
            employees.length === 0 && (
              <div className="bg-white border rounded-lg p-12 text-center">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No employee data available.</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default HrDashboard;