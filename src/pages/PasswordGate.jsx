import React, { useState } from "react";
import "../styles/components/PasswordGate.css";

const DEFAULT_PASSWORD = "prgbca@123";

export default function PasswordGate({ onSuccess, password = DEFAULT_PASSWORD }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value === password) {
      onSuccess();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <section className="gate-shell">
      <article className="gate-card">
        <h1>Secure Access</h1>
        <p>Enter the daily security key to unlock attendance tools.</p>

        <form className="gate-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="access-password">
            Access password
          </label>
          <input
            id="access-password"
            className="gate-input"
            type="password"
            placeholder="Access password"
            value={value}
            autoComplete="current-password"
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
          />
          <button className="gate-submit" type="submit">
            Unlock dashboard
          </button>
        </form>

        {error && <p className="gate-error">{error}</p>}
        <p className="gate-hint">Need help? Contact your administrator.</p>
      </article>
    </section>
  );
}
