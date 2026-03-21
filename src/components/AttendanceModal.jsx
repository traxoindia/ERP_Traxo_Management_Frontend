import React from 'react';

const AttendanceModal = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Attendance Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Date:</strong> {record.date}</p>
            <p><strong>Check-in:</strong> {record.check_in}</p>
            <p><strong>Check-out:</strong> {record.check_out}</p>
            <p><strong>Status:</strong> {record.status}</p>
            <p><strong>Late:</strong> {record.late_by} min</p>
            <p><strong>Overtime:</strong> {record.overtime} min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;