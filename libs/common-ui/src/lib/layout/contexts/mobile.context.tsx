import { PropsWithChildren, createContext, useState } from 'react';

type MobileContextStates = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
};

export const MobileContext = createContext({} as MobileContextStates);

export const MobileProvider = ({ children }: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MobileContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </MobileContext.Provider>
  );
};
