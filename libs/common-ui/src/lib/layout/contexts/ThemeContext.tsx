import { PropsWithChildren, createContext, useContext } from 'react';
import { LayoutRole } from '../constants';

type ThemeContextStates = {
  role: LayoutRole;
};

export const ThemeContext = createContext({} as ThemeContextStates);
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within an ThemeProvider');
  }
  return context;
};

export type ThemeProviderProps = {
  role: LayoutRole;
} & PropsWithChildren;

export const ThemeProvider = ({ role, children }: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={{ role }}>{children}</ThemeContext.Provider>
  );
};
