import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, MapPin, Shield, LogOut, ArrowLeft, Camera, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeNavbar from './EmployeeNavbar';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    name: '---',
    id: '---',
    role: '---',
    email: '---',
    joinedDate: '---'
  });

  useEffect(() => {
    // Pulling data from your localStorage structure
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('employeeId');
    const roles = localStorage.getItem('roles');
    
    // Simple parsing for the role string
    let displayRole = 'Employee';
    try {
      if (roles) {
        const rolesArray = JSON.parse(roles.replace(/'/g, '"'));
        displayRole = rolesArray[0]?.replace('ROLE_', '') || 'Employee';
      }
    } catch (e) { console.error(e); }

    setEmployeeData({
      name: name || 'Shashikanta Rout',
      id: id || 'TIA-126',
      role: displayRole,
      
      joinedDate: '24 Oct 2023'
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EmployeeNavbar />
        
        <main className="flex-1 p-6 md:p-12 lg:p-16">
          <div className="max-w-3xl mx-auto">
            
            {/* Navigation & Header */}
            <header className="mb-16">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-6"
              >
                <ArrowLeft size={12} /> Return to Dashboard
              </button>
              <h1 className="text-4xl font-light tracking-tight text-gray-900">Account Profile</h1>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Internal Directory / Global Settings</p>
            </header>

            <div className="space-y-20">
              
              {/* Section 1: Identity */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <aside>
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">Identity</h2>
                  <p className="text-[10px] text-gray-300 mt-1 uppercase">Personal Verification</p>
                </aside>
                
                <div className="md:col-span-2 space-y-8">
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 overflow-hidden">
                        <User size={40} strokeWidth={1} />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <Camera size={12} className="text-gray-500" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-light">{employeeData.name}</h3>
                      <p className="text-xs text-gray-400 font-mono mt-1">{employeeData.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 pt-4">
                    <div className="border-b border-gray-50 pb-4">
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
                      <p className="text-sm font-light flex items-center gap-2">
                        <Mail size={14} className="text-gray-300" /> {employeeData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Employment Details */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <aside>
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">Employment</h2>
                  <p className="text-[10px] text-gray-300 mt-1 uppercase">Organization Role</p>
                </aside>
                
                <div className="md:col-span-2 grid grid-cols-2 gap-y-10 gap-x-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Designation</p>
                    <p className="text-sm font-light flex items-center gap-2 uppercase tracking-tighter">
                      <Briefcase size={14} className="text-gray-300" /> {employeeData.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Joined Date</p>
                    <p className="text-sm font-light flex items-center gap-2">
                      <Calendar size={14} className="text-gray-300" /> {employeeData.joinedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Office Hub</p>
                    <p className="text-sm font-light flex items-center gap-2">
                      <MapPin size={14} className="text-gray-300" /> Balasore, Odisha
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Status</p>
                    <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-2 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active / On-Site
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Security & Session */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <aside>
                  <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">Security</h2>
                  <p className="text-[10px] text-gray-300 mt-1 uppercase">Privacy Control</p>
                </aside>
                
                <div className="md:col-span-2 space-y-6">
                  <div className="p-6 border border-gray-100 rounded-sm bg-gray-50/30 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-medium flex items-center gap-2">
                        <Shield size={14} /> Account Termination
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Disconnect this device from the central portal</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-[9px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 border border-red-100 px-4 py-2 bg-white transition-all rounded-sm"
                    >
                      Sign Out
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-300 leading-relaxed max-w-sm italic">
                    Note: For security reasons, changes to primary data (ID or Role) must be requested through HR administration.
                  </p>
                </div>
              </section>

            </div>

            <footer className="mt-32 pt-10 border-t border-gray-50 text-center">
              <p className="text-[9px] text-gray-300 uppercase tracking-widest">Traxo India Management Portal • v2.6.1</p>
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;