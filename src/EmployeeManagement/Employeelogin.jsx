import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

function Employeelogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.wemis.in/api/auth/employee-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok && data.accessToken) {
        // --- SAVE ALL DATA TO LOCAL STORAGE ---
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('employeeId', data.employeeId);
        localStorage.setItem('name', data.name);
        
        // Roles are usually an array; we store them as a stringified JSON
        localStorage.setItem('roles', JSON.stringify(data.roles));

        // --- ROLE-BASED REDIRECTION ---
        const isEmployee = data.roles && data.roles.includes("ROLE_EMPLOYEE");

        if (isEmployee) {
          navigate('/employee-dashboard');
        } else {
          // If they aren't an employee (e.g., Admin), send them elsewhere or home
          navigate('/');
        }
      } else {
        setError(data.message || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Employee Login</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to access your portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="employee@traxoindia.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 block">Password (Phone Number)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
          >
            ← Back to Main Website
          </button>
        </div>
      </div>
    </div>
  );
}

export default Employeelogin;