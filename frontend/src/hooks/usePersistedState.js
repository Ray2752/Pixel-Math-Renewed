import { useEffect, useState } from "react";

export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Almacenamiento lleno o bloqueado — seguir sin persistir
    }
  }, [key, value]);

  return [value, setValue];
}
