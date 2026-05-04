import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Loader2, 
  ChevronRight, 
  ShieldCheck, 
  LayoutDashboard 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function VendorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api.traxoerp.com/vendors/vendor-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Authentication successful!', {
          style: { borderRadius: '12px', background: '#333', color: '#fff' },
        });

        // Save requested data to localStorage
        localStorage.setItem('accessToken', data.access_token || data.token);
        localStorage.setItem('refreshToken', data.refresh_token || '');
        localStorage.setItem('role', data.role || 'vendor');

        setTimeout(() => navigate('/vendor-dashboard'), 1200);
      } else {
        toast.error(data.detail || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <Toaster position="top-right" />
      
      {/* Left Side: Visual/Branding Section (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-yellow-500 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
               <LayoutDashboard size={24} />
            </div>
            <span className="text-indigo-900" >TRAXO <span className="text-indigo-900">VENDORS</span></span>
          </div>
        </div>

      

        <div className="relative z-10 flex items-center gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-1">
            <ShieldCheck size={16} /> Secure Portal
          </div>
          <span>•</span>
          <span>© 2026 Wemis Inc.</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="text-slate-500">Enter your vendor credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-900"
                    placeholder="vendor@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in to Portal
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-4">
            Don't have an account?{' '}
            <button className="font-bold text-indigo-600 hover:underline">Get started</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;