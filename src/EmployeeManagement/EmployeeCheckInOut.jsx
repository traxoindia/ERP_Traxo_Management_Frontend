import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Loader2, MapPin, Calendar, User, History, Search, Send, LogOut } from 'lucide-react';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeNavbar from './EmployeeNavbar';

const EmployeeCheckInOut = () => {
  const [activeTab, setActiveTab] = useState('punch');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [leaveForm, setLeaveForm] = useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [locationVerified, setLocationVerified] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    halfDays: 0,
    absentDays: 0,
    totalHours: 0
  });

  const employeeId = localStorage.getItem('employeeId');
  const employeeName = localStorage.getItem('name') || "Employee";
  const token = localStorage.getItem('accessToken');

  const OFFICE_LAT = 21.485979;
  const OFFICE_LNG = 86.907287;
  const OFFICE_RADIUS = 50;

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    const date = new Date(isoString.endsWith('Z') ? isoString : isoString + 'Z');
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatWorkingHours = (hours) => {
    if (!hours && hours !== 0) return "--";
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    if (hrs === 0 && mins > 0) return `${mins}m`;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    verifyLocation();
    fetchHistory();
    return () => clearInterval(timer);
  }, []);

  const verifyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, OFFICE_LAT, OFFICE_LNG);
      setLocationVerified(dist <= OFFICE_RADIUS);
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`https://api.wemis.in/api/attendance/${employeeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const records = Array.isArray(data) ? data : [data];
      setHistory(records);

      const totalDays = records.length;
      const presentDays = records.filter(r => r.status === 'PRESENT').length;
      const halfDays = records.filter(r => r.status === 'HALF_DAY').length;
      const absentDays = records.filter(r => r.status === 'ABSENT').length;
      const totalHours = records.reduce((sum, r) => sum + (r.workingHours || 0), 0);

      setStats({ totalDays, presentDays, halfDays, absentDays, totalHours });

      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = records.find(r => r.date === todayStr);
      if (todayRecord) setCurrentStatus(todayRecord);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAction = async (type) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`https://api.wemis.in/api/attendance/${type}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: type === 'check-in' ? JSON.stringify({ lat: OFFICE_LAT, lng: OFFICE_LNG }) : null
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data);
        setMessage({ type: 'success', text: `Punched ${type === 'check-in' ? 'In' : 'Out'} successfully` });
        fetchHistory();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Action failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Connection error" });
    }
    setLoading(false);
  };

  const handleLeaveApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('https://api.wemis.in/api/leave/apply', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, ...leaveForm })
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Leave application submitted' });
        setLeaveForm({ fromDate: '', toDate: '', reason: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to apply for leave' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    }
    setLoading(false);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PRESENT':
        return { bg: 'bg-green-50', text: 'text-green-700', label: 'Present', icon: CheckCircle };
      case 'HALF_DAY':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Half Day', icon: Clock };
      case 'ABSENT':
        return { bg: 'bg-red-50', text: 'text-red-600', label: 'Absent', icon: AlertCircle };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', label: status || 'Pending', icon: AlertCircle };
    }
  };

  const filteredHistory = history.filter(item =>
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'punch', label: 'Punch', icon: Clock },
    { id: 'history', label: 'History', icon: History },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EmployeeNavbar />

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-light text-gray-900">
                Hello, {employeeName.split(' ')[0]}
              </h1>
              <div className="flex gap-6 mt-4 border-b border-gray-100">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                    className={`pb-2 text-sm transition-colors ${activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-3 text-sm rounded-md flex items-center gap-2 ${message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
                }`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            {/* Punch Tab */}
            {activeTab === 'punch' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Current Time</p>
                    <p className="text-4xl font-light">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentTime.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{locationVerified ? 'Office area' : 'Location pending'}</span>
                  </div>

                  {!currentStatus?.checkIn ? (
                    <button
                      onClick={() => handleAction('check-in')}
                      disabled={loading || !locationVerified}
                      className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Punch In'}
                    </button>
                  ) : !currentStatus?.checkOut ? (
                    <button
                      onClick={() => handleAction('check-out')}
                      disabled={loading}
                      className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Punch Out'}
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-md text-center">
                      Shift Completed
                    </div>
                  )}
                </div>

                <div className="border border-gray-100 rounded-md p-5">
                  <p className="text-xs text-gray-400 uppercase mb-4">Today's Activity</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check In</span>
                      <span className="font-mono">{formatTime(currentStatus?.checkIn) || '--:--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Check Out</span>
                      <span className="font-mono">
                        {currentStatus?.checkOut ? formatTime(currentStatus.checkOut) : (currentStatus?.checkIn ? 'Active' : '--:--')}
                      </span>
                    </div>
                    {currentStatus?.workingHours !== undefined && currentStatus?.checkOut && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hours</span>
                        <span>{formatWorkingHours(currentStatus.workingHours)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Status</span>
                      {currentStatus?.status ? (
                        <span className={`text-sm ${getStatusConfig(currentStatus.status).text}`}>
                          {getStatusConfig(currentStatus.status).label}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          {currentStatus?.checkOut ? 'Completed' : currentStatus?.checkIn ? 'On Duty' : 'Not Started'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-5">
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 border border-gray-100 rounded-md">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-xl font-light">{stats.totalDays}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-md">
                    <p className="text-xs text-gray-400">Present</p>
                    <p className="text-xl font-light text-green-600">{stats.presentDays}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-md">
                    <p className="text-xs text-gray-400">Half Day</p>
                    <p className="text-xl font-light text-yellow-600">{stats.halfDays}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-md">
                    <p className="text-xs text-gray-400">Absent</p>
                    <p className="text-xl font-light text-red-500">{stats.absentDays}</p>
                  </div>
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-2 text-left font-normal text-gray-400">Date</th>
                        <th className="pb-2 text-left font-normal text-gray-400">In</th>
                        <th className="pb-2 text-left font-normal text-gray-400">Out</th>
                        <th className="pb-2 text-left font-normal text-gray-400">Hours</th>
                        <th className="pb-2 text-right font-normal text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyLoading ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-400">
                            <Loader2 className="animate-spin mx-auto" size={20} />
                          </td>
                        </tr>
                      ) : filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-400">No records</td>
                        </tr>
                      ) : (
                        filteredHistory.map((row, idx) => {
                          const config = getStatusConfig(row.status);
                          const Icon = config.icon;
                          return (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="py-3">{formatDate(row.date)}</td>
                              <td className="py-3 font-mono">{formatTime(row.checkIn)}</td>
                              <td className="py-3 font-mono">{formatTime(row.checkOut)}</td>
                              <td className="py-3">{formatWorkingHours(row.workingHours)}</td>
                              <td className="py-3 text-right">
                                <span className={`inline-flex items-center gap-1 text-xs ${config.text}`}>
                                  <Icon size={12} />
                                  {config.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leave Tab */}
            {activeTab === 'leave' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleLeaveApply} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                        value={leaveForm.fromDate}
                        onChange={e => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                        value={leaveForm.toDate}
                        onChange={e => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Reason</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 resize-none"
                      placeholder="Reason for leave..."
                      value={leaveForm.reason}
                      onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:bg-gray-300"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Submit Request'}
                  </button>
                </form>

                <div className="border border-gray-100 rounded-md p-5">
                  <p className="text-xs text-gray-400 uppercase mb-3">Leave Policy</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Leave requests require approval. You'll be notified once reviewed.
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    <p>Annual Leave: 12 days</p>
                    <p className="mt-1">Casual Leave: 4 days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-100 rounded-md p-5">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{employeeName}</p>
                      <p className="text-xs text-gray-400">ID: {employeeId}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Hours</span>
                      <span>{formatWorkingHours(stats.totalHours)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attendance</span>
                      <span>{stats.totalDays ? Math.round(((stats.presentDays + stats.halfDays) / stats.totalDays) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-md p-5">
                  <p className="text-xs text-gray-400 uppercase mb-4">Session</p>
                  <p className="text-sm text-gray-500 mb-4">Sign out from your current session.</p>
                  <button
                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                    className="w-full py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition"
                  >
                    <LogOut size={14} className="inline mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeCheckInOut;