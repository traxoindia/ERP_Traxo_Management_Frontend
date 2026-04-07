import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Briefcase,
  Award,
  Target,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  BarChart3,
  Activity
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
    { id: 1, user: "Rohan Mehra", action: "Applied for Sick Leave", time: "2 hours ago", status: "Pending", statusColor: "text-orange-600 bg-orange-50" },
    { id: 2, user: "Priya Sharma", action: "Submitted Expense Report", time: "4 hours ago", status: "Review", statusColor: "text-blue-600 bg-blue-50" },
    { id: 3, user: "Arjun Singh", action: "Updated Profile Photo", time: "Yesterday", status: "Completed", statusColor: "text-green-600 bg-green-50" },
    { id: 4, user: "Neha Gupta", action: "Requested WFH", time: "Yesterday", status: "Approved", statusColor: "text-green-600 bg-green-50" },
    { id: 5, user: "Vikram Rathore", action: "Submitted Timesheet", time: "Yesterday", status: "Pending", statusColor: "text-orange-600 bg-orange-50" },
  ];

  const quickActions = [
    { icon: Users, label: "Add Employee", color: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
    { icon: FileText, label: "Leave Requests", color: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-600" },
    { icon: IndianRupee, label: "Expenses", color: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-600" },
    { icon: Calendar, label: "Attendance", color: "bg-green-500", bg: "bg-green-50", text: "text-green-600" },
    { icon: Briefcase, label: "Projects", color: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600" },
    { icon: Award, label: "Reviews", color: "bg-pink-500", bg: "bg-pink-50", text: "text-pink-600" },
  ];

  const departmentStats = [
    { name: "Engineering", count: 45, percentage: 36, color: "bg-blue-500" },
    { name: "Sales", count: 28, percentage: 23, color: "bg-green-500" },
    { name: "Marketing", count: 22, percentage: 18, color: "bg-orange-500" },
    { name: "HR", count: 15, percentage: 12, color: "bg-purple-500" },
    { name: "Finance", count: 14, percentage: 11, color: "bg-indigo-500" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Content - Fixed height with overflow-y auto for content only */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 text-sm mt-1">Real-time insights into your workforce and operations</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
                <Calendar className="h-4 w-4" />
                Jan 2024 - Dec 2024
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm shadow-indigo-200 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.color} ${stat.bg}`}>
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

      
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;