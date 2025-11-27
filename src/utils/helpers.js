// helpers: CSV + localStorage helpers
export function downloadCSV(filename, rows) {
  const escapeCell = (c) => {
    if (c === null || c === undefined) return "";
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

export function exportTodayAttendanceCSV({ dateStr, students = [], record = {} }) {
  const rows = [["Date", "Roll Number", "Student Name", "Status"]];
  students.forEach(s => {
    rows.push([dateStr, s.rollNumber || "", s.name, record[s.id] || "Absent"]);
  });
  downloadCSV(`attendance_${dateStr}.csv`, rows);
}

export function exportSemesterCSV(stats = []) {
  const rows = [["Roll Number", "Student Name", "Total Days", "Present", "Absent", "Percentage", "Status"]];
  stats.forEach(r => {
    const status = parseFloat(r.percent) >= 75 ? "Eligible" : "Low Attendance";
    rows.push([r.rollNumber || "", r.name, r.total, r.present, r.absent, `${r.percent}%`, status]);
  });
  downloadCSV("semester_report.csv", rows);
}

// localStorage helpers (small)
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
