import { createContext, useState } from "react";

type AppContextInterface = {
  showStats: boolean;
  setShowStats: (showStats: boolean) => void;
  filmsData: any[];
  setFilmsData: (filmsData: any) => void;
};

export const DataContext = createContext<AppContextInterface | null>(null);

export function DataContextProvider({ children }: any) {
  const [showStats, setShowStats] = useState(false);
  const [filmsData, setFilmsData] = useState([]);

  const data = {
    showStats,
    setShowStats,
    filmsData,
    setFilmsData,
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
