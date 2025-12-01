import React, { useState, useEffect } from "react";
import PasswordGate from "./pages/PasswordGate";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    localStorage.removeItem("accessAllowed");
    setIsUnlocked(false);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => localStorage.removeItem("accessAllowed");
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleSuccess = () => {
    localStorage.setItem("accessAllowed", "true");
    setIsUnlocked(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessAllowed");
    setIsUnlocked(false);
  };

  return !isUnlocked ? <PasswordGate onSuccess={handleSuccess} /> : <Dashboard onLogout={handleLogout} />;
}
