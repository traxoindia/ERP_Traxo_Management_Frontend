import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, CalendarCheck, Briefcase, 
  FileText, CreditCard, Settings, ChevronLeft, Menu,
  X
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, path, active, isCollapsed, onClick, isMobile }) => (
  <motion.div
    onClick={() => onClick(path)}
    className={`flex items-center p-3.5 mb-2 rounded-xl cursor-pointer transition-all relative group ${
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
    }`}
  >
    <div className="flex items-center justify-center min-w-[24px]">
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    </div>

    {/* Label - Always visible on mobile, animated on desktop */}
    <AnimatePresence>
      {(isMobile || !isCollapsed) && (
        <motion.span
          initial={!isMobile ? { opacity: 0, x: -10 } : false}
          animate={!isMobile ? { opacity: 1, x: 0 } : false}
          exit={!isMobile ? { opacity: 0, x: -10 } : false}
          className="ml-4 font-bold text-sm tracking-wide whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {/* Tooltip for Collapsed State (Desktop only) */}
    {isCollapsed && !isMobile && !active && (
      <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </motion.div>
);

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false); // Reset to expanded on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/hr-dashboard" },
    { label: "Employees", icon: Users, path: "/employees" },
    { label: "Attendance", icon: CalendarCheck, path: "/attendance" },
    { label: "Recruitment", icon: Briefcase, path: "/recruitment" },
    { label: "Payroll", icon: CreditCard, path: "/payroll" },
    { label: "Reports", icon: FileText, path: "/reports" },
  ];

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsMobileOpen(false)}
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
    />
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && <MobileOverlay />}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isMobile ? isMobileOpen : true) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={isMobile ? { x: 0 } : { width: isCollapsed ? "90px" : "280px" }}
            exit={isMobile ? { x: -300 } : false}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${
              isMobile 
                ? 'fixed left-0 top-0 h-screen z-50' 
                : 'sticky top-0'
            } bg-white border-r border-gray-100 flex flex-col p-4 shadow-sm overflow-y-auto`}
            style={{ 
              width: isMobile ? '280px' : (isCollapsed ? "90px" : "280px"),
              minHeight: '100vh'
            }}
          >
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors z-10"
              >
                <X size={20} />
              </button>
            )}

            {/* Toggle & Logo Header */}
            <div className={`flex items-center mb-10 ${!isMobile && (isCollapsed ? "justify-center" : "justify-between px-2")}`}>
              {/* Logo - Always visible on mobile, conditional on desktop */}
              {(isMobile || !isCollapsed) && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <span className="text-white font-black text-xl italic">T</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800 tracking-tight">Traxo</h1>
                </motion.div>
              )}
              
              {/* Desktop Toggle Button */}
              {!isMobile && (
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
              )}
            </div>

            {/* Navigation Section */}
            <div className="flex-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  {...item}
                  isCollapsed={isCollapsed}
                  isMobile={isMobile}
                  active={location.pathname === item.path}
                  onClick={handleItemClick}
                />
              ))}
            </div>

            {/* Settings Bottom */}
            <div className="pt-4 border-t border-gray-50">
              <SidebarItem 
                icon={Settings} 
                label="Settings" 
                path="/settings" 
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                active={location.pathname === "/settings"} 
                onClick={handleItemClick} 
              />
              
              {/* Storage Widget - Hidden when collapsed or on mobile */}
              {!isCollapsed && !isMobile && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 bg-blue-50 rounded-2xl p-4 text-center"
                >
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-tighter">75% Capacity</p>
                  <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "75%" }} 
                      className="bg-blue-600 h-full rounded-full" 
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;