import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, LayoutDashboard, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
// import { getUserSummary } from "../services/dashboardService";

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getUserSummary();
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <>
        <Navbar/>
    
    <div className="p-6 bg-[#f4f7fe] min-h-screen font-sans">
    
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <LayoutDashboard className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back to your Traxo account.</p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Profile Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg"><User size={20} className="text-gray-600" /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                    <p className="text-gray-700 font-medium">{userData?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg"><Shield size={20} className="text-gray-600" /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Account Role</p>
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">
                      {userData?.roles?.[0] || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-[2rem] shadow-xl text-white">
              <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-4">System Status</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold">Active</p>
                <p className="text-blue-100 text-sm opacity-80">Your account is in good standing with the AWS cloud backend.</p>
              </div>
              <div className="mt-8 pt-4 border-t border-blue-400/30">
                <button className="text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all">
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
    </>
  );
}

export default UserDashboard;