import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CalendarCheck, Briefcase,
  FileText, CreditCard, Settings, ChevronLeft, Menu,
  X, ChevronDown, Receipt, DollarSign, Calculator,
  UserCircle, Wallet, Download, BarChart,
  UserCircle2,
  PlayCircleIcon,
  GitPullRequest,
  BarChart3
} from "lucide-react";

const SidebarItem = ({
  icon: Icon, label, path, active, isCollapsed, onClick, isMobile, subItems
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasSubItems = subItems && subItems.length > 0;

  // Sync open state if a child is active
  useEffect(() => {
    if (active && hasSubItems) setIsOpen(true);
  }, [active, hasSubItems]);

  const handleToggle = (e) => {
    if (hasSubItems) {
      e.stopPropagation();
      setIsOpen(!isOpen);
    } else {
      onClick(path);
    }
  };

  // Check if any sub-item is active
  const isSubItemActive = (subPath) => location.pathname === subPath;

  return (
    <div className="mb-1">
      <motion.div
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
        className={`
    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
    transition-all duration-300 ease-out
    ${active && !hasSubItems
            ? "bg-gradient-to-r from-black via-gray-800 to-yellow-500 text-white"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100 hover:text-black"}
  `}
      >
        {/* Glow Effect */}
        {active && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-black via-yellow-500 to-yellow-500 blur-md opacity-30 -z-10"></div>
        )}

        {/* Icon */}
        <div className="flex items-center justify-center min-w-[24px]">
          <Icon
            size={20}
            strokeWidth={active ? 2.5 : 2}
            className={`
        transition-all duration-300
        ${active ? "text-white" : "group-hover:text-black"}
      `}
          />
        </div>

        {/* Label + Chevron */}
        <AnimatePresence mode="wait">
          {(isMobile || !isCollapsed) && (
            <motion.div
              key="label"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between flex-1"
            >
              <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
                {label}
              </span>

              {hasSubItems && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
              ml-2 transition-colors
              ${active ? "text-white" : "text-gray-500 hover:text-purple-600"}
            `}
                >
                  <ChevronDown size={14} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        {isCollapsed && !isMobile && (
          <div
            className="
        absolute left-14 top-1/2 -translate-y-1/2
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        text-white text-xs px-3 py-1.5 rounded-md
        opacity-0 group-hover:opacity-100
        transition-all duration-200
        pointer-events-none z-50 whitespace-nowrap
        shadow-xl
      "
          >
            {label}
          </div>
        )}
      </motion.div>

      {/* Dropdown Sub-items */}
      <AnimatePresence>
        {isOpen && (isMobile || !isCollapsed) && hasSubItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-9 mt-1 space-y-1"
          >
            {subItems.map((sub) => (
              <div
                key={sub.path}
                onClick={() => onClick(sub.path)}
                className={`p-2 text-sm rounded-md cursor-pointer transition-colors flex items-center gap-2 ${isSubItemActive(sub.path)
                  ? "text-black font-bold bg-gray-500"
                  : "text-gray-900 hover:text-red-600 hover:bg-gray-50"
                  }`}
              >
                {sub.icon && <sub.icon size={14} />}
                {sub.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/hr-dashboard"
    },
    {
      label: "Employees",
      icon: Users,
      path: "/employees"
    },
    {
      label: "Attendance",
      icon: CalendarCheck,
      path: "/attendance",
      subItems: [

        { label: "Employee Attendance", path: "/attendance", icon: Users },
        { label: "Leave Management", path: "/hr-Leave-management", icon: FileText },

      ]
    },
    {
      label: "Recruitment",
      icon: Briefcase,
      path: "/jobs",
      subItems: [
        { label: "Post Job", path: "/jobs/post", icon: Briefcase },
        { label: "Onboarding", path: "/jobs/onboarding", icon: GitPullRequest },
        { label: "Verification", path: "/jobs/Verification", icon: BarChart3 },
        { label: "Interviews", path: "/jobs/interviews", icon: UserCircle },
      ]
    },
    {
      label: "Payroll",
      icon: CreditCard,
      path: "/payroll",
      subItems: [
        { label: "Payroll", path: "/payroll/page", icon: LayoutDashboard },

      ]
    },
    {
      label: "Reports",
      icon: FileText,
      path: "/reports",
      subItems: [
        { label: "Attendence Report", path: "/reports/attendence", icon: LayoutDashboard },
        { label: "Payroll Report", path: "/reports/payroll", icon: LayoutDashboard },
        { label: "Leave Report", path: "/reports/leave", icon: LayoutDashboard },
        { label: "Hiring Report", path: "/reports/hiring", icon: LayoutDashboard },
        { label: "Employee Summary", path: "/reports/employee-summary", icon: LayoutDashboard },

      ]

    },
  ];

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) setIsMobileOpen(false);
  };

  // Check if any main item is active
  const isItemActive = (item) => {
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return location.pathname === item.path;
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
      {isMobile && !isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 md:hidden bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-colors"
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
        className={`bg-white  border-r border-gray-200 flex flex-col p-4 z-50 ${isMobile ? 'fixed inset-y-0 left-0 shadow-2xl' : 'sticky top-0 h-screen'
          }`}
        style={{ width: isMobile ? '260px' : undefined }}
      >
        <div className={`flex items-center mb-8 ${!isMobile && isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            {(isMobile || !isCollapsed) && (
              <div className="flex items-center gap-2">

                <span className="text-lg font-black tracking-tighter text-black">TRAXO</span>
              </div>
            )}
            {isCollapsed && !isMobile && (
              <div className="">

              </div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md text-black hover:bg-gray-100  transition-colors"
            >
              {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-md text-black hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-1  overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              subItems={item.subItems}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              active={isItemActive(item)}
              onClick={handleItemClick}
            />
          ))}
        </div>

       
      </motion.div>
    </>
  );
}

export default Sidebar;