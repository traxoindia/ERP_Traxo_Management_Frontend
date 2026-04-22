import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, User, LogOut } from 'lucide-react';
import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('checkin');
    const [userData, setUserData] = useState({
        name: 'Employee',
        id: '',
        designation: '',
        profilePic: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve data from localStorage
        const storedName = localStorage.getItem('name');
        const storedId = localStorage.getItem('employeeId');
        const storedDesignation = localStorage.getItem('designation');
        const storedPic = localStorage.getItem('profilePic');

        // Check if token exists, if not redirect to login
        if (!localStorage.getItem('accessToken')) {
            navigate('/');
        } else {
            setUserData({
                name: storedName || 'Employee',
                id: storedId || '',
                designation: storedDesignation || '',
                profilePic: storedPic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            });
        }
    }, [navigate]);

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
            <EmployeeNavbar onLogout={handleLogout} />
            <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="md:ml-64 pt-0">
                {/* Welcome Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-8">
                    <div className="flex items-center gap-4">
                        <img 
                            src={userData.profilePic} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full border-2 border-orange-100"
                        />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
                                Hello, <span className="text-orange-600">{userData.name}</span>! 
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {userData.designation} | Employee ID: {userData.id}
                            </p>
                        </div>
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
                                    className={`flex-1 py-3 flex flex-col items-center gap-1 transition ${
                                        activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
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
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Attendance Actions</h2>
                            <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                <p className="text-gray-400 italic">Attendance system components go here...</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Your Detailed Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium">{userData.name}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Employee ID</p>
                                    <p className="font-medium">{userData.id}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Current Designation</p>
                                    <p className="font-medium">{userData.designation}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;