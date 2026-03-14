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
    className={`flex items-center p-3 mb-1 rounded-lg cursor-pointer transition-all relative group ${
      active 
        ? "bg-black text-white" 
        : "text-gray-500 hover:bg-gray-100 hover:text-black"
    }`}
  >
    <div className="flex items-center justify-center min-w-[24px]">
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </div>

    <AnimatePresence>
      {(isMobile || !isCollapsed) && (
        <motion.span
          initial={!isMobile ? { opacity: 0, x: -5 } : false}
          animate={!isMobile ? { opacity: 1, x: 0 } : false}
          exit={!isMobile ? { opacity: 0, x: -5 } : false}
          className="ml-4 font-medium text-sm tracking-tight whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {isCollapsed && !isMobile && !active && (
      <div className="absolute left-14 bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap uppercase tracking-widest">
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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
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
    if (isMobile) setIsMobileOpen(false);
  };

  const MobileOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsMobileOpen(false)}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
    />
  );

  return (
    <>
      {/* Mobile Floating Menu Toggle */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 md:hidden bg-black text-white p-4 rounded-full shadow-2xl"
        >
          <Menu size={24} />
        </button>
      )}

      <AnimatePresence>
        {isMobile && isMobileOpen && <MobileOverlay />}
      </AnimatePresence>

      <motion.div
        animate={isMobile 
          ? { x: isMobileOpen ? 0 : -300 } 
          : { width: isCollapsed ? "80px" : "260px" }
        }
        className={`bg-white border-r border-gray-200 flex flex-col p-4 z-50 ${
          isMobile ? 'fixed inset-y-0 left-0' : 'sticky top-0 h-screen'
        }`}
        style={{ width: isMobile ? '260px' : undefined }}
      >
        {/* Header */}
        <div className={`flex items-center mb-8 ${!isMobile && isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            
            {(isMobile || !isCollapsed) && (
              <span className="text-lg font-black tracking-tighter text-black uppercase">Traxo</span>
            )}
          </div>

          {!isMobile && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
            >
              {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}

          {isMobile && (
            <button onClick={() => setIsMobileOpen(false)} className="text-gray-400">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-1">
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

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            path="/settings" 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            active={location.pathname === "/settings"} 
            onClick={handleItemClick} 
          />
          
          {!isCollapsed && !isMobile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Usage</span>
                <span className="text-[10px] font-bold text-black">80%</span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className="bg-black h-full w-[80%]" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;