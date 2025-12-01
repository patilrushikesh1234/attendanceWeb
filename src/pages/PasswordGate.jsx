import React, { useState } from "react";
import "../styles/PasswordGate.css";

const DEFAULT_PASSWORD = "123";

export default function PasswordGate({ onSuccess, password = DEFAULT_PASSWORD }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    value === password ? onSuccess() : setError("Incorrect password. Try again.");
  };

  return (
    <section className="gate-shell">
      <article className="gate-card">
        <h1>Secure Access</h1>
        <p>Enter the daily security key to unlock attendance tools.</p>
        <form className="gate-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="gate-input"
            placeholder="Access password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(""); }}
          />
          <button type="submit" className="gate-submit">Unlock dashboard</button>
        </form>
        {error && <p className="gate-error">{error}</p>}
      </article>
    </section>
  );
}
