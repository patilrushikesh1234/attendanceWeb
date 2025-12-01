// helpers.js

// ---------------- CSV Export ----------------
export function downloadCSV(filename, rows) {
  const escapeCell = (c) => {
    if (c == null) return "";
    const s = String(c);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = rows.map(r => r.map(escapeCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------- Export Semester CSV ----------------
export function exportSemesterCSV(reportData = []) {
  const rows = [
    ["Roll Number", "Student Name", "Total Days", "Present", "Absent", "Percentage", "Status"]
  ];

  reportData.forEach(r => {
    const status = parseFloat(r.percent) >= 75 ? "Eligible" : "Low Attendance";
    rows.push([
      r.rollNumber || "",
      r.name || "",
      r.total || 0,
      r.present || 0,
      r.absent || 0,
      `${r.percent || 0}%`,
      status
    ]);
  });

  downloadCSV("semester_report.csv", rows);
}

// ---------------- Local Storage ----------------
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
