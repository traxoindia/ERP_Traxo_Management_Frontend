import React, { useState, useEffect } from "react";
import { Users, UserCheck, Clock, Plus, Loader } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, loading, color }) => {
  const colors = {
    blue: "from-yellow-500 to-black",
    green: "from-black to-yellow-500",
    purple: "from-yellow-500 to-blue-900",
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg p-5 font-semibold h-24 text-white
        bg-gradient-to-br ${colors[color]}
        shadow-md hover:shadow-xl transition-all duration-300
        hover:-translate-y-1
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-20 blur-2xl bg-white"></div>

      <div className="relative flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">{title}</p>

          {loading ? (
            <div className="h-8 w-16 bg-white/30 animate-pulse rounded mt-2" />
          ) : (
            <h2 className="text-3xl font-bold mt-1">{value}</h2>
          )}
        </div>

        <div className="bg-white/20 p-3 rounded-xl">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

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
  <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-yellow-10">
    <Sidebar />

    <div className="flex-1 flex flex-col">
      <Navbar />

      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              HR Dashboard 
            </h1>
            <p className="text-gray-500 mt-1">
              Overview for March 2026
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Staff"
            value={totalStaff}
            icon={Users}
            loading={loading}
            color="blue"
          />
          <StatCard
            title="On Duty"
            value={onDutyCount}
            icon={UserCheck}
            loading={loading}
            color="green"
          />
          <StatCard
            title="Leave Requests"
            value={leaveRequestsCount}
            icon={Clock}
            loading={loading}
            color="purple"
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader className="animate-spin text-gray-400" size={28} />
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              No employee data available
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Quick Insight
            </h2>
            <p className="text-gray-500 text-sm">
              You have {onDutyCount} employees currently on duty and{" "}
              {leaveRequestsCount} leave requests pending.
            </p>
          </div>
        )}
      </main>
    </div>
  </div>
);
};

export default HrDashboard;