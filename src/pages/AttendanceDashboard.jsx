import React, { useState } from 'react';
import AttendanceStats from '../Attendance/AttendanceStats';
import AttendanceHistory from '../Attendance/AttendanceHistory';
import MonthlyReport from '../Attendance/MonthlyReport';
import CalendarView from '../Attendance/CalendarView';
import BackNavbar from './Career/BackNavbar';
// Optional: If you have a CheckIn component, import it here
// import AttendanceCheckIn from '../Attendance/AttendanceCheckIn'; 

const AttendanceDashboard = () => {
  // Get current IST month and year for initial API calls
  const now = new Date();
  const currentIST = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric'
  }).formatToParts(now);

  const initialYear = currentIST.find(p => p.type === 'year').value;
  const initialMonth = currentIST.find(p => p.type === 'month').value;

  const [employeeId] = useState(localStorage.getItem('employeeId') || 'EMP001');
  const [employeeName] = useState('Susant');
  const [activeTab, setActiveTab] = useState('checkin');
  
  // Shared state for filtering reports/calendar
  const [selectedDate, setSelectedDate] = useState({
    year: initialYear,
    month: initialMonth
  });

  const tabs = [
    { id: 'checkin', label: 'Check In/Out' },
    { id: 'history', label: 'History' },
    { id: 'report', label: 'Monthly Report' },
    { id: 'calendar', label: 'Calendar' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <BackNavbar />

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        
        {/* Header - Minimalist Black & White */}
        <header className="mb-10 pb-8 border-b border-gray-100 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">
              Attendance
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-sm uppercase tracking-widest">
                {employeeId}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {employeeName}
              </span>
            </div>
          </div>
          
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Timezone</p>
            <p className="text-xs font-bold text-gray-500 uppercase">India Standard Time (IST)</p>
          </div>
        </header>

        {/* Stats Section - Pass employeeId to fetch from API 3 */}
        <div className="mb-12">
          <AttendanceStats employeeId={employeeId} />
        </div>

        {/* Navigation Tabs - Modern Underline Style */}
        <div className="mb-10 border-b border-gray-100">
          <nav className="flex gap-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab.id
                    ? 'text-black'
                    : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-black animate-in fade-in duration-300" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content with IST Data Handling */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {activeTab === 'checkin' && (
            <div className="max-w-2xl bg-gray-50 p-8 border border-gray-100">
               {/* Replace this div with your actual CheckIn Component */}
               <h3 className="text-xs font-black uppercase tracking-widest mb-4">Terminal</h3>
               <p className="text-gray-400 text-sm italic">Ready for Punch In/Out sequence...</p>
            </div>
          )}
          
          {activeTab === 'history' && (
            <AttendanceHistory employeeId={employeeId} />
          )}
          
          {activeTab === 'report' && (
            <MonthlyReport 
              employeeId={employeeId} 
              year={selectedDate.year} 
              month={selectedDate.month} 
            />
          )}
          
          {activeTab === 'calendar' && (
            <CalendarView 
              employeeId={employeeId} 
              year={selectedDate.year} 
              month={selectedDate.month} 
            />
          )}
        </div>
      </main>

      {/* Optional: Simple Footer */}
      <footer className="container mx-auto px-6 py-12 max-w-7xl border-t border-gray-50">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          © 2026 Wemis Systems · Secure Attendance Log
        </p>
      </footer>
    </div>
  );
};

export default AttendanceDashboard;