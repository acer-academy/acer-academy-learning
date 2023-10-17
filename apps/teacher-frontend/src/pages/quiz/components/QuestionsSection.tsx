import { QuizQuestionInQuizType } from '@acer-academy-learning/data-access';
import { useState } from 'react';
import { SelectedQuestionsTable } from './SelectedQuestionsTable';
import QuestionBankModal from './QuestionBankModal';
import { FindQuestionsButton } from './FindQuestionsButton';
import { QuestionSelectionModeRadio } from './QuestionSelectionModeRadio';
import { AutoGenerateInputParametersForm } from './AutoGenerateInputParametersForm';

export const QuestionsSection = () => {
  const [questionSelectionMode, setQuestionSelectionMode] =
    useState<string>('');
  const [selectedQuestions, setSelectedQuestions] = useState<
    QuizQuestionInQuizType[]
  >([]);

  // For manual selection
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  return (
    <>
      {questionSelectionMode === '' ? (
        <QuestionSelectionModeRadio
          handleSelectMode={setQuestionSelectionMode}
        />
      ) : questionSelectionMode === 'MANUAL_SELECTION' ? (
        <div className="flex justify-center text-3xl font-bold pt-5">
          Manual Selection
        </div>
      ) : (
        <div className="flex justify-center text-3xl font-bold pt-5">
          Auto-Generate
        </div>
      )}
      {questionSelectionMode === 'MANUAL_SELECTION' && (
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
      {questionSelectionMode === 'AUTO_GENERATE' &&
        selectedQuestions.length === 0 && (
          <AutoGenerateInputParametersForm
            setSelectedQuestions={setSelectedQuestions}
          />
        )}
      {questionSelectionMode !== '' && (
        <SelectedQuestionsTable
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />
      )}
    </>
  );
};
