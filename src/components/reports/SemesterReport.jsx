import React, { useMemo } from "react";
import { exportSemesterCSV } from "../../utils/helpers";
import useLocalStorage from "../../hooks/useLocalStorage";
import "../../styles/components/SemesterReport.css";

export default function SemesterReport() {
  const [students] = useLocalStorage("students", []);
  const [records] = useLocalStorage("records", {});

  const stats = useMemo(() => {
    const dates = Object.keys(records);
    const totalDays = dates.length;
    return students.map((student) => {
      const present = dates.reduce(
        (count, date) =>
          records[date]?.[student.id] === "Present" ? count + 1 : count,
        0
      );
      const percent = totalDays ? ((present / totalDays) * 100).toFixed(1) : "0.0";
      return {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        present,
        absent: totalDays - present,
        total: totalDays,
        percent,
      };
    });
  }, [students, records]);

  const handleDownload = () => exportSemesterCSV(stats);

  return (
    <article className="report-card">
      <div className="report-header">
        <div>
          <h2>Semester Report</h2>
          <p className="empty-state">75% minimum attendance required.</p>
        </div>
        <button className="download-btn" type="button" onClick={handleDownload}>
          Export CSV
        </button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Roll</th>
            <th>Student</th>
            <th>Present / Total</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((student) => {
            const isEligible = parseFloat(student.percent) >= 75;
            return (
              <tr key={student.id}>
                <td>{student.rollNumber || "N/A"}</td>
                <td>{student.name}</td>
                <td>
                  {student.present} / {student.total}
                </td>
                <td>{student.percent}%</td>
                <td>
                  <span className={`badge ${isEligible ? "ok" : "low"}`}>
                    {isEligible ? "Eligible" : "Low attendance"}
                  </span>
                </td>
              </tr>
            );
          })}
          {stats.length === 0 && (
            <tr>
              <td colSpan="5" className="empty-state">
                No records yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </article>
  );
}

