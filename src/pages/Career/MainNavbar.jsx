import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Briefcase, VenusAndMarsIcon } from "lucide-react";
import logo from "../../images/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const MainNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="overflow-hidden">
              <img src={logo} alt="Traxo Logo" className="w-24 object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation - Only Careers & Contact */}
          <div className="hidden md:flex items-center space-x-10 h-full">
          <Link
              to="/Vendors"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 font-semibold text-[13px] uppercase tracking-wider transition-colors"
            >
              <VenusAndMarsIcon size={16} />
              <span>Vendors</span>
            </Link>
            <Link
              to="/careers"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 font-semibold text-[13px] uppercase tracking-wider transition-colors"
            >
              <Briefcase size={16} />
              <span>Careers</span>
            </Link>

            <button
              onClick={() => window.open("https://traxoindia.com/customercare", "_blank")}
              className="bg-slate-900 text-white px-7 py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <Link
                to="/careers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-4 w-full p-4 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-lg"
              >
                <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <Briefcase size={20} />
                </div>
                <span>Careers</span>
              </Link>
              
              <button
                onClick={() => {
                    window.open("https://traxoindia.com/customercare", "_blank");
                    setIsMobileMenuOpen(false);
                }}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MainNavbar;