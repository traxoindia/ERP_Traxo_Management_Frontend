import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  Users, 
  Briefcase, 
  LayoutDashboard, 
  ShieldCheck, 
  Globe, 
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Settings,
  Landmark,
  ShoppingCart,
  Code,
  Factory,
  Truck
} from 'lucide-react';
import logo from "../images/logo.png";
import MainNavbar from './Career/MainNavbar';

const menuData = {

  Traxo: {
    label: "",
    items: [
      { name: "HR Department", icon: <Users size={24} />, path: "/login" },
      { name: "Finance Department", icon: <Landmark size={24} />, path: "/departments/finance" },
      { name: "Procurement Department", icon: <ShoppingCart size={24} />, path: "/departments/procurement" },
      { name: "Software Department", icon: <Code size={24} />, path: "/departments/software" },
      { name: "Production Department", icon: <Factory size={24} />, path: "/departments/production" },
       { name: "Employee Login", icon: <Factory size={24} />, path: "/employee-login" },
        { name: "Wemis", icon: <Truck size={24} />, path: "https://wemis.in", isExternal: true },
         { name: "Visit Us", icon: <MapPin size={24} />, path: "https://traxoindia.com", isExternal: true },
    ],
  },

};

const LandingPage = () => {
  const navigate = useNavigate();

const handleNavigation = (item) => {
    if (item.isExternal) {
      // Standard way to redirect to an external site in the same tab
      window.location.href = item.path;
      
      // OR use this if you want it to open in a new tab:
      // window.open(item.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.path);
    }
  };

  // Color schemes for different sections
  const getColorScheme = (section) => {
    const schemes = {
      departments: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        hover: "hover:bg-blue-100"
      },
      vehicle: {
        bg: "bg-green-50",
        text: "text-green-600",
        hover: "hover:bg-green-100"
      },
      about: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        hover: "hover:bg-purple-100"
      }
    };
    return schemes[section] || schemes.departments;
  };

  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
         

          {/* Departments Section */}
          {Object.entries(menuData).map(([key, section]) => (
            <div key={key} className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">
                {section.label}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {section.items.map((item, index) => {
                  const colorScheme = getColorScheme(key);
                  return (
                    <div 
                      key={index}
                      onClick={() => handleNavigation(item)}
                      className="group cursor-pointer"
                    >
                      <div className={`${colorScheme.bg} ${colorScheme.text} ${colorScheme.hover} rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-md`}>
                        <div className="mb-2">
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
        </main>
      </div>
    </>
  );
};

export default LandingPage;