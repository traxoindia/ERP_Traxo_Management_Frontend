import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Eye, EyeOff, Lock } from "lucide-react";
import loginIllustration from "../assets/Login.jpeg";

import { login } from "../services/authService"; // API Service

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await login(formData.email, formData.password);
    console.log(data)

    const role = data.roles[0]; // Extract role from array

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", role);

    if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else if (role === "HR") {
      navigate("/hr-dashboard");
    } else {
      navigate("/user-dashboard");
    }

  } catch (error) {
    alert("Invalid email or password");
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7fe] p-4 sm:p-8 font-sans">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-[1100px] min-h-[650px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.07)] overflow-hidden"
      >

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#fafbfc] items-center justify-center p-16">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={loginIllustration}
            alt="Login"
            className="w-full max-w-[420px]"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12">

          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
              Login
            </h2>
            <p className="text-gray-400 text-sm">
              Please enter your account details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase">
                Email
              </label>

              <div className="relative mt-2">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full pl-12 pr-4 py-4 bg-[#f3f6fb] rounded-2xl outline-none"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <div className="flex justify-between">
                <label className="text-[11px] font-bold text-gray-400 uppercase">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-bold text-blue-500"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative mt-2">

                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-[#f3f6fb] rounded-2xl outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-[#5ea7ff] hover:bg-blue-500 text-white font-bold text-lg rounded-full"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

          </form>

          {/* REGISTER */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-bold"
              >
                New Registration
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;