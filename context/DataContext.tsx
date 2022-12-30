import { createContext, useState } from "react";

type AppContextInterface = {
  showStats: boolean;
  setShowStats: (showStats: boolean) => void;
};

export const DataContext = createContext<AppContextInterface | null>(null);

export function DataContextProvider({ children }: any) {
  const [showStats, setShowStats] = useState(false);

  const data = {
    showStats,
    setShowStats,
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
