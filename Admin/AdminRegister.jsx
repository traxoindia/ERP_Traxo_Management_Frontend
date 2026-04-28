import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../src/images/logo.png';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = 'https://api.traxoerp.com/auth/register';

    try {
      const res = await axios.post(API_URL, formData);
      const token = res.data.access_token || res.data.token;
      if (token) localStorage.setItem('accessToken', token);

      toast.success('Account created! Welcome.', {
        style: { background: '#1e293b', color: '#fff' },
        iconTheme: { primary: '#facc15', secondary: '#fff' }
      });

      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Registration failed.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Visual Side Panel - Yellow/Slate Theme */}
      <div className="hidden lg:flex w-2/5 bg-[#0f172a] flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <img src={logo} alt="Traxo Logo" className="w-32 mb-12" />
          
          <p className="mt-6 text-slate-900 text-lg max-w-sm leading-relaxed">
            Create an administrator account to begin monitoring and scaling your enterprise operations.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-yellow-400" />
            <span>Secure Enterprise Onboarding</span>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Create Admin</h2>
            <p className="text-slate-500 font-medium">Join the management portal today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-yellow-600 transition-colors">
                  <User size={19} />
                </span>
                <input 
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-yellow-600 transition-colors">
                  <Mail size={19} />
                </span>
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@traxo.com" 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-yellow-600 transition-colors">
                  <Lock size={19} />
                </span>
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 outline-none transition-all font-medium"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold bg-yellow-500 text-black shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0f172a] hover:bg-black'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={22} /> : (
                <>
                  <span className="uppercase tracking-widest text-sm">Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-yellow-600 hover:text-yellow-700 font-bold decoration-2 underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;