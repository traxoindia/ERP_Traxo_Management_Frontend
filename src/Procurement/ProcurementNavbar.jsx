import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileCheck, 
  BarChart3, 
  LogOut, 
  PackageSearch,
  PlusCircle 
} from "lucide-react";
import CreateRequirementModal from "./CreateRequirementModal";
import toast, { Toaster } from "react-hot-toast"; 

const ProcurementNavbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/departments/procurement/login");
    toast.success("Logged out successfully!");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Left: Brand */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/dashboard")}
            >
              <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-3 transition-transform">
                <PackageSearch className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ProcureHub
              </span>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/dashboard" className={linkClasses}>
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink to="/Vendors" className={linkClasses}>
                <FileCheck size={18} />
                Vendors
              </NavLink>

              <NavLink to="/reports" className={linkClasses}>
                <BarChart3 size={18} />
                Reports
              </NavLink>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Create Requirement Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Create Requirement</span>
              </button>

              <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal Component */}
      <CreateRequirementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProcurementNavbar;