import React, { useState, useEffect } from 'react';
import { getAttendanceStatus, isHalfDay } from '../Attendance/utils/ locationUtils';
import attendanceService from '../services/AttendanceService';

const AttendanceHistory = ({ employeeId }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  const fetchAttendance = async () => {
    setLoading(true);
    const result = await attendanceService.getAttendance(employeeId);
    if (result.success) {
      setAttendance(result.data || []);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '--';
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusText = (checkIn, checkOut) => {
    if (!checkIn) return 'Absent';
    
    const status = getAttendanceStatus(checkIn);
    const halfDay = isHalfDay(checkOut);
    
    if (halfDay && checkOut) return 'Half Day';
    if (status === 'LATE') return 'Late';
    if (status === 'ON_TIME') return 'On Time';
    return 'Present';
  };

  const getStatusClass = (checkIn, checkOut) => {
    if (!checkIn) return 'text-gray-400';
    
    const status = getAttendanceStatus(checkIn);
    const halfDay = isHalfDay(checkOut);
    
    if (halfDay && checkOut) return 'text-gray-600';
    if (status === 'LATE') return 'text-gray-700';
    return 'text-gray-900';
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-900">Attendance History</h2>
      </div>
      
      {error && (
        <div className="p-4 m-4 border border-gray-200 rounded text-sm text-gray-600">
          {error}
        </div>
      )}

      {attendance.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No attendance records found
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {attendance.map((record, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(record.checkIn || record.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>In: {formatTime(record.checkIn)}</span>
                    <span>Out: {formatTime(record.checkOut)}</span>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getStatusClass(record.checkIn, record.checkOut)}`}>
                  {getStatusText(record.checkIn, record.checkOut)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;