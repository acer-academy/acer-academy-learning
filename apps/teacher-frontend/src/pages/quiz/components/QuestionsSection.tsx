import {
  CreateQuizType,
  LevelEnum,
  QuizQuestionInQuizType,
} from '@acer-academy-learning/data-access';
import { useState } from 'react';
import { SelectedQuestionsTable } from './SelectedQuestionsTable';
import QuestionBankModal from './QuestionBankModal';
import { FindQuestionsButton } from './FindQuestionsButton';
import { QuestionSelectionModeRadio } from './QuestionSelectionModeRadio';
import { AutoGenerateInputParametersForm } from './AutoGenerateInputParametersForm';
import { QuizRewardMinimumMarksField } from './QuizRewardMinimumMarksField';
import { QuizRewardPointsField } from './QuizRewardPointsField';
import { QuizTimeAllowedField } from './QuizTimeAllowedField';
import {
  ErrorField,
  GenericBadges,
  GenericComboBox,
  screamingSnakeToTitleCase,
} from '@acer-academy-learning/common-ui';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
interface QuestionsSectionProps {
  selectedQuestions: QuizQuestionInQuizType[];
  setSelectedQuestions: (selectedQuestions: QuizQuestionInQuizType[]) => void;
  questionSelectionMode: string;
  setQuestionSelectionMode: (questionSelectionMode: string) => void;
}

const levelEnums = Object.values(LevelEnum);

export const QuestionsSection: React.FC<QuestionsSectionProps> = (
  props: QuestionsSectionProps,
) => {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<CreateQuizType>();
  const watchTopics = watch('topics');
  const {
    selectedQuestions,
    setSelectedQuestions,
    questionSelectionMode,
    setQuestionSelectionMode,
  } = props;

  // For manual selection
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  if (questionSelectionMode === '') {
    return (
      <QuestionSelectionModeRadio handleSelectMode={setQuestionSelectionMode} />
    );
  }

  return (
    <>
      {questionSelectionMode === 'MANUAL_SELECTION' && (
        <div className="flex justify-center text-3xl font-bold pt-5">
          Manual Selection
        </div>
      )}
      {questionSelectionMode === 'AUTO_GENERATE' ? (
        <>
          <div className="flex justify-center text-3xl font-bold pt-5">
            Auto-Generate
          </div>
          {selectedQuestions.length === 0 && (
            <AutoGenerateInputParametersForm
              setSelectedQuestions={setSelectedQuestions}
            />
          )}
        </>
      ) : (
        // Include this for update question as well
        <>
          <FindQuestionsButton
            setIsQuestionBankModalOpen={setIsQuestionBankModalOpen}
          />
          <QuestionBankModal
            open={isQuestionBankModalOpen}
            setOpen={setIsQuestionBankModalOpen}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
          />
        </>
      )}
      <>
        <SelectedQuestionsTable
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
        <div>
          <p className="text-base font-bold">Topics: </p>
          <GenericBadges
            badges={watchTopics}
            getDisplayValue={(topic) => screamingSnakeToTitleCase(topic)}
          />
        </div>
        <div>
          <p className="text-base font-bold">Levels: </p>
          <Controller
            control={control}
            name="levels"
            render={({ field: { onChange, value } }) => (
              <>
                <GenericBadges
                  onChange={onChange}
                  badges={value}
                  getDisplayValue={(level) => screamingSnakeToTitleCase(level)}
                  allowRemove
                />
                <ErrorMessage
                  errors={errors}
                  name="levels"
                  render={({ message }) => <ErrorField message={message} />}
                />
                <GenericComboBox
                  options={levelEnums}
                  onChange={onChange}
                  selected={value}
                  displayValue={(level) => screamingSnakeToTitleCase(level)}
                  containerStyle="w-[50%]"
                />
              </>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-[70%]">
          <QuizTimeAllowedField />
          <QuizRewardMinimumMarksField />
          <QuizRewardPointsField />
        </div>
      </>
    </>
  );
};
