import React, { useState, useEffect } from "react";
import "../../styles/TakeAttendance.css";
import { loadJSON, saveJSON, downloadCSV } from "../../utils/helpers";

export default function TakeAttendance({ classId, setRefreshReport }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const studentsKey = `students_${classId}`;
  const attendanceKey = `attendance_${classId}`;

  // Load students + attendance on class/date change
  useEffect(() => {
    const savedStudents = loadJSON(studentsKey, []);
    setStudents(savedStudents);

    const allAttendance = loadJSON(attendanceKey, {});
    setAttendance(allAttendance[date] || {});
  }, [classId, date]);


  // Toggle Present / Absent
  const toggleStatus = (id) => {
    const newStatus = attendance[id] === "Present" ? "Absent" : "Present";
    const updated = { ...attendance, [id]: newStatus };

    setAttendance(updated);

    const allAttendance = loadJSON(attendanceKey, {});
    allAttendance[date] = updated;
    saveJSON(attendanceKey, allAttendance);
  };


  // ✅ Save Session — sends to SemesterReport IMMEDIATELY
  const saveSession = () => {
    const allAttendance = loadJSON(attendanceKey, {});
    allAttendance[date] = attendance;
    saveJSON(attendanceKey, allAttendance);

    // 🔥 This forces SemesterReport to reload immediately
    if (setRefreshReport) {
      setRefreshReport(prev => !prev);
    }

    alert("Session Saved Successfully!");
  };


  // Export today's CSV
  const exportTodayCSV = () => {
    if (students.length === 0) {
      alert("No students available.");
      return;
    }

    const rows = [["Date", "Roll No", "Student Name", "Status"]];

    students.forEach((s) => {
      rows.push([
        date,
        s.rollNumber,
        s.name,
        attendance[s.id] || "Absent"
      ]);
    });

    downloadCSV(`attendance_${classId}_${date}.csv`, rows);
  };


  return (
    <div className="attendance-card">
      <header>
        <h2>Take Attendance</h2>

        <div className="date-set">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </header>

      <div className="attendance-list">
        {students.length === 0 && (
          <p className="empty-state">No students in this class</p>
        )}

        {students.map((s) => (
          <div
            key={s.id}
            className={`attendance-circle ${attendance[s.id] === "Present" ? "present" : "absent"
              }`}
            onClick={() => toggleStatus(s.id)}
          >
            <span className="roll-number">{s.rollNumber}</span>
          </div>
        ))}
      </div>

      <div className="attendance-actions">
        <button className="save-session-btn" onClick={saveSession}>
          Save Session
        </button>

        <button className="export-csv-btn" onClick={exportTodayCSV}>
          Export CSV
        </button>
      </div>
    </div>
  );
}
