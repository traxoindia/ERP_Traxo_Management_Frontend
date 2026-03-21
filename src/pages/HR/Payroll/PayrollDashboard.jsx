import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';

const PayrollDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [selectedYear, setSelectedYear] = useState('2026');

  const stats = [
    { 
      label: 'Total Payroll', 
      value: '₹4,52,890', 
      change: '+5.2%', 
      trend: 'up',
      icon: DollarSign,
      subtext: 'vs last month'
    },
    { 
      label: 'Active Employees', 
      value: '45', 
      change: '+2', 
      trend: 'up',
      icon: Users,
      subtext: 'this month'
    },
    { 
      label: 'Pending Approvals', 
      value: '12', 
      change: '-3', 
      trend: 'down',
      icon: Clock,
      subtext: 'needs review'
    },
    { 
      label: 'Avg. Salary', 
      value: '₹42,500', 
      change: '+3.1%', 
      trend: 'up',
      icon: TrendingUp,
      subtext: 'per employee'
    },
  ];

  const recentPayrolls = [
    { id: 1, month: 'March 2026', processed: '45/45', status: 'completed', date: '2026-03-31', amount: '₹4,52,890' },
    { id: 2, month: 'February 2026', processed: '45/45', status: 'completed', date: '2026-02-28', amount: '₹4,48,200' },
    { id: 3, month: 'January 2026', processed: '44/45', status: 'completed', date: '2026-01-31', amount: '₹4,41,500' },
    { id: 4, month: 'December 2025', processed: '45/45', status: 'completed', date: '2025-12-31', amount: '₹4,55,800' },
  ];

  const departmentWise = [
    { dept: 'Engineering', employees: 15, payroll: '₹7,25,000', avg: '₹48,333', percentage: 32 },
    { dept: 'Sales', employees: 12, payroll: '₹5,42,000', avg: '₹45,167', percentage: 24 },
    { dept: 'Marketing', employees: 8, payroll: '₹3,42,500', avg: '₹42,812', percentage: 15 },
    { dept: 'HR', employees: 6, payroll: '₹2,48,500', avg: '₹41,417', percentage: 11 },
    { dept: 'Finance', employees: 4, payroll: '₹1,94,890', avg: '₹48,722', percentage: 18 },
  ];

  const upcomingPayroll = {
    month: 'April 2026',
    dueDate: '2026-04-05',
    employees: 45,
    estimatedAmount: '₹4,65,000',
    status: 'pending'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Payroll Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor payroll operations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <Calendar size={16} className="ml-3 text-gray-400" />
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 bg-transparent text-sm focus:outline-none"
              >
                <option value="2026-03">March 2026</option>
                <option value="2026-02">February 2026</option>
                <option value="2026-01">January 2026</option>
                <option value="2025-12">December 2025</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <Download size={14} />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 p-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-medium text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight size={14} className="text-gray-700" />
                    ) : (
                      <ArrowDownRight size={14} className="text-gray-500" />
                    )}
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{stat.subtext}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Icon size={20} className="text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 grid grid-cols-3 gap-4">
        {/* Department-wise Breakdown */}
        <div className="col-span-2 border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Department-wise Payroll</h3>
            <button className="text-xs text-gray-500 hover:text-gray-900">View Details →</button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="text-left py-2">Department</th>
                  <th className="text-left">Employees</th>
                  <th className="text-left">Total Payroll</th>
                  <th className="text-left">Average</th>
                  <th className="text-left">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {departmentWise.map((dept, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 font-medium">{dept.dept}</td>
                    <td>{dept.employees}</td>
                    <td>{dept.payroll}</td>
                    <td>{dept.avg}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{dept.percentage}%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-900 rounded-full"
                            style={{ width: `${dept.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Payroll & Quick Actions */}
        <div className="col-span-1 space-y-4">
          {/* Upcoming Payroll Card */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Next Payroll</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Month</span>
                <span className="font-medium">{upcomingPayroll.month}</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Due Date</span>
                <span className="font-medium">{upcomingPayroll.dueDate}</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Employees</span>
                <span className="font-medium">{upcomingPayroll.employees}</span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-gray-200 mt-2">
                <span className="text-sm text-gray-600">Est. Amount</span>
                <span className="font-medium text-gray-900">{upcomingPayroll.estimatedAmount}</span>
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
              Process Payroll
            </button>
          </div>

          {/* Recent Payrolls */}
          <div className="border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Recent Payrolls</h3>
            </div>
            <div className="p-2">
              {recentPayrolls.slice(0, 3).map(pr => (
                <div key={pr.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pr.month}</p>
                    <p className="text-xs text-gray-500">{pr.amount}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {pr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;