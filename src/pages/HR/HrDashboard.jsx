import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  MoreVertical,
  Calendar
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className={`text-xs mt-2 flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        <TrendingUp size={14} className="mr-1" />
        {trend}% since last month
      </p>
    </div>
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      <Icon size={28} />
    </div>
  </motion.div>
);

const HrDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HR Overview</h1>
              <p className="text-gray-500">Welcome back, Shashi! Here's what's happening today.</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Calendar size={18} />
              Schedule Event
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Total Employees" 
              value="1,240" 
              icon={Users} 
              color="bg-blue-500" 
              trend={12} 
            />
            <StatCard 
              title="Present Today" 
              value="1,185" 
              icon={UserCheck} 
              color="bg-emerald-500" 
              trend={4} 
            />
            <StatCard 
              title="Pending Leaves" 
              value="14" 
              icon={Clock} 
              color="bg-amber-500" 
              trend={-2} 
            />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Recent Employees Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Recently Joined</h3>
                <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Employee</th>
                      <th className="px-6 py-4 font-medium">Department</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: "Ankit Duhai", dept: "UI/UX Design", status: "Active", img: "https://i.pravatar.cc/150?u=1" },
                      { name: "Rahul Sharma", dept: "Development", status: "Onboarding", img: "https://i.pravatar.cc/150?u=2" },
                      { name: "Priya Singh", dept: "Marketing", status: "Active", img: "https://i.pravatar.cc/150?u=3" },
                    ].map((emp, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={emp.img} alt="" className="w-10 h-10 rounded-full border" />
                          <span className="font-semibold text-gray-700">{emp.name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{emp.dept}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            emp.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          <MoreVertical size={18} className="cursor-pointer hover:text-gray-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Task List or Calendar Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-6">Upcoming Holidays</h3>
              <div className="space-y-6">
                {[
                  { title: "Holi Festival", date: "March 14, 2026", color: "bg-purple-500" },
                  { title: "Ramadan Start", date: "March 20, 2026", color: "bg-emerald-500" },
                  { title: "Good Friday", date: "April 03, 2026", color: "bg-blue-500" },
                ].map((holiday, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-2 h-12 rounded-full ${holiday.color}`} />
                    <div>
                      <h4 className="font-bold text-gray-700">{holiday.title}</h4>
                      <p className="text-sm text-gray-400">{holiday.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default HrDashboard;