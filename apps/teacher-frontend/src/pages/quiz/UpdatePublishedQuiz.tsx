import { QuizData } from '@acer-academy-learning/data-access';
import { useMemo, useState } from 'react';
import { QuizTabs } from './components/QuizTab';
import { ViewQuizDetailsSection } from './components/ViewQuizDetailsSection';
import { useLocation } from 'react-router-dom';
import {
  CREATE_QUIZ_QUESTIONS_HASH,
  CREATE_QUIZ_STUDENTS_HASH,
} from '../../libs/routes';
import { BackButton, LayoutRole } from '@acer-academy-learning/common-ui';
import { UpdatePublishedQuizQuestionsSection } from './components/UpdatePublishedQuizQuestionsSection';
import { StudentsSection } from './components/StudentsSection';

export type UpdatePublishedQuizProps = {
  quiz: QuizData;
};

export const UpdatePublishedQuiz = ({ quiz }: UpdatePublishedQuizProps) => {
  const location = useLocation();

  const [isPublic, setIsPublic] = useState<boolean>(quiz.isPublic);
  const [allocatedTo, setAllocatedTo] = useState<string[]>(quiz.allocatedTo);

  const currentTabComponent = useMemo(() => {
    switch (location.hash.slice(1)) {
      case CREATE_QUIZ_QUESTIONS_HASH:
        return <UpdatePublishedQuizQuestionsSection quiz={quiz} />;
      case CREATE_QUIZ_STUDENTS_HASH:
        return (
          <StudentsSection
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            allocatedTo={allocatedTo}
            setAllocatedTo={setAllocatedTo}
            publishedQuiz={quiz}
          />
        );
      default:
        return <ViewQuizDetailsSection quiz={quiz} />;
    }
  }, [location, quiz, isPublic, allocatedTo]);
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
