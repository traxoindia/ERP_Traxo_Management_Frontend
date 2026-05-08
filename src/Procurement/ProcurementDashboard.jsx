import React from "react";
import { useNavigate } from "react-router-dom";
import ProcurementNavbar from "./ProcurementNavbar";
import ProcureMentSeeVendorProducts from "./ProcureMentSeeVendorProducts";

function ProcurementDashboard() {
  const navigate = useNavigate();

  const cards = [
    
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <ProcurementNavbar />

    

        <ProcureMentSeeVendorProducts/>

        
   
    </div>
  );
}

export default ProcurementDashboard;