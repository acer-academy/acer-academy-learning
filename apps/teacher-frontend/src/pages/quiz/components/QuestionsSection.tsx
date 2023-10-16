import { QuizQuestionInQuizType } from '@acer-academy-learning/data-access';
import { useEffect, useState } from 'react';
import { SelectedQuestionsTable } from './SelectedQuestionsTable';
import QuestionBankModal from './QuestionBankModal';
import { useToast } from '@acer-academy-learning/common-ui';
import { FindQuestionsButton } from './FindQuestionsButton';
import { QuestionSelectionModeRadio } from './QuestionSelectionModeRadio';

export const QuestionsSection = () => {
  const { displayToast, ToastType } = useToast();

  const [questionSelectionMode, setQuestionSelectionMode] =
    useState<string>('');
  const [selectedQuestions, setSelectedQuestions] = useState<
    QuizQuestionInQuizType[]
  >([]);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  const handleAddQuestions = (
    newSelectedQuestions: QuizQuestionInQuizType[],
  ) => {
    console.log('QuestionsSection: selectedQuestions', selectedQuestions);
    console.log('QuestionsSection: newSelectedQuestions', newSelectedQuestions);
    setSelectedQuestions([...selectedQuestions, ...newSelectedQuestions]);
    displayToast(
      `Successfully added ${newSelectedQuestions.length} questions.`,
      ToastType.SUCCESS,
    );
  };

  const editQuestionMarks = (questionId: string, marks: number) => {
    const updatedSelectedQuestions = [...selectedQuestions];
    const questionIndex = updatedSelectedQuestions.findIndex(
      (question) => question.quizQuestionId === questionId,
    );
    updatedSelectedQuestions[questionIndex].quizQuestionMarks = marks;
    setSelectedQuestions(updatedSelectedQuestions);
  };

  const removeQuizQuestion = (questionId: string) => {
    const quizQuestionIndexToRemove = selectedQuestions.find(
      (question) => question.quizQuestionId === questionId,
    )?.quizQuestionIndex;
    if (quizQuestionIndexToRemove) {
      const updatedSelectedQuestions = selectedQuestions
        .filter((question) => question.quizQuestionId !== questionId)
        .map((question) => {
          if (question.quizQuestionIndex > quizQuestionIndexToRemove) {
            question.quizQuestionIndex--;
          }
          return question;
        });
      setSelectedQuestions(updatedSelectedQuestions);
    }
  };

  return (
    <>
      {questionSelectionMode === '' ? (
        <QuestionSelectionModeRadio
          setQuestionSelectionMode={setQuestionSelectionMode}
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
            onClick={handleAddQuestions}
          />
        </>
      )}
      {questionSelectionMode !== '' && (
        <SelectedQuestionsTable
          selectedQuestions={selectedQuestions}
          editQuestionMarks={editQuestionMarks}
          removeQuizQuestion={removeQuizQuestion}
        />
      )}
    </>
  );
};
