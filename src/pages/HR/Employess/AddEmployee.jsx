import React, { useState } from 'react';
import NewHireForm from './NewHireForm';
import CurrentEmployees from './CurrentEmployees';
import PastEmployees from './PastEmployees';
import NewHiresList from './NewHiresList';
import BackNavbar from '../../Career/BackNavbar';

export default function AddEmployee() {
  const [activeTab, setActiveTab] = useState('current');
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
   
    { id: 'current', label: ' Current Employees' },
    { id: 'past', label: 'Past Employees' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
    <BackNavbar/>
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Employee Management System</h1>
        <p className="text-sm text-gray-500 mt-1">Complete employee lifecycle management</p>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-full mx-auto bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-4 text-center text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-8 min-h-[500px]">
            {activeTab === 'current' && <CurrentEmployees key={`current-${refreshKey}`} />}
            {activeTab === 'past' && <PastEmployees key={`past-${refreshKey}`} />}
          </div>
        </div>
      </main>
    </div>
    </>
  );

}