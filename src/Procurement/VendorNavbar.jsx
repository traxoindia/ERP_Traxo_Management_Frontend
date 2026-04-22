import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function VendorNavbar({ vendorName = "Vendor Portal" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // 1. Clear local storage/session
    localStorage.removeItem('vendorToken');
    // 2. Redirect to login
    navigate('/vendor-login');
  };

  // Helper to style active links
  const linkStyle = (path) => 
    location.pathname === path
      ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold"
      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors";

  const mobileLinkStyle = (path) =>
    location.pathname === path
      ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/vendor-dashboard" className="flex-shrink-0 flex items-center">
              <div className="h-9 w-44 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-indigo-200 shadow-lg">
               Traxo Vendors
              </div>
             
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8 h-full">
              <Link to="/Procurement-requirements" className={linkStyle('/Procurement-requirements')}>
                Procurement Requirements
              </Link>
              <Link to="/my-products" className={linkStyle('/my-products')}>
                My Products
              </Link>
            </div>
          </div>

          {/* Right Side: Profile & Actions */}
          <div className="hidden md:ml-6 md:flex md:items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">Vendor Admin</p>
                  <p className="text-xs text-gray-500 mt-1">Verified Partner</p>
                </div>
                <img
                  className="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all p-0.5"
                  src={`https://ui-avatars.com/api/?name=Vendor&background=4f46e5&color=fff&bold=true`}
                  alt="Profile"
                />
              </button>

              {/* Desktop Dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 transform transition-all">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900 font-bold">Account Settings</p>
                    <p className="text-xs text-gray-500 truncate">vendor@business.com</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Your Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">Company Details</Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-down">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/vendor-dashboard" 
              className={mobileLinkStyle('/vendor-dashboard')}
              onClick={() => setIsMenuOpen(false)}
            >
              Procurement Requirements
            </Link>
            <Link 
              to="/my-products" 
              className={mobileLinkStyle('/my-products')}
              onClick={() => setIsMenuOpen(false)}
            >
              My Products
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Vendor&background=4f46e5&color=fff" alt="" />
              </div>
              <div className="ml-3">
                <div className="text-base font-bold text-gray-800">Vendor Admin</div>
                <div className="text-sm font-medium text-gray-500">vendor@business.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100">Your Profile</Link>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default VendorNavbar;