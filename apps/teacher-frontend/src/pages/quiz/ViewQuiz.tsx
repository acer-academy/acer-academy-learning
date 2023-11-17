import { QuizData } from '@acer-academy-learning/data-access';
import React, { useMemo } from 'react';
import { QuizTabs } from './components/QuizTab';
import { ViewQuizDetailsSection } from './components/ViewQuizDetailsSection';
import { useLocation } from 'react-router-dom';
import {
  CREATE_QUIZ_QUESTIONS_HASH,
  CREATE_QUIZ_STUDENTS_HASH,
} from '../../libs/routes';
import { ViewQuizQuestionsSection } from './components/ViewQuizQuestionsSection';
import { BackButton, LayoutRole } from '@acer-academy-learning/common-ui';
import { StudentsSection } from './components/StudentsSection';

export type ViewQuizProps = {
  quiz: QuizData;
};

export const ViewQuiz = ({ quiz }: ViewQuizProps) => {
  const location = useLocation();
  const currentTabComponent = useMemo(() => {
    switch (location.hash.slice(1)) {
      case CREATE_QUIZ_QUESTIONS_HASH:
        return <ViewQuizQuestionsSection quiz={quiz} />;
      case CREATE_QUIZ_STUDENTS_HASH:
        return (
          <StudentsSection
            viewOnly={true}
            isPublic={quiz.isPublic}
            allocatedTo={quiz.allocatedTo}
            publishedQuiz={quiz}
            setAllocatedTo={() => {}}
            setIsPublic={() => {}}
          />
        );
      default:
        return <ViewQuizDetailsSection quiz={quiz} />;
    }
  }, [location, quiz]);
  return (
    <div className="space-y-4">
      <BackButton role={LayoutRole.Teacher} />
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col min-h-[70vh]">
        <h1 className="text-3xl font-bold tracking-tight ">{quiz.title}</h1>
        <QuizTabs />
        {currentTabComponent}
      </div>
    </div>
  );
};
