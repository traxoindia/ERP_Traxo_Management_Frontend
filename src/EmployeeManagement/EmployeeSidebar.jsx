import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/employee-dashboard', icon: Home },
    { id: 'attendance', label: 'Attendance', path: '/employee-checkin', icon: Clock },
    { id: 'history', label: 'History', path: '/employee-history', icon: Calendar },
    { id: 'Leave-History', label: 'Leave History', path: '/employee/leave-history', icon: BarChart3 },
    { id: 'Payslips', label: 'Payslips', path: '/employee/payslips', icon: BarChart3 },
    { id: 'profile', label: 'Profile', path: '/employee-profile', icon: User },
    { id: 'settings', label: 'Settings', path: '/employee/settings', icon: Settings },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-500" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-500" />
          )}
        </button>

        <nav className="py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-4 py-3 transition ${
                  isCollapsed ? 'justify-center' : 'justify-start'
                } ${
                  active
                    ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition ${
                  active
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16"></div>

      {/* Content spacer for desktop sidebar */}
      <div className={`hidden md:block transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}></div>
    </>
  );
};

export default EmployeeSidebar;