import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown,
  Menu,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePostJob = () => {
    navigate("/jobs/post");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-6 py-2.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Search */}
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && toggleMobileSidebar && (
            <button 
              onClick={toggleMobileSidebar} 
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Search - Hidden on very small screens, compact on mobile */}
          <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-40 md:w-64 lg:w-80 group focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200 transition-all">
            <Search className="text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
          
          {/* Mobile Search Icon only (for very small screens) */}
          {!isMobile ? null : (
            <button className="sm:hidden p-2 text-gray-400">
              <Search size={18} />
            </button>
          )}
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-1.5 md:gap-3">
          
          {/* Post Position - Navigates to /jobs/post */}
          <button 
            onClick={handlePostJob}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} />
            <span className="hidden md:inline">Post Position</span>
          </button>

          <div className="h-4 w-[1px] bg-gray-200 mx-1 hidden md:block" />

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 bg-blue-600 w-1.5 h-1.5 rounded-full border border-white" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative ml-1">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-all"
            >
              <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
                HR
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform hidden xs:block ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Click overlay to close */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-1.5"
                  >
                    <div className="px-3 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">Saleena Patra</p>
                      <p className="text-[10px] text-gray-500 truncate">hr@traxoindia.in</p>
                    </div>
                    
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <User size={14} /> My Profile
                    </button>
                    
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings size={14} /> Settings
                    </button>

                    <div className="h-px bg-gray-100 my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;