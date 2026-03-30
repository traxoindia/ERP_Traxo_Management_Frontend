import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  Plus,
  CalendarDays   // ✅ NEW
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false); // ✅ NEW
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePostJob = () => navigate("/jobs/post");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-6 py-2.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && toggleMobileSidebar && (
            <button onClick={toggleMobileSidebar} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
              <Menu size={20} />
            </button>
          )}

          <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-40 md:w-64 lg:w-80">
            <Search className="text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">

        

          {/* Post Job */}
          <button
            onClick={handlePostJob}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold"
          >
            <Plus size={14} />
            <span className="hidden md:inline">Post Position</span>
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-900 relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 bg-blue-600 w-1.5 h-1.5 rounded-full" 
              
            />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
                HR
              </div>
              <ChevronDown size={14} className={`transition ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-20 p-1.5"
                  >
                    <button className="dropdown-item"><User size={14} /> My Profile</button>
                    <button className="dropdown-item"><Settings size={14} /> Settings</button>

                    <div className="h-px bg-gray-100 my-1" />

                    <button onClick={handleLogout} className="dropdown-item text-red-500">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ✅ Reusable dropdown style */}
      <style jsx>{`
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 10px;
          font-size: 13px;
          color: #4b5563;
          border-radius: 8px;
        }
        .dropdown-item:hover {
          background: #f9fafb;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;