import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n";

const STORAGE_KEY = "pixel-math-settings";

export const DEFAULT_SETTINGS = {
  language: "es",
  pixelSize: 10,
  colorLevels: 64,
  alpha: 0.7,
  beta: 0.3,
  matrixView: "table",
};

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadStoredSettings);

  // Mantener el atributo lang del documento alineado con el idioma elegido
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const value = useMemo(() => {
    function update(partial) {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // localStorage unavailable (private browsing) — keep in-memory only
        }
        return next;
      });
    }

    function restoreDefaults() {
      update(DEFAULT_SETTINGS);
    }

    function t(key, ...args) {
      const entry = translations[settings.language]?.[key] ?? translations.en[key] ?? key;
      return typeof entry === "function" ? entry(...args) : entry;
    }

    return { settings, update, restoreDefaults, t };
  }, [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
