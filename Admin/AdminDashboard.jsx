import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Employees', value: '124', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Present Today', value: '118', change: '95%', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Leaves', value: '5', change: '-2', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Expense Monthly', value: '₹4.2L', change: '+5%', icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentActivities = [
    { id: 1, user: "Rohan Mehra", action: "Applied for Sick Leave", time: "2 hours ago", status: "Pending" },
    { id: 2, user: "Priya Sharma", action: "Submitted Expense Report", time: "4 hours ago", status: "Review" },
    { id: 3, user: "Arjun Singh", action: "Updated Profile Photo", time: "Yesterday", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Global Navbar */}
      <AdminNavbar />

      {/* 2. Main Content Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time insights into your workforce and operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Calendar className="h-4 w-4" />
              Jan 2024 - Dec 2024
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200">
              Download Report
            </button>
          </div>
        </div>

        {/* 3. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.color} ${stat.bg}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* 4. Content Grid: Activity & Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Table-like List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Recent Activity</h3>
              <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivities.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      {item.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.user}</p>
                      <p className="text-xs text-slate-500">{item.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">{item.time}</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty State / Backend Hint */}
            <div className="p-8 text-center">
               <p className="text-slate-400 text-sm italic">Data automatically syncs with your HRMS backend.</p>
            </div>
          </div>

        

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;