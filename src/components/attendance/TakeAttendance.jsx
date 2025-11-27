import React, { useEffect, useMemo, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { exportTodayAttendanceCSV } from "../../utils/helpers";
import "../../styles/components/TakeAttendance.css";

export default function TakeAttendance() {
  const [students] = useLocalStorage("students", []);
  const [records, setRecords] = useLocalStorage("records", {});
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [session, setSession] = useState({});

  useEffect(() => {
    const snapshot = records[date] || {};
    const initialSession = {};
    students.forEach((student) => {
      initialSession[student.id] = snapshot[student.id] || "Absent";
    });
    setSession(initialSession);
  }, [date, students, records]);

  const presentCount = useMemo(
    () => Object.values(session).filter((status) => status === "Present").length,
    [session]
  );

  const toggleStatus = (studentId) => {
    setSession((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSave = () => {
    setRecords((prev) => ({ ...prev, [date]: session }));
    alert("Attendance saved successfully.");
  };

  const handleExportToday = () => {
    exportTodayAttendanceCSV({ dateStr: date, students, record: session });
  };

  return (
    <article className="attendance-card">
      <header>
        <h2>Attendance</h2>
        <p className="empty-state">
          {presentCount} / {students.length || 0} marked present for {date}.
        </p>
      </header>

      <div className="attendance-toolbar">
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <button className="primary" type="button" onClick={handleSave}>
          Save session
        </button>
        <button className="ghost" type="button" onClick={handleExportToday}>
          Download CSV
        </button>
      </div>

      <div className="attendance-list">
        {students.length === 0 && (
          <p className="empty-state">Add students to take attendance.</p>
        )}

        {students.map((student) => {
          const present = session[student.id] === "Present";
          return (
            <div
              key={student.id}
              className={`attendance-tile ${present ? "present" : "absent"}`}
              onClick={() => toggleStatus(student.id)}
            >
              <div className="tile-identity">
                <span className="roll-chip">{student.rollNumber || "N/A"}</span>
                <span>{student.name}</span>
              </div>
              <strong>{present ? "Present" : "Absent"}</strong>
            </div>
          );
        })}
      </div>
    </article>
  );
}

