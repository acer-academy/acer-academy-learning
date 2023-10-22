import { QuizQuestionInQuizType } from '@acer-academy-learning/data-access';
import { useState } from 'react';
import { SelectedQuestionsTable } from './SelectedQuestionsTable';
import QuestionBankModal from './QuestionBankModal';
import { FindQuestionsButton } from './FindQuestionsButton';
import { QuestionSelectionModeRadio } from './QuestionSelectionModeRadio';
import { AutoGenerateInputParametersForm } from './AutoGenerateInputParametersForm';
import { QuizRewardMinimumMarksField } from './QuizRewardMinimumMarksField';
import { QuizRewardPointsField } from './QuizRewardPointsField';
import { QuizTimeAllowedField } from './QuizTimeAllowedField';
interface QuestionsSectionProps {
  selectedQuestions: QuizQuestionInQuizType[];
  setSelectedQuestions: (selectedQuestions: QuizQuestionInQuizType[]) => void;
  questionSelectionMode: string;
  setQuestionSelectionMode: (questionSelectionMode: string) => void;
}

export const QuestionsSection: React.FC<QuestionsSectionProps> = (
  props: QuestionsSectionProps,
) => {
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
        <div className="grid grid-cols-2 gap-4 w-[70%]">
          <QuizTimeAllowedField />
          <QuizRewardMinimumMarksField />
          <QuizRewardPointsField />
        </div>
      </>
    </>
  );
};
