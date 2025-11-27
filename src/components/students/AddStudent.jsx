import React, { useMemo, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { loadJSON, saveJSON } from "../../utils/helpers";
import "../../styles/components/AddStudent.css";

const getId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function AddStudent() {
  const [students, setStudents] = useLocalStorage("students", []);
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");

  const rollTaken = useMemo(() => new Set(students.map((s) => s.rollNumber?.trim().toLowerCase()).filter(Boolean)), [students]);

  const handleAdd = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedRoll = roll.trim();

    if (!trimmedName || !trimmedRoll) {
      setError("Both name and roll number are required.");
      return;
    }
    if (rollTaken.has(trimmedRoll.toLowerCase())) {
      setError("This roll number is already assigned.");
      return;
    }

    setStudents((prev) => [...prev, { id: getId(), name: trimmedName, rollNumber: trimmedRoll }]);
    setName("");
    setRoll("");
    setError("");
  };

  const handleRemove = (studentId) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId));

    // Clean up existing attendance records for removed student
    const records = loadJSON("records", {});
    Object.keys(records).forEach((date) => {
      if (records[date]?.[studentId]) {
        delete records[date][studentId];
      }
    });
    saveJSON("records", records);
  };

  return (
    <article className="add-card">
      <div>
        <p className="visually-hidden">Add or manage students</p>
        <h2>Students</h2>
        <p className="empty-state">Create and maintain your roster.</p>
      </div>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="add-input"
          placeholder="Full name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
        />
        <input
          className="add-input"
          placeholder="Roll number"
          value={roll}
          onChange={(event) => {
            setRoll(event.target.value);
            setError("");
          }}
        />
        <button className="add-submit" type="submit">
          Add student
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      <div className="students-list">
        {students.length === 0 && <p className="empty-state">No students yet.</p>}
        {students.map((student) => (
          <div className="student-pill" key={student.id}>
            <div>
              <strong>{student.name}</strong>
              <small>Roll: {student.rollNumber || "—"}</small>
            </div>
            <button
              type="button"
              className="pill-action"
              onClick={() => handleRemove(student.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

