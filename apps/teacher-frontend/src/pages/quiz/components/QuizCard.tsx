import { useEffect, useMemo, useState } from 'react';
import {
  CreateQuizType,
  QuizQuestionInQuizType,
} from '@acer-academy-learning/data-access';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { QuizTabs } from './QuizTab';
import { useLocation, useParams } from 'react-router-dom';
import {
  CREATE_QUIZ_QUESTIONS_HASH,
  CREATE_QUIZ_STUDENTS_HASH,
} from '../../../libs/routes';
import DetailsSection from './DetailsSection';
import { QuestionsSection } from './QuestionsSection';
import { GenericButton, useToast } from '@acer-academy-learning/common-ui';
import { StudentsSection } from './StudentsSection';

export type QuizCardProps = {
  onSubmitForm: (values: CreateQuizType) => Promise<void>;
  submitText?: string;
};

export const QuizCard = ({ onSubmitForm, submitText }: QuizCardProps) => {
  const { quizId } = useParams();
  const { displayToast, ToastType } = useToast();
  const location = useLocation();
  const { handleSubmit, getValues, setValue } =
    useFormContext<CreateQuizType>();

  const [selectedQuestions, setSelectedQuestions] = useState<
    QuizQuestionInQuizType[]
  >(getValues('quizQuestions') ?? []);
  const [questionSelectionMode, setQuestionSelectionMode] = useState<string>(
    quizId ?? '',
  );

  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [allocatedTo, setAllocatedTo] = useState<string[]>([]);

  useEffect(() => {
    setValue('allocatedTo', allocatedTo);
    setValue('isPublic', isPublic);
  }, [allocatedTo, isPublic]);

  const currentTabComponent = useMemo(() => {
    switch (location.hash.slice(1)) {
      case CREATE_QUIZ_QUESTIONS_HASH:
        return (
          <QuestionsSection
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            questionSelectionMode={questionSelectionMode}
            setQuestionSelectionMode={setQuestionSelectionMode}
          />
        );
      case CREATE_QUIZ_STUDENTS_HASH:
        return (
          <StudentsSection
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            allocatedTo={allocatedTo}
            setAllocatedTo={setAllocatedTo}
          />
        );
      default:
        return <DetailsSection />;
    }
  }, [
    location,
    selectedQuestions,
    questionSelectionMode,
    isPublic,
    allocatedTo,
  ]);

  const onError = (errors: FieldErrors<CreateQuizType>) => {
    const msg = Object.entries(errors).map(([type, errorObj]) => (
      <p key={type} className="space-y-1">
        <strong>
          {type.charAt(0).toLocaleUpperCase() +
            type
              .substring(1)
              .split(/(?=[A-Z])/)
              .join(' ')}{' '}
          Error:{' '}
        </strong>
        {errorObj.message ?? errorObj.root?.message}
      </p>
    ));
    console.error(errors);
    displayToast(<div key={'quiz-error-msg'}>{msg}</div>, ToastType.ERROR);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm, onError)}
      className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col"
    >
      <QuizTabs />
      {currentTabComponent}
      <GenericButton type="submit" text={submitText ?? 'Submit'} />
    </form>
  );
};
