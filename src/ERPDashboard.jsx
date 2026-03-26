import React, { useState } from "react";
import { 
  LayoutDashboard, Users, Truck, Factory, 
  Settings, Bell, Search, Filter, 
  MoreVertical, ArrowUpRight, ArrowDownRight, 
  Plus, Download, CheckCircle, Clock
} from "lucide-react";
import { motion } from "framer-motion";

const ERPDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Mock Data for KPI Cards
  const stats = [
    { label: "Active Fleet", value: "142", change: "+12%", trend: "up", icon: <Truck className="text-blue-600" /> },
    { label: "Pending Orders", value: "38", change: "-5%", trend: "down", icon: <Clock className="text-orange-600" /> },
    { label: "Production Yield", value: "98.2%", change: "+2%", trend: "up", icon: <Factory className="text-emerald-600" /> },
    { label: "Total Revenue", value: "₹4.2M", change: "+18%", trend: "up", icon: <CheckCircle className="text-purple-600" /> },
  ];

  // Mock Data for Table
  const recentOrders = [
    { id: "ORD-7210", client: "Reliance Ind.", status: "In Transit", amount: "₹45,000", date: "24 Mar 2026" },
    { id: "ORD-7211", client: "Tata Motors", status: "Delivered", amount: "₹1,20,000", date: "23 Mar 2026" },
    { id: "ORD-7212", client: "Adani Group", status: "Pending", amount: "₹82,500", date: "23 Mar 2026" },
    { id: "ORD-7213", client: "Mahindra", status: "Cancelled", amount: "₹12,000", date: "22 Mar 2026" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">T</div>
          <span className="text-xl font-black text-white tracking-tighter">TRAXO ERP</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <SidebarLink icon={<Users size={20}/>} label="HR Management" active={activeTab === "HR"} onClick={() => setActiveTab("HR")} />
          <SidebarLink icon={<Truck size={20}/>} label="Fleet & Logistics" active={activeTab === "Fleet"} onClick={() => setActiveTab("Fleet")} />
          <SidebarLink icon={<Factory size={20}/>} label="Production" active={activeTab === "Production"} onClick={() => setActiveTab("Production")} />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Support</div>
          <SidebarLink icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">AD</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 truncate">admin@traxo.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records, vehicles, or staff..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
              <Plus size={18} />
              <span>New Entry</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <section className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Enterprise Overview</h1>
              <p className="text-slate-500 text-sm">Real-time operational data across all departments.</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Filter size={16} />
                <span>Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
                  <div className={`flex items-center text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* RECENT ACTIVITY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recent Logistics Orders</h3>
              <button className="text-blue-600 text-sm font-bold hover:underline">View All Orders</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{order.client}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4 text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded text-slate-400">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

// UI Helper Components
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

const StatusBadge = ({ status }) => {
  const styles = {
    "In Transit": "bg-blue-50 text-blue-700 border-blue-100",
    "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Pending": "bg-orange-50 text-orange-700 border-orange-100",
    "Cancelled": "bg-slate-50 text-slate-700 border-slate-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default ERPDashboard;