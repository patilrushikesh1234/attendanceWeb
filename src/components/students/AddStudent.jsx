import React, { useState, useEffect } from "react";
import "../../styles/AddStudent.css";
import { loadJSON, saveJSON } from "../../utils/helpers";

export default function AddStudent({ classId }) {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");

  const storageKey = `students_${classId}`; // unique key per class

  useEffect(() => {
    const saved = loadJSON(storageKey, []);
    setStudents(saved);
  }, [classId]);

  // 🟢 Name Validation: Alphabets only
  const handleNameChange = (e) => {
    const value = e.target.value;

    if (/^[A-Za-z ]*$/.test(value)) {
      setName(value);
      setError("");
    } else {
      setError("Name should contain alphabets only (A-Z).");
    }
  };

  // 🔵 Roll Number Validation: Numbers only
  const handleRollChange = (e) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value)) {
      setRollNumber(value);
      setError("");
    } else {
      setError("Roll Number should contain numbers only (0-9).");
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!name.trim() || !rollNumber.trim()) {
      setError("Name and Roll Number are required");
      return;
    }

    if (students.find((s) => s.rollNumber === rollNumber)) {
      setError("Roll Number must be unique in this class");
      return;
    }

    const newStudent = { id: Date.now(), name, rollNumber };
    const updated = [...students, newStudent];

    setStudents(updated);
    saveJSON(storageKey, updated);

    setName("");
    setRollNumber("");
    setError("");
  };

  const handleDelete = (id) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveJSON(storageKey, updated);
  };

  return (
    <div className="add-card">
      <h2>Add Student</h2>

      <form className="add-form" onSubmit={handleAddStudent}>
        <input
          className="add-input"
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={handleNameChange}
        />

        <input
          className="add-input"
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={handleRollChange}
        />

        <button className="add-submit" type="submit">
          Add Student
        </button>
      </form>

      {error && <div className="form-error">{error}</div>}

      <div className="students-list">
        {students.map((s) => (
          <div key={s.id} className="student-pill">
            <div>
              <strong>{s.name}</strong>
              <small>Roll: {s.rollNumber}</small>
            </div>
            <button className="pill-action" onClick={() => handleDelete(s.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
