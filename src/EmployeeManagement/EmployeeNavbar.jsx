import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell, RefreshCw } from 'lucide-react';
import logo from '../images/logo.png';

const EmployeeNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: 'Employee', role: 'Staff' });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const employeeId = localStorage.getItem('employeeId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // 1. Identity Logic
    const storedName = localStorage.getItem('name');
    const storedRoles = localStorage.getItem('roles');

    let displayRole = 'Employee';
    try {
      if (storedRoles) {
        const rolesArray = JSON.parse(storedRoles.replace(/'/g, '"'));
        displayRole = employeeId ? `${employeeId} | ${rolesArray[0].replace('ROLE_', '')}` : 'Employee';
      }
    } catch (e) { console.error(e); }

    setUserInfo({ name: storedName || 'Employee', role: displayRole });

    // 2. Initial Notification Fetch
    if (employeeId) fetchNotifications();
  }, [employeeId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.wemis.in/api/notifications?employeeId=${employeeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex justify-between items-center">

            {/* Logo Area */}
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-20 " />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-10">

              {/* Notifications Link */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-400 hover:text-black transition-colors relative pt-1"
                >
                  <Bell size={16} strokeWidth={1.5} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-black rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-6 w-80 bg-white border border-gray-100 shadow-2xl rounded-sm z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Inbox</span>
                      <button onClick={fetchNotifications} disabled={loading}>
                        <RefreshCw size={10} className={`${loading ? 'animate-spin' : ''} text-gray-400`} />
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notif, idx) => (
                          <div key={idx} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <p className="text-[11px] text-gray-700 leading-relaxed font-light">{notif.message || notif.text}</p>
                            <p className="text-[9px] text-gray-300 mt-2 uppercase tabular-nums tracking-widest">
                              {notif.createdAt || 'Archive Log'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center text-[10px] text-gray-300 uppercase tracking-widest italic font-light">
                          No Pending Alerts
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Identity Segment */}
              <div className="flex items-center gap-6 border-l border-gray-100 pl-10">
                <div className="text-right">
                  <p className="text-[11px] font-medium tracking-tight text-gray-900">{userInfo.name}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-0.5">{userInfo.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-200">
                  <User size={14} strokeWidth={1.5} className=' text-gray-600' />
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-gray-100
             bg-gradient-to-br from-gray-700 to-gray-800
             transition-all duration-300 rounded-sm"
              >
                Log Out
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-400"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-8 space-y-10 animate-in fade-in duration-300">
            <div>
              <p className="text-[9px] text-gray-300 uppercase tracking-widest mb-4">Account</p>
              <h3 className="text-lg font-light">{userInfo.name}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{userInfo.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-4 text-[10px] font-bold text-red-500 border border-red-50 uppercase tracking-widest"
            >
              Terminate Session
            </button>
          </div>
        )}
      </nav>

      {/* Placeholder to prevent layout jump */}
      <div className="h-16"></div>
    </>
  );
};

export default EmployeeNavbar;