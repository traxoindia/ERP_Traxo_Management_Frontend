import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Phone, BadgeCheck, Hash, Loader2, ArrowLeft } from 'lucide-react';

function RegisterEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    employmentStatus: 'ACTIVE'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://api.wemis.in/api/auth/register-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Employee registered successfully!' });
        // Optional: Reset form or redirect
        setFormData({ employeeId: '', fullName: '', emailAddress: '', phoneNumber: '', employmentStatus: 'ACTIVE' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Registration failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-100 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserPlus size={24} /> New Employee Registration
          </h2>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-5">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm text-center border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="employeeId"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="TEST001"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <BadgeCheck className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="fullName"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Test User"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="emailAddress"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="test@traxo.com"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Password)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="phoneNumber"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="1234567890"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Register Employee'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEmployee;