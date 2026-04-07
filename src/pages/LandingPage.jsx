import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Landmark, ShoppingCart, Code, Factory, Truck, MapPin,
  HelpCircle, Lock, UserPlus, ChevronRight, Facebook, Twitter, 
  Youtube, Linkedin, Instagram, Phone, Info,
  Pi
} from 'lucide-react';
import MainNavbar from './Career/MainNavbar';

const menuData = {
  Traxo: {
    label: "",
    items: [
        { name: "Admin Login", icon: <Users size={18} />, path: "/admin/login" },
      { name: "HR login", icon: <Users size={18} />, path: "/login" },
      { name: "Finance", icon: <Landmark size={18} />, path: "/departments/finance" },
      { name: "Procurement", icon: <ShoppingCart size={18} />, path: "/departments/procurement" },
      { name: "Software", icon: <Code size={18} />, path: "/departments/software" },
      { name: "Production", icon: <Factory size={18} />, path: "/departments/production" },
      { name: "Employee Login", icon: <Lock size={18} />, path: "/employee-login" },
      { name: "Wemis", icon: <Truck size={18} />, path: "https://wemis.in", isExternal: true },
      { name: "Visit Us", icon: <MapPin size={18} />, path: "https://traxoindia.com", isExternal: true },
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
      
      {/* 1. TOP BRAND BAR (Logo & ERP-style Traxo ERP) */}
    

      {/* 2. PRIMARY NAV (SBI Dark Blue - Mapped to your Department Data) */}
      <nav className="bg-[#003366] text-white overflow-x-auto whitespace-nowrap sticky top-0 z-40 shadow-lg">
        <div className="max-w-screen-2xl mx-auto flex">
          {menuData.Traxo.items.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => handleNavigation(item)}
              className="px-5 py-3 text-[12px] font-bold border-r border-[#ffffff22] hover:bg-[#004a91] transition-colors flex items-center gap-2 group"
            >
              <span className="text-cyan-400 group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.name}
            </button>
          ))}
          <div className="ml-auto bg-[#2b8a3e] px-6 py-3 text-[13px] font-bold cursor-pointer hover:bg-[#236d31]">ENGLISH</div>
        </div>
      </nav>

      {/* 3. MARQUEE NOTICE */}
      <div className="bg-[#fff9db] border-b border-yellow-200 py-1.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-[#856404] text-[11px] font-bold px-4">
          SYSTEM UPDATE: Traxo ERP will be under maintenance on Sunday from 02:00 AM to 04:00 AM.
          <span className="text-red-600 ml-10">SECURITY ALERT: Please change your login password every 90 days for better security. Do not share your OTP.</span>
          <span className="text-blue-700 ml-10">WELCOME: Visit our main website at traxoindia.com for the latest automation news.</span>
        </div>
      </div>

      {/* 4. MAIN ACTION CARDS (Split Personal/Business) */}
      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-2 gap-8 mt-4">
        
        {/* LEFT CARD: HR & Employee Portal */}
        <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col items-center p-8 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-pink-600 font-black text-xl italic">ERP</span>
            <span className="text-blue-900 font-bold text-xl uppercase tracking-tighter">Traxo</span>
          </div>
          <h2 className="text-2xl font-light text-blue-900 uppercase tracking-widest mb-6">Staff <span className="font-bold">Banking</span></h2>
          
          <button 
            onClick={() => navigate('/admin/login')}
            className="bg-[#1d4d8c] hover:bg-[#153a6b] text-white px-16 py-2.5 rounded font-bold flex items-center gap-4 transition-all mb-10 shadow-lg active:scale-95"
          >
            LOGIN <ChevronRight size={18} />
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full border-t border-gray-100 pt-8 text-[10px] font-black uppercase text-gray-500 tracking-tighter">
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <UserPlus size={28} className="text-orange-500 group-hover:scale-110 transition-transform" /> New Joining
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <HelpCircle size={28} className="text-blue-500 group-hover:scale-110 transition-transform" /> How To Use
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <Users size={28} className="text-purple-600 group-hover:scale-110 transition-transform" /> HR Support
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <Lock size={28} className="text-green-600 group-hover:scale-110 transition-transform" /> Reset Pass
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Department & Production Portal */}
        <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col items-center p-8 text-center hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-pink-600 font-black text-xl italic">ERP</span>
            <span className="text-blue-900 font-bold text-xl uppercase tracking-tighter">Business</span>
          </div>
          <h2 className="text-2xl font-light text-blue-900 uppercase tracking-widest mb-6">Corporate <span className="font-bold">Access</span></h2>
          
          <button 
            onClick={() => navigate('/departments/production')}
            className="bg-[#1d4d8c] hover:bg-[#153a6b] text-white px-16 py-2.5 rounded font-bold flex items-center gap-4 transition-all mb-4 shadow-lg active:scale-95"
          >
            LOGIN <ChevronRight size={18} />
          </button>
          
          <p className="text-[11px] font-medium text-gray-400 mb-8 max-w-xs">Access centralized manufacturing, procurement, and financial operations through our secure gateway.</p>

          <div className="grid grid-cols-3 gap-6 w-full border-t border-gray-100 pt-8 text-[10px] font-black uppercase text-gray-500 tracking-tighter">
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <Factory size={28} className="text-red-500 group-hover:scale-110 transition-transform" /> Production
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <ShoppingCart size={28} className="text-blue-400 group-hover:scale-110 transition-transform" /> Procurement
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-700 group">
              <Landmark size={28} className="text-amber-600 group-hover:scale-110 transition-transform" /> Finance
            </div>
          </div>
        </div>
      </main>

      {/* 5. QUICK LINKS FOOTER GRID */}
      <div className="bg-white border-t mt-12 mb-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 text-[12px] font-bold text-[#003366]">
          <div className="flex items-center gap-1 cursor-pointer hover:underline text-red-600">» Unauthorized System Access?</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">» Traxo Policy Documents</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">» Employee Salary Slips</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">» Logistics Dashboard</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">» Traxo WEMIS Portal</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">» Hardware Inventory</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline">» GPS Tracking Server</div>
          <div className="flex items-center gap-1 cursor-pointer hover:underline font-bold text-orange-600">» IT Support Helpline</div>
        </div>
      </div>

      {/* 6. FLOATING SOCIAL SIDEBAR (Exactly like SBI) */}
      <div className="fixed right-0 top-1/4 flex flex-col gap-px z-50 shadow-2xl">
        {[
          { icon: <Phone size={18}/>, bg: '#3b5998' },
          { icon: <Phone size={18}/>, bg: '#000000' },
          { icon: <Phone size={18}/>, bg: '#ff0000' },
          { icon: <Info size={18}/>, bg: '#0077b5' },
          { icon: <Pi size={18}/>, bg: '#e4405f' },
          { icon: <Pi size={18}/>, bg: '#bd081c' },
          { icon: <Phone size={18}/>, bg: '#00aff0' },
          { icon: <Info size={18}/>, bg: '#25d366' },
        ].map((social, i) => (
          <div 
            key={i} 
            className="p-2.5 text-white flex items-center justify-center cursor-pointer hover:w-12 transition-all duration-200" 
            style={{ backgroundColor: social.bg }}
          >
            {social.icon}
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 35s linear infinite;
        }
        ::-webkit-scrollbar {
          height: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #003366;
          border-radius: 10px;
        }
      `}</style>
    </div>
        </>
  );
};

export default LandingPage;