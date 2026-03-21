import React from 'react';

const AttendanceTable = ({ records }) => {
  if (!records.length) return <p>No records found.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Status</th>
          <th>Late (min)</th>
          <th>Overtime (min)</th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => (
          <tr key={record.attendance_id}>
            <td>{record.date}</td>
            <td>{record.check_in}</td>
            <td>{record.check_out}</td>
            <td>{record.status}</td>
            <td>{record.late_by}</td>
            <td>{record.overtime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceTable;