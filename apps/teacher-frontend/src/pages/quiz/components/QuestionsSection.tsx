import {
  QuizQuestionInQuizType,
  getQuizQuestionById,
} from '@acer-academy-learning/data-access';
import { useEffect, useState } from 'react';
import { SelectedQuestionsTable } from './SelectedQuestionsTable';
import QuestionBankModal from './QuestionBankModal';
import { useToast } from '@acer-academy-learning/common-ui';

export const QuestionsSection = () => {
  const { displayToast, ToastType } = useToast();

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

  return (
    <>
      <div className="flex align-middle justify-between">
        <div className="flex align-middle gap-4"></div>
        <button
          className="inline-flex justify-center px-4 py-2 text-white bg-teacherBlue-500 border border-transparent rounded-md hover:bg-teacherBlue-700"
          onClick={() => {
            setIsQuestionBankModalOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 mr-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          Find Questions
        </button>
      </div>
      <QuestionBankModal
        open={isQuestionBankModalOpen}
        setOpen={setIsQuestionBankModalOpen}
        selectedQuestions={selectedQuestions}
        onClick={handleAddQuestions}
      />
      <SelectedQuestionsTable
        selectedQuestions={selectedQuestions}
        editQuestionMarks={editQuestionMarks}
      />
    </>
  );
};
