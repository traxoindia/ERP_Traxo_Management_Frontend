import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, UserCircle, Plus, X, Building2, Globe, Mail, Phone, 
  MapPin, Briefcase, Users, CreditCard, Hash, ShieldCheck, Landmark, 
  Loader2, LogOut, ChevronDown, User, 
  Calendar
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- SUB-COMPONENTS MOVED OUTSIDE TO PREVENT FOCUS LOSS ---

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
    <Icon size={18} className="text-blue-600" />
    <h3 className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">{title}</h3>
  </div>
);

const InputField = ({ icon: Icon, section, field, placeholder, formData, handleInputChange, type = "text" }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
      <Icon size={16} />
    </div>
    <input
      type={type}
      required
      placeholder={placeholder}
      value={formData[section][field]}
      onChange={(e) => handleInputChange(section, field, e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
    />
  </div>
);

const AdminNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    companyInfo: { companyName: '', legalName: '', companyType: '', industry: '', yearOfIncorporation: '', numberOfEmployees: '' },
    address: { registeredAddress: '', operationalAddress: '', city: '', state: '', country: '', pinCode: '' },
    contact: { email: '', phone: '', website: '' },
    authorizedPerson: { fullName: '', designation: '', email: '', phone: '', idProofNumber: '' },
    bankDetails: { bankName: '', accountHolderName: '', accountNumber: '', ifscCode: '', branchName: '' },
    taxInformation: { pan: '', gst: '', cin: '', tan: '' }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/admin/login');
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://python-backend-2-5uar.onrender.com/company/onboard', formData);
      toast.success("Enterprise Onboarded Successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      
      {/* --- NAVBAR --- */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 lg:ml-64">
        <div className="hidden md:flex relative w-72 lg:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search enterprise..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100/50 rounded-full border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Onboard Company</span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 border-l border-gray-100 cursor-pointer group hover:opacity-80 transition-opacity"
            >
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  Admin User <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                AD
              </div>
            </div>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <User size={16} /> Profile Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- ONBOARDING MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Company Onboarding</h2>
                <p className="text-sm text-gray-500">Configure enterprise credentials</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleOnboard} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                <section>
                  <SectionHeader icon={Building2} title="Company Identity" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <InputField icon={Building2} section="companyInfo" field="companyName" placeholder="Brand Name" formData={formData} handleInputChange={handleInputChange} />
                    </div>
                    <InputField icon={ShieldCheck} section="companyInfo" field="legalName" placeholder="Legal Entity Name" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Briefcase} section="companyInfo" field="companyType" placeholder="Company Type" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Globe} section="companyInfo" field="industry" placeholder="Industry" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Calendar} section="companyInfo" field="yearOfIncorporation" placeholder="Est. Year" formData={formData} handleInputChange={handleInputChange} />
                    <div className="col-span-2">
                      <InputField icon={Users} section="companyInfo" field="numberOfEmployees" placeholder="Headcount" formData={formData} handleInputChange={handleInputChange} />
                    </div>
                  </div>
                </section>

                <section>
                  <SectionHeader icon={MapPin} title="Global Presence" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><InputField icon={MapPin} section="address" field="registeredAddress" placeholder="Registered Address" formData={formData} handleInputChange={handleInputChange} /></div>
                    <div className="col-span-2"><InputField icon={MapPin} section="address" field="operationalAddress" placeholder="Operational Address" formData={formData} handleInputChange={handleInputChange} /></div>
                    <InputField icon={MapPin} section="address" field="city" placeholder="City" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={MapPin} section="address" field="state" placeholder="State" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Globe} section="address" field="country" placeholder="Country" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Hash} section="address" field="pinCode" placeholder="PIN Code" formData={formData} handleInputChange={handleInputChange} />
                  </div>
                </section>

                <section>
                  <SectionHeader icon={Mail} title="Communication" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField icon={Mail} section="contact" field="email" placeholder="Corporate Email" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Phone} section="contact" field="phone" placeholder="Business Phone" formData={formData} handleInputChange={handleInputChange} />
                    <div className="col-span-2"><InputField icon={Globe} section="contact" field="website" placeholder="Website URL" formData={formData} handleInputChange={handleInputChange} /></div>
                  </div>
                </section>

                <section>
                  <SectionHeader icon={UserCircle} title="Authorized Representative" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField icon={UserCircle} section="authorizedPerson" field="fullName" placeholder="Full Name" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Briefcase} section="authorizedPerson" field="designation" placeholder="Designation" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Mail} section="authorizedPerson" field="email" placeholder="Direct Email" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Phone} section="authorizedPerson" field="phone" placeholder="Mobile Number" formData={formData} handleInputChange={handleInputChange} />
                    <div className="col-span-2"><InputField icon={ShieldCheck} section="authorizedPerson" field="idProofNumber" placeholder="ID Number" formData={formData} handleInputChange={handleInputChange} /></div>
                  </div>
                </section>

                <section>
                  <SectionHeader icon={Landmark} title="Banking Details" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField icon={Landmark} section="bankDetails" field="bankName" placeholder="Bank Name" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={UserCircle} section="bankDetails" field="accountHolderName" placeholder="Holder Name" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={CreditCard} section="bankDetails" field="accountNumber" placeholder="Account Number" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Hash} section="bankDetails" field="ifscCode" placeholder="IFSC Code" formData={formData} handleInputChange={handleInputChange} />
                  </div>
                </section>

                <section>
                  <SectionHeader icon={Hash} title="Tax Information" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField icon={Hash} section="taxInformation" field="pan" placeholder="PAN" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Hash} section="taxInformation" field="gst" placeholder="GST" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Hash} section="taxInformation" field="cin" placeholder="CIN" formData={formData} handleInputChange={handleInputChange} />
                    <InputField icon={Hash} section="taxInformation" field="tan" placeholder="TAN" formData={formData} handleInputChange={handleInputChange} />
                  </div>
                </section>
              </div>

              <div className="mt-10 sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                    loading
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Complete Onboarding'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default AdminNavbar;