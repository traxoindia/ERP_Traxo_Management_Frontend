import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  PlayCircle, 
  Users, 
  FileText, 
  Receipt, 
  Wallet,
  Download 
} from 'lucide-react';

const PayrollNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/payroll/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/payroll/salary-structure', label: 'Salary Structure', icon: Calculator },
    { path: '/payroll/processing', label: 'Process Payroll', icon: PlayCircle },
    { path: '/payroll/employee-salaries', label: 'Employee Salaries', icon: Users },
    { path: '/payroll/payslips', label: 'Payslips', icon: FileText },
    { path: '/payroll/tax', label: 'Tax Management', icon: Receipt },
    { path: '/payroll/reimbursements', label: 'Reimbursements', icon: Wallet },
    { path: '/payroll/exports', label: 'Bank Exports', icon: Download },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <div className="flex items-center gap-6 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PayrollNav;