import { useState, useEffect, useCallback } from "react";

export default function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  }, [initialValue, key]);

  const [value, setValue] = useState(readValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(
        new CustomEvent("local-storage", { detail: { key, value } })
      );
    } catch {}
  }, [key, value]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event) => { if (event.key === key) setValue(readValue()); };
    const handleCustom = (event) => { if (event.detail?.key === key) setValue(event.detail.value); };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("local-storage", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("local-storage", handleCustom);
    };
  }, [key, readValue]);

  return [value, setValue];
}
