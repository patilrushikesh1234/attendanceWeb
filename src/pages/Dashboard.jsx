import React from "react";
import AddStudent from "../components/students/AddStudent";
import TakeAttendance from "../components/attendance/TakeAttendance";
import SemesterReport from "../components/reports/SemesterReport";
import "../styles/components/Dashboard.css";

export default function Dashboard({ onLogout }) {
  return (
    <main className="dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="visually-hidden">PresenX Attendance Suite</p>
          <h1>PresenX Attendance Suite</h1>
          <p>Securely add students, capture attendance, and export smart reports.</p>
        </div>
        <div className="dashboard-actions">
          <button className="logout" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <div id="students-section">
          <AddStudent />
        </div>
        <div id="attendance-section">
          <TakeAttendance />
        </div>
        <div id="report-section">
          <SemesterReport />
        </div>
      </section>
    </main>
  );
}

