import React, { useState } from 'react';
import { Bell, Search, UserCircle, Plus, X, Building2, Globe, Mail, Phone, MapPin, Briefcase, Calendar, Users, CreditCard, Hash } from 'lucide-react';

const AdminNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnboard = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      alert("Company Onboarded Successfully!");
    }, 1500);
  };

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-all lg:ml-64">
        <div className="hidden md:flex relative w-72 lg:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search enterprise..."
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="md:hidden p-2 text-gray-500">
          <Search size={20} />
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white px-3 md:px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Onboard Company</span>
          </button>

          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

          <button className="text-gray-400 relative p-1">
            <Bell size={22} />
          </button>

          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold">Admin User</p>
            </div>
            <UserCircle size={28} />
          </div>
        </div>
      </nav>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Onboard Company</h2>
              <X onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
            </div>

            <form onSubmit={handleOnboard} className="space-y-8">

              {/* Company Info */}
              <div>
                <h3 className="font-semibold mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Company Name" className="input" required />
                  <input placeholder="Legal Name" className="input" />
                  <input placeholder="Company Type" className="input" />
                  <input placeholder="Industry" className="input" />
                  <input placeholder="Year of Incorporation" className="input" />
                  <input placeholder="No. of Employees" className="input" />
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold mb-4">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Registered Address" className="input" />
                  <input placeholder="Operational Address" className="input" />
                  <input placeholder="City" className="input" />
                  <input placeholder="State" className="input" />
                  <input placeholder="Country" className="input" />
                  <input placeholder="PIN Code" className="input" />
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-4">Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Email" className="input" />
                  <input placeholder="Phone" className="input" />
                  <input placeholder="Website" className="input md:col-span-2" />
                </div>
              </div>

              {/* Authorized Person */}
              <div>
                <h3 className="font-semibold mb-4">Authorized Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Full Name" className="input" />
                  <input placeholder="Designation" className="input" />
                  <input placeholder="Email" className="input" />
                  <input placeholder="Phone" className="input" />
                  <input placeholder="ID Proof Number" className="input md:col-span-2" />
                </div>
              </div>

              {/* Banking */}
              <div>
                <h3 className="font-semibold mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Bank Name" className="input" />
                  <input placeholder="Account Holder Name" className="input" />
                  <input placeholder="Account Number" className="input" />
                  <input placeholder="IFSC Code" className="input" />
                  <input placeholder="Branch Name" className="input md:col-span-2" />
                </div>
              </div>

              {/* Tax */}
              <div>
                <h3 className="font-semibold mb-4">Tax Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="PAN" className="input" />
                  <input placeholder="GST" className="input" />
                  <input placeholder="CIN" className="input" />
                  <input placeholder="TAN" className="input" />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default AdminNavbar;
