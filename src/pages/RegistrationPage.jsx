import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, RefreshCw, Loader2, CheckCircle, Mail, Lock, User } from "lucide-react";
import registerIllustration from "../assets/Login.jpeg"; 
import { register } from "../services/authService";
import MainNavbar from "./Career/MainNavbar";

function RegistrationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "HR",
    captchaInput: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.captchaInput !== generatedCaptcha) {
      setError("Incorrect Captcha");
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.email, formData.password, [formData.role]);
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MainNavbar/>
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe] p-4 font-sans">
      {/* Container - Reduced max-width from 1100px to 900px for a "smaller" feel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[950px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
      >
        
        {/* Left Side: Smaller Illustration Area */}
        <div className="hidden lg:flex lg:w-[40%] bg-[#fafbfc] flex-col items-center justify-center p-10 border-r border-gray-50 relative">
          <div className="relative z-10 text-center">
            <img src={registerIllustration} alt="Register" className="w-48 h-auto mx-auto mb-6 drop-shadow-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Join Traxo</h2>
            <p className="text-gray-400 text-xs mt-2 px-4">The ultimate ERP solution for modern institutions.</p>
          </div>
          <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-[60%] p-8 sm:px-12 flex flex-col justify-center bg-white">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
                <p className="text-gray-500 text-sm">Account created. Redirecting to login...</p>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-800">Registration</h2>
                  <p className="text-gray-400 text-xs font-medium mt-1">Fill in the details to get started.</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-500 text-[11px] font-bold rounded-xl border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-[#f3f6fb] rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Full Name" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-[#f3f6fb] rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Email" />
                    </div>
                  </div>

                  {/* Row 2: Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-10 py-3 bg-[#f3f6fb] rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-[#f3f6fb] rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Confirm" />
                    </div>
                  </div>

                  {/* Captcha Section */}
                  <div className="pt-2">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="flex-1 bg-gray-800 text-white font-mono text-center py-2 rounded-xl tracking-[0.4em] italic text-sm shadow-inner">
                        {generatedCaptcha}
                      </div>
                      <button type="button" onClick={generateCaptcha} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors">
                        <RefreshCw size={18} />
                      </button>
                    </div>
                    <input type="text" name="captchaInput" value={formData.captchaInput} onChange={handleChange} required placeholder="Verify Captcha" className="w-full px-4 py-3 bg-[#f3f6fb] rounded-xl text-xs outline-none border-2 border-transparent focus:border-blue-200" />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-full shadow-lg shadow-blue-100 transition-all flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Create Account"}
                  </motion.button>
                </form>

                <div className="mt-6 text-center text-xs font-medium">
                  <span className="text-gray-400">Already have an account? </span>
                  <button onClick={() => navigate("/")} className="text-blue-600 font-bold hover:underline">Login</button>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
      </>
  );
}

export default RegistrationPage;