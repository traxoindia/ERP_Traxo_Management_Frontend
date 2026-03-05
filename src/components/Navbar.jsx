import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown,
  Calendar,
  HelpCircle,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Mobile Search Modal
  const MobileSearchModal = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-white z-50 p-4 md:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none ml-3 text-sm w-full text-gray-700"
            autoFocus
          />
        </div>
        <button 
          onClick={() => setIsMobileSearchOpen(false)}
          className="p-3 text-gray-600 font-medium"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <nav className="bg-white border-b border-gray-100 px-4 md:px-6 py-2 md:py-3 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Mobile Menu Button & Search */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          {isMobile && toggleMobileSidebar && (
            <button
              onClick={toggleMobileSidebar}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          )}

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-64 lg:w-96 group focus-within:bg-white focus-within:border-blue-400 transition-all">
            <Search className="text-gray-400 group-focus-within:text-blue-500" size={18} />
            <input 
              type="text" 
              placeholder="Search employees, records or reports..." 
              className="bg-transparent border-none outline-none ml-3 text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Mobile Search Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Search size={22} />
            </button>
          )}
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* System Info / Date - Hidden on mobile */}
          <div className="hidden lg:flex items-center text-gray-500 gap-2 border-r border-gray-200 pr-4 mr-2">
            <Calendar size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Support Icon - Hidden on very small screens */}
          <button className="hidden sm:block p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
            <HelpCircle size={22} />
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors relative">
            <Bell size={22} />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                {notifications}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative ml-1 md:ml-2">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 md:gap-3 p-1 hover:bg-gray-50 rounded-xl transition-all"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs md:text-sm">
                SH
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-800 leading-none">Shashi</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase mt-1 tracking-tighter">HR Manager</p>
              </div>
              <ChevronDown size={16} className={`hidden sm:block text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-2 overflow-hidden z-50"
                >
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                    <User size={18} />
                    My Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                    <Settings size={18} />
                    System Settings
                  </button>
                  <div className="h-px bg-gray-100 my-2" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {isMobileSearchOpen && <MobileSearchModal />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;