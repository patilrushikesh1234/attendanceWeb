import React, { useState, useEffect } from "react";
import "../../styles/ClassSelector.css";

const DEFAULT_CLASSES = [
  { id: "FYBCA", name: "FY BCA" },
  { id: "SYBCA", name: "SY BCA" },
  { id: "TYBCA", name: "TY BCA" },
  { id: "FYBCS", name: "FY BCS" },
  { id: "SYBCS", name: "SY BCS" },
  { id: "TYBCS", name: "TY BCS" },
];

export default function ClassSelector({ currentClass, onSelectClass }) {
  const [classes, setClasses] = useState([]);

  // Load classes from Local Storage on mount, or initialize with defaults
  useEffect(() => {
    const stored = localStorage.getItem("classList");
    let initialClasses = DEFAULT_CLASSES;

    if (stored) {
      try {
        const parsedClasses = JSON.parse(stored);
        
        // This logic is added to ensure new default classes (like BCS) are included 
        // if the stored list is outdated.
        const storedIds = new Set(parsedClasses.map(cls => cls.id));
        const newDefaults = DEFAULT_CLASSES.filter(cls => !storedIds.has(cls.id));
        initialClasses = [...parsedClasses, ...newDefaults];

      } catch(e) {
        // Fallback if stored data is corrupted
        console.error("Corrupted classList data in Local Storage. Using defaults.", e);
      }
    } 

    setClasses(initialClasses);
    localStorage.setItem("classList", JSON.stringify(initialClasses));

  }, []);

  const handleChange = (e) => {
    const selected = e.target.value;
    onSelectClass(selected); // Calls the parent component's handler
  };

  // Although this variable is defined, it is not used in the render block provided.
  // const selectedClass = classes.find(cls => cls.id === currentClass); 

  return (
    <div className="class-selector-container">
      <div className="class-selector-wrapper">
        <label htmlFor="class-select" className="class-label">
          Select Class for take attendance:
        </label>
        <select
          id="class-select"
          className="class-select"
          value={currentClass || ""}
          onChange={handleChange}
        >
          <option value="">-- Select a Class --</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}