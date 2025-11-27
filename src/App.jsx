import React, { useEffect, useState } from "react";
import PasswordGate from "./pages/PasswordGate";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setIsUnlocked(localStorage.getItem("accessAllowed") === "true");
  }, []);

  const handleSuccess = () => {
    localStorage.setItem("accessAllowed", "true");
    setIsUnlocked(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessAllowed");
    setIsUnlocked(false);
  };

  if (!isUnlocked) {
    return <PasswordGate onSuccess={handleSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
