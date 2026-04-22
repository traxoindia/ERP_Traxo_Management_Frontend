import React from "react";
import { useNavigate } from "react-router-dom";
import ProcurementNavbar from "./ProcurementNavbar";

function ProcurementDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "BGV Requests",
      desc: "Manage background verification",
      path: "/bgv",
      color: "bg-blue-500",
    },
    {
      title: "Vendors",
      desc: "Register & manage vendors",
      path: "/vendors",
      color: "bg-green-500",
    },
    {
      title: "Reports",
      desc: "View procurement reports",
      path: "/reports",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <ProcurementNavbar />

      {/* Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Procurement Dashboard
        </h1>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`cursor-pointer text-white p-6 rounded-2xl shadow-lg ${card.color} hover:scale-105 transition`}
            >
              <h2 className="text-xl font-semibold mb-2">
                {card.title}
              </h2>
              <p className="text-sm opacity-90">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Extra Section */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/vendors")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Register Vendor
            </button>

            <button
              onClick={() => navigate("/bgv")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Start BGV
            </button>

            <button
              onClick={() => navigate("/reports")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcurementDashboard;