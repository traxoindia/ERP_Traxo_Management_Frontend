import React, { useState } from 'react';
import AttendanceStats from '../Attendance/AttendanceStats';
import AttendanceHistory from '../Attendance/AttendanceHistory';
import MonthlyReport from '../Attendance/MonthlyReport';
import CalendarView from '../Attendance/CalendarView';
import BackNavbar from './Career/BackNavbar';

const AttendanceDashboard = () => {
  const [employeeId] = useState('EMP001');
  const [employeeName] = useState('Susant');
  const [activeTab, setActiveTab] = useState('checkin');
  const [attendance, setAttendance] = useState(null);

  const tabs = [
    { id: 'checkin', label: 'Check In/Out' },
    { id: 'history', label: 'History' },
    { id: 'report', label: 'Monthly Report' },
    { id: 'calendar', label: 'Calendar' }
  ];

  const handleAttendanceUpdate = (newAttendance) => {
    setAttendance(newAttendance);
  };

  return (
    <>
        <BackNavbar/>
  
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Attendance Management
          </h1>
          <p className="text-sm text-gray-500">
            {employeeName} · {employeeId}
          </p>
        </div>

        {/* Stats Section */}
        <AttendanceStats employeeId={employeeId} />

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          
          
          {activeTab === 'history' && (
            <AttendanceHistory employeeId={employeeId} />
          )}
          
          {activeTab === 'report' && (
            <MonthlyReport employeeId={employeeId} />
          )}
          
          {activeTab === 'calendar' && (
            <CalendarView employeeId={employeeId} />
          )}
        </div>
      </div>
    </div>
      </>
  );
};

export default AttendanceDashboard;