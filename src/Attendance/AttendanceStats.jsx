import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';

const AttendanceStats = ({ employeeId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    setLoading(true);
    const statsResult = await attendanceService.getDashboardStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <div className="text-center py-2 text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const items = [
    { label: 'Total', value: stats?.totalEmployees || 0 },
    { label: 'Present', value: stats?.presentToday || 0 },
    { label: 'Absent', value: stats?.absentToday || 0 },
    { label: 'Attendance', value: stats?.totalEmployees ? 
      `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}%` : '0%' }
  ];

  return (
    <div className="border border-gray-200 rounded-lg mb-6">
      <div className="grid grid-cols-4 divide-x divide-gray-200">
        {items.map((item, idx) => (
          <div key={idx} className="px-4 py-3 text-center">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-xl font-light text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceStats;