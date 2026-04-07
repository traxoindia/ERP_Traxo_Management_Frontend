import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  KeyRound,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔐 Password Strength
  const getStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/^(?=.*[A-Z])(?=.*[0-9])/)) return "Strong";
    return "Medium";
  };

  // 🎯 Autofocus password field on step 2
  useEffect(() => {
    if (step === 2) {
      document.querySelector("input[type='password'], input[type='text']")?.focus();
    }
  }, [step]);

  // --- STEP 1 ---
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        'https://python-backend-2-5uar.onrender.com/auth/forgot-password',
        { email }
      );

      const token = res.data.token;

      if (token) {
        localStorage.setItem('resetToken', token);
        toast.success("Reset token generated!");
        setStep(2);
      } else {
        toast.error("No token received.");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2 ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const savedToken = localStorage.getItem('resetToken');

    try {
      await axios.post(
        'https://python-backend-2-5uar.onrender.com/auth/reset-password',
        {
          token: savedToken,
          new_password: newPassword
        }
      );

      toast.success("Password reset successfully!");
      localStorage.removeItem('resetToken');

      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 items-center justify-center p-6">
      <Toaster position="top-center" />

      <div className="w-full max-w-md backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">

        {/* HEADER */}
        <div className="bg-slate-900 p-8 text-center relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={80} color="white" />
          </div>

          <div className="inline-flex p-3 bg-blue-600 rounded-xl mb-4 shadow-lg">
            <KeyRound className="text-white" size={28} />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Security Recovery
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            {step === 1
              ? "Identify your administrator account"
              : "Set your new secure credentials"}
          </p>
        </div>

        <div className="p-8 transition-all duration-500">

          {/* PROGRESS BAR */}
          <div className="flex justify-center gap-2 mb-6">
            <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestReset} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  Admin Email
                </label>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-blue-600">
                    <Mail size={18} />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 hover:scale-[1.02] flex justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Request Reset Token"}
              </button>
            </form>

          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

              {/* SUCCESS */}
              <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-lg flex items-center gap-2">
                <ShieldCheck size={14} />
                Token verified. Set new password.
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">
                  New Password
                </label>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <Lock size={18} />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="Enter new password"
                    required
                  />

                  {/* TOGGLE */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* STRENGTH */}
                {newPassword && (
                  <p className={`text-xs font-semibold mt-2 ${
                    getStrength(newPassword) === "Strong"
                      ? "text-green-600"
                      : getStrength(newPassword) === "Medium"
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}>
                    Strength: {getStrength(newPassword)}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <button
                disabled={loading || newPassword.length < 6}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 hover:scale-[1.02] flex justify-center"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          )}

          {/* BACK */}
          <div className="mt-8 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;