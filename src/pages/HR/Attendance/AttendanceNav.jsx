import React from 'react';
import { Link } from 'react-router-dom';

const AttendanceNav = () => {
  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="attendanceDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Attendance
      </a>
      <ul className="dropdown-menu" aria-labelledby="attendanceDropdown">
        <li><Link className="dropdown-item" to="/attendance/calendar">Calendar</Link></li>
        <li><Link className="dropdown-item" to="/attendance/employee">Employee Attendance</Link></li>
        <li><Link className="dropdown-item" to="/attendance/leave">Leave Management</Link></li>
        <li><Link className="dropdown-item" to="/attendance/reports">Reports</Link></li>
      </ul>
    </li>
  );
};

export default AttendanceNav;