import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, Loader2, LogIn, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../src/images/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = 'https://python-backend-2-5uar.onrender.com/auth/login';

    try {
      const res = await axios.post(API_URL, { email, password });
      const token = res.data.token || res.data.access_token;
      
      if (token) {
        localStorage.setItem('accessToken', token);
        if (rememberMe) localStorage.setItem('rememberedEmail', email);
        else localStorage.removeItem('rememberedEmail');
        
        toast.success('Welcome back! Redirecting...', {
            style: { background: '#1e293b', color: '#fff' },
            iconTheme: { primary: '#facc15', secondary: '#fff' }
        });
        
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Invalid credentials.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
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
            Access your secure dashboard to manage operations and enterprise resources.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
            <Shield size={14} className="text-yellow-500" />
            <span>Enterprise Grade Security</span>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-yellow-600 transition-colors">
                  <Mail size={19} />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between px-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500" 
                    />
                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                <Link to="/admin/forgot-password" size={19} className="text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                    Forgot password?
                </Link>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold bg-yellow-500 text-black shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0f172a] hover:bg-black'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={22} /> : (
                <>
                  <span className="uppercase tracking-widest text-sm">Sign In</span>
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center">
            <p className="text-slate-500 font-medium">
              New to the platform?{' '}
              <Link to="/admin/register" className="text-yellow-600 hover:text-yellow-700 font-bold decoration-2 underline-offset-4 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;