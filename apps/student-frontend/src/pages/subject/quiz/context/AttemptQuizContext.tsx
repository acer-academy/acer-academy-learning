import { QuizData } from '@acer-academy-learning/data-access';
import { PropsWithChildren, createContext, useContext } from 'react';

export type AttemptQuizContextState = {
  quiz: QuizData;
  timeAllowedInMS?: number;
};

const AttemptQuizContext = createContext({} as AttemptQuizContextState);

export type AttemptQuizContextProviderProps = {
  value: AttemptQuizContextState;
} & PropsWithChildren;

export const useAttemptQuizContext = () => {
  const context = useContext(AttemptQuizContext);
  if (!context) {
    throw new Error(
      'useAttemptQuizContext must be used within an AttemptQuizContextProvider',
    );
  }

  return context;
};

export const AttemptQuizContextProvider = ({
  children,
  value,
}: AttemptQuizContextProviderProps) => {
  return (
    <AttemptQuizContext.Provider value={value}>
      {children}
    </AttemptQuizContext.Provider>
  );
};
