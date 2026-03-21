import React from "react";
import logo from "../../images/logo.png"; // Ensure you have a logo image in this path

const MainNavbar = () => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo / Brand */}
        <h1 className="text-2xl font-bold text-blue-600">
          <img src={logo} alt="Company Logo" className="h-8 inline-block mr-2" />
          
        </h1>

        {/* Career Link */}
        <ul className="flex space-x-6">
          <li>
            <a
              href="/careers"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Careers
            </a>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default MainNavbar;