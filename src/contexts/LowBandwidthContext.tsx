import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "la121-low-bandwidth";

interface LowBandwidthContextValue {
  lowBandwidth: boolean;
  setLowBandwidth: (value: boolean) => void;
}

const LowBandwidthContext = createContext<LowBandwidthContextValue | undefined>(undefined);

function readStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function LowBandwidthProvider({ children }: { children: ReactNode }) {
  const [lowBandwidth, setLowBandwidthState] = useState(readStoredPreference);

  useEffect(() => {
    document.documentElement.classList.toggle("low-bandwidth", lowBandwidth);
  }, [lowBandwidth]);

  const setLowBandwidth = (value: boolean) => {
    setLowBandwidthState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* preference kept for this visit only */
    }
  };

  return (
    <LowBandwidthContext.Provider value={{ lowBandwidth, setLowBandwidth }}>
      {children}
    </LowBandwidthContext.Provider>
  );
}

export function useLowBandwidth() {
  const context = useContext(LowBandwidthContext);
  if (!context) {
    throw new Error("useLowBandwidth must be used within a LowBandwidthProvider");
  }
  return context;
}
