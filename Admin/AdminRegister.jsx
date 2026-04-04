import React from 'react';

const AdminRegister = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Admin Account</h2>
        <input type="text" placeholder="Full Name" className="w-full mb-4 p-2 border rounded" />
        <input type="email" placeholder="Work Email" className="w-full mb-4 p-2 border rounded" />
        <input type="password" placeholder="Set Password" className="w-full mb-6 p-2 border rounded" />
        <button className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-900 transition">
          Register Admin
        </button>
      </div>
    </div>
  );
};

export default AdminRegister;