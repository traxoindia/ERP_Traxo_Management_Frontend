import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://api.wemis.in/api/admin/login', { email, password });
      localStorage.setItem('accessToken', res.data.token);
      // Optional: Store admin info
      // localStorage.setItem('adminUser', JSON.stringify(res.data.user)); 
      navigate('/admin/dashboard');
    } catch (err) {
      alert("Access Denied: Please check your admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* Left Side: Branding/Visual (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">TRAXO <span className="text-blue-500">ERP</span></h1>
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            Manage your <br /> 
            <span className="text-blue-500">entire enterprise</span> <br /> 
            in one place.
          </h2>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 max-w-md mb-6">
            Secure, scalable, and intuitive management for modern businesses.
          </p>
          <div className="flex space-x-4 text-sm text-slate-500">
            <span>© 2026 Traxo Systems</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex justify-center">
            <h1 className="text-3xl font-black text-slate-900">TRAXO <span className="text-blue-600">ERP</span></h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access the management portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 pl-3 flex items-center text-slate-400">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  placeholder="admin@traxo.com" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 pl-3 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span className="text-slate-600">Remember for 30 days</span>
              </label>
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300'
              }`}
            >
              {loading ? "Verifying Access..." : "Secure Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Need to set up a new branch? <a href="/admin/register" className="font-bold text-slate-900 hover:underline">Create Admin Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;