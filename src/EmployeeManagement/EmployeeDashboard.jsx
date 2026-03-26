import React, { useState } from 'react';


import { Home, Calendar, User, LogOut } from 'lucide-react';
import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeDashboard = () => {

    const [activeTab, setActiveTab] = useState('checkin');

    const tabs = [
        { id: 'checkin', label: 'Check In/Out', icon: Home },
        { id: 'history', label: 'My Attendance', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User }
    ];

    const handleLogout = () => {

        window.location.href = '/login';
    };

    return (
        <>

            <EmployeeNavbar />
            <EmployeeSidebar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

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

                {/* Main Content */}

            </div>
        </>
    );
};

export default EmployeeDashboard;