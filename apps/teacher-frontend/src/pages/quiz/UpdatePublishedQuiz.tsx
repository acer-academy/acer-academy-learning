import { QuizData } from '@acer-academy-learning/data-access';
import { useMemo } from 'react';
import { QuizTabs } from './components/QuizTab';
import { ViewQuizDetailsSection } from './components/ViewQuizDetailsSection';
import { useLocation } from 'react-router-dom';
import { CREATE_QUIZ_QUESTIONS_HASH } from '../../libs/routes';
import { BackButton } from '@acer-academy-learning/common-ui';
import { UpdatePublishedQuizQuestionsSection } from './components/UpdatePublishedQuizQuestionsSection';

export type UpdatePublishedQuizProps = {
  quiz: QuizData;
};

export const UpdatePublishedQuiz = ({ quiz }: UpdatePublishedQuizProps) => {
  const location = useLocation();
  const currentTabComponent = useMemo(() => {
    switch (location.hash.slice(1)) {
      case CREATE_QUIZ_QUESTIONS_HASH:
        return <UpdatePublishedQuizQuestionsSection quiz={quiz} />;
      default:
        return <ViewQuizDetailsSection quiz={quiz} />;
    }
  }, [location, quiz]);
  return (
    <div className="space-y-4">
      <BackButton />
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col min-h-[70vh]">
        <h1 className="text-3xl font-bold tracking-tight ">{quiz.title}</h1>
        <QuizTabs />
        {currentTabComponent}
      </div>
    </div>
  );
};
