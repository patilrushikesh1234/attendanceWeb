import React, { useState, useEffect } from "react";
import { loadJSON, exportSemesterCSV } from "../../utils/helpers";
import "../../styles/SemesterReport.css";

export default function SemesterReport({ classId, refresh }) {
  const [reportData, setReportData] = useState([]);

  const attendanceKey = `attendance_${classId}`;
  const studentsKey = `students_${classId}`;

  useEffect(() => {
    const students = loadJSON(studentsKey, []);
    const allAttendance = loadJSON(attendanceKey, {});

    // Build report
    const report = students.map(s => {
      let total = 0, present = 0;
      Object.values(allAttendance).forEach(dayRecord => {
  total++;  // Count every day
  if (dayRecord[s.id] === "Present") {
    present++;
  }
});
const absent = total - present;

      
      const percent = total ? Math.round((present / total) * 100) : 0;
      return {
        id: s.id,
        rollNumber: s.rollNumber,
        name: s.name,
        total,
        present,
        absent,
        percent
      };
    });

    setReportData(report);

  }, [classId, refresh]); // refresh triggers immediate reload

  const handleExport = () => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }
    exportSemesterCSV(reportData);
  };

  return (
    <div className="report-card">
      <div className="report-header">
        <h2>Semester Report</h2>
        <button className="download-btn" onClick={handleExport}>Export CSV</button>
      </div>
      <div className="scroll">
        <marquee behavior="scroll" direction="left">Minimum 75% Attendace require</marquee>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th> Student Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>%</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length === 0 ? (
            <tr><td colSpan="7" className="empty-state">No data</td></tr>
          ) : (
            reportData.map(s => (
              <tr key={s.id}>
                <td>{s.rollNumber}</td>
                <td>{s.name}</td>
                <td>{s.present}</td>
                <td>{s.absent}</td>
                <td>{s.percent}%</td>
                <td>{s.percent >= 75 ? "Eligible" : "Low Attendance"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
