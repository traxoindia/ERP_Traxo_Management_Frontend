import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Landmark, ShoppingCart, Code, Factory, Truck, MapPin,
  HelpCircle, Lock, UserPlus, ChevronRight, Phone, Info,
  Settings, Database, ShieldAlert, FileText, ClipboardList, Monitor
} from 'lucide-react';
import MainNavbar from './Career/MainNavbar';

const menuData = {
  Traxo: {
    items: [
      { name: "Admin Portal", icon: <Users size={18} />, path: "/admin/login" },
      { name: "HR Management", icon: <Users size={18} />, path: "/login" },
      { name: "Finance", icon: <Landmark size={18} />, path: "/departments/finance" },
      { name: "Procurement", icon: <ShoppingCart size={18} />, path: "/departments/procurement" },
      { name: "Software", icon: <Code size={18} />, path: "/departments/software" },
      { name: "Production", icon: <Factory size={18} />, path: "/departments/production" },
      { name: "Employee Self Service", icon: <Lock size={18} />, path: "/employee-login" },
      { name: "Wemis", icon: <Truck size={18} />, path: "https://wemis.in", isExternal: true },
      { name: "Corporate Site", icon: <MapPin size={18} />, path: "https://traxoindia.com", isExternal: true },
    ],
  },
};

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    if (item.isExternal) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <MainNavbar/>

      <div className="min-h-screen bg-[#f4f4f4] font-sans text-slate-800 relative overflow-x-hidden">
        
        {/* 1. PRIMARY NAV (Corporate Dark Blue) */}
        <nav className="bg-[#003366] text-white sticky top-0 z-40 shadow-lg">
          <div className="max-w-screen-2xl mx-auto flex items-center">
            <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
              {menuData.Traxo.items.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleNavigation(item)}
                  className="px-4 py-3.5 text-[11px] md:text-[12px] font-bold border-r border-[#ffffff22] hover:bg-[#004a91] transition-colors flex items-center gap-2 whitespace-nowrap group"
                >
                  <span className="text-cyan-400 group-hover:scale-110 transition-transform">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <div className="ml-auto bg-[#2b8a3e] px-4 md:px-6 py-3.5 text-[12px] font-bold cursor-pointer hover:bg-[#236d31] hidden sm:block">
              ENGLISH
            </div>
          </div>
        </nav>

        {/* 2. MARQUEE NOTICE */}
        <div className="bg-[#fff9db] border-b border-yellow-200 py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-[#856404] text-[11px] md:text-[12px] font-bold px-4">
            SYSTEM UPDATE: Traxo ERP will be under maintenance on Sunday from 02:00 AM to 04:00 AM.
            <span className="text-red-600 ml-10 uppercase">Security Policy: Update your system credentials every 90 days. Never share your access keys.</span>
            <span className="text-blue-700 ml-10">NOTICE: Authorized personnel only. All activities are logged under internal audit.</span>
          </div>
        </div>

        {/* 3. MAIN ACTION CARDS */}
        <main className="max-w-7xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-6 md:gap-10 mt-4">
          
          {/* LEFT CARD: Workforce & HR */}
          <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col items-center p-6 md:p-10 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-pink-600 font-black text-xl md:text-2xl italic">ERP</span>
              <span className="text-blue-900 font-bold text-xl md:text-2xl uppercase tracking-tighter">Traxo</span>
            </div>
            <h2 className="text-xl md:text-2xl font-light text-blue-900 uppercase tracking-[0.2em] mb-6">Workforce <span className="font-bold">Portal</span></h2>
            
            <button 
              onClick={() => navigate('/admin/login')}
              className="bg-[#1d4d8c] hover:bg-[#153a6b] text-white px-10 md:px-16 py-3 rounded font-bold flex items-center gap-4 transition-all mb-10 shadow-lg active:scale-95"
            >
              ADMIN LOGIN <ChevronRight size={18} />
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full border-t border-gray-100 pt-8 text-[10px] font-black uppercase text-gray-500 tracking-tighter">
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <UserPlus size={28} className="text-orange-500 group-hover:scale-110 transition-transform" /> Onboarding
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <Settings size={28} className="text-blue-500 group-hover:scale-110 transition-transform" /> ESS Tools
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <Users size={28} className="text-purple-600 group-hover:scale-110 transition-transform" /> HR Desk
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <Lock size={28} className="text-green-600 group-hover:scale-110 transition-transform" /> Security
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Operations & Production */}
          <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col items-center p-6 md:p-10 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-pink-600 font-black text-xl md:text-2xl italic">ERP</span>
              <span className="text-blue-900 font-bold text-xl md:text-2xl uppercase tracking-tighter">Industrial</span>
            </div>
            <h2 className="text-xl md:text-2xl font-light text-blue-900 uppercase tracking-[0.2em] mb-6">Operations <span className="font-bold">Hub</span></h2>
            
            <button 
              onClick={() => navigate('/departments/production')}
              className="bg-[#1d4d8c] hover:bg-[#153a6b] text-white px-10 md:px-16 py-3 rounded font-bold flex items-center gap-4 transition-all mb-4 shadow-lg active:scale-95"
            >
              DEPT LOGIN <ChevronRight size={18} />
            </button>
            
            <p className="text-[12px] font-medium text-gray-400 mb-8 max-w-xs px-2">Access manufacturing controls, inventory data, and departmental workflows through secure authentication.</p>

            <div className="grid grid-cols-3 gap-4 md:gap-6 w-full border-t border-gray-100 pt-8 text-[10px] font-black uppercase text-gray-500 tracking-tighter">
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <Factory size={28} className="text-red-500 group-hover:scale-110 transition-transform" /> Production
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <ShoppingCart size={28} className="text-blue-400 group-hover:scale-110 transition-transform" /> Supply Chain
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
                <Database size={28} className="text-amber-600 group-hover:scale-110 transition-transform" /> Resources
              </div>
            </div>
          </div>
        </main>

        {/* 4. QUICK LINKS FOOTER */}
        <div className="bg-white border-t mt-12 pb-20">
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 text-[12px] font-bold text-[#003366]">
            <div className="flex items-center gap-2 cursor-pointer hover:underline text-red-600 uppercase"><ShieldAlert size={14}/> Report Breach</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline"><FileText size={14}/> Operational Policies</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline"><ClipboardList size={14}/> Payroll & Tax Forms</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline"><Truck size={14}/> Logistics Tracking</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline"><Monitor size={14}/> System Health Status</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline"><Database size={14}/> Asset Register</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline"><MapPin size={14}/> Site Locations</div>
            <div className="flex items-center gap-2 cursor-pointer hover:underline font-bold text-orange-600"><Phone size={14}/> IT Technical Support</div>
          </div>
        </div>

        {/* 5. FLOATING SIDEBAR (Fixed Utility) */}
        <div className="fixed right-0 top-1/3 flex flex-col gap-px z-50 shadow-2xl hidden md:flex">
          {[
            { icon: <Phone size={18}/>, bg: '#1d4d8c', label: 'Support' },
            { icon: <Info size={18}/>, bg: '#0077b5', label: 'About' },
            { icon: <Database size={18}/>, bg: '#2b8a3e', label: 'Data' },
            { icon: <ShieldAlert size={18}/>, bg: '#bd081c', label: 'Alert' },
          ].map((item, i) => (
            <div 
              key={i} 
              title={item.label}
              className="p-3 text-white flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all duration-200" 
              style={{ backgroundColor: item.bg }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 40s linear infinite;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default LandingPage;