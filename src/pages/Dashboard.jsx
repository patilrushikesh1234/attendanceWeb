  import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import ClassSelector from "../components/classes/ClassSelector";
import AddStudent from "../components/students/AddStudent";
import TakeAttendance from "../components/attendance/TakeAttendance";
import SemesterReport from "../components/reports/SemesterReport";
import "../styles/Dashboard.css";

export default function Dashboard({ onLogout }) {
  const [currentClass, setCurrentClass] = useLocalStorage("currentClass", "");
  const [showAddStudent, setShowAddStudent] = useState(false);

  const handleSelectClass = (classId) => { setCurrentClass(classId); setShowAddStudent(false); };
  const toggleAddStudent = () => setShowAddStudent(prev => !prev);

  return (
    <main className="dashboard">
      <section className="dashboard-hero">
        <h1>PresenX Attendance Suite</h1>
        <div className="dashboard-actions">
           <button onClick={toggleAddStudent} className="add-student-btn">
            {showAddStudent ? "Hide Add Student" : "Add Student"}
          </button>
        </div>
      </section>

      <div className="college-name"><h2>PRG Science College Dhule</h2></div>

      <ClassSelector currentClass={currentClass} onSelectClass={handleSelectClass} />

      {!currentClass && <div className="no-class-message"><p>Select a class to begin.</p></div>}

      {currentClass && showAddStudent && <AddStudent classId={currentClass} />}

      {currentClass && (
        <div className="dashboard-grid">
          <TakeAttendance classId={currentClass} />
          <SemesterReport classId={currentClass} />
        </div>
      )}
    </main>
  );
}
