import { useMemo, useState } from 'react';
import {
  CreateQuizType,
  QuizQuestionInQuizType,
} from '@acer-academy-learning/data-access';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { QuizTabs } from './QuizTab';
import { useLocation } from 'react-router-dom';
import { CREATE_QUIZ_QUESTIONS_HASH } from '../../../libs/routes';
import DetailsSection from './DetailsSection';
import { QuestionsSection } from './QuestionsSection';
import { GenericButton, useToast } from '@acer-academy-learning/common-ui';

export type QuizCardProps = {
  onSubmitForm: (values: CreateQuizType) => Promise<void>;
  submitText?: string;
};

export const QuizCard = ({ onSubmitForm, submitText }: QuizCardProps) => {
  const { displayToast, ToastType } = useToast();
  const location = useLocation();
  const { handleSubmit } = useFormContext<CreateQuizType>();

  const [selectedQuestions, setSelectedQuestions] = useState<
    QuizQuestionInQuizType[]
  >([]);
  const [questionSelectionMode, setQuestionSelectionMode] =
    useState<string>('');

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
      default:
        return <DetailsSection />;
    }
  }, [location, selectedQuestions, questionSelectionMode]);

  const onError = (errors: FieldErrors<CreateQuizType>) => {
    const msg = Object.entries(errors).map(([type, errorObj]) => (
      <p key={type} className="space-y-1">
        <strong>
          {type.charAt(0).toLocaleUpperCase() + type.substring(1)} Error:{' '}
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
