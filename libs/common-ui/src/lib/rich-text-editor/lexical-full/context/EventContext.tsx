import { PropsWithChildren, createContext, useContext } from 'react';

type EditorEventContextState = {
  isFocused: boolean;
  isContentLoaded: boolean;
  setIsContentLoaded: (isContentLoaded: boolean) => void;
  hasError?: boolean;
  setIsFocused: (isFocused: boolean) => void;
};

const EditorEventContext = createContext({} as EditorEventContextState);

export const useEditorEventContext = () => {
  const context = useContext(EditorEventContext);
  if (!context) {
    throw new Error(
      'useEditorEventContext must be used within an ThemeProvider',
    );
  }
  return context;
};

export type EditorEventContextProps = {
  value: EditorEventContextState;
} & PropsWithChildren;

export const EditorEventContextProvider = ({
  value,
  children,
}: EditorEventContextProps) => {
  return (
    <EditorEventContext.Provider value={value}>
      {children}
    </EditorEventContext.Provider>
  );
};
