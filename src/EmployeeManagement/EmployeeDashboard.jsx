import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, User } from 'lucide-react';
import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('checkin');
    const [userName, setUserName] = useState('Employee');
    const navigate = useNavigate();

    // Fetch the name from localStorage when the dashboard loads
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    const tabs = [
        { id: 'checkin', label: 'Check In/Out', icon: Home },
        { id: 'history', label: 'My Attendance', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Passing handleLogout to Navbar so the logout button works there too */}
            <EmployeeNavbar onLogout={handleLogout} />
            <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="md:ml-64 pt-0">
                {/* Welcome Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-8">
                    <div className="max-w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                            Hello, <span className="text-orange-600">{userName}</span>! 
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Welcome back. Here is what's happening with your attendance today.
                        </p>
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-40">
                    <div className="flex justify-around">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-6 max-w-7xl mx-auto">
                    {activeTab === 'checkin' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">Attendance Actions</h2>
                            {/* Your Check-in/Out Components go here */}
                            <p className="text-gray-400 italic">Check-in system ready...</p>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">Your Attendance History</h2>
                            {/* History Table goes here */}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">Employee Profile</h2>
                            {/* Profile details go here */}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;