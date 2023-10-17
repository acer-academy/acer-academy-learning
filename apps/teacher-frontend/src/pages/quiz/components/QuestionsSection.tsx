import {
  CreateQuizType,
  QuizQuestionData,
  QuizQuestionDifficultyEnum,
  QuizQuestionInQuizType,
  QuizQuestionPaginationFilter,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  QuizQuestionTypeEnum,
  getFilteredQuestions,
} from '@acer-academy-learning/data-access';
import { useState } from 'react';
import { SelectedQuestionsTable } from './SelectedQuestionsTable';
import QuestionBankModal from './QuestionBankModal';
import { GenericButton, useToast } from '@acer-academy-learning/common-ui';
import { FindQuestionsButton } from './FindQuestionsButton';
import { QuestionSelectionModeRadio } from './QuestionSelectionModeRadio';
import { QuizTopicsField } from './QuizTopicsField';
import { useFormContext } from 'react-hook-form';
import { QuizLevelsField } from './QuizLevelsField';
import { NumberOfQuestionsField } from './NumberOfQuestionsField';
import { QuestionTypeField } from './QuestionTypeField';
import { QuizDifficultyField } from './QuizDifficultyField';

export const QuestionsSection = () => {
  const { displayToast, ToastType } = useToast();

  const [questionSelectionMode, setQuestionSelectionMode] =
    useState<string>('');
  const [selectedQuestions, setSelectedQuestions] = useState<
    QuizQuestionInQuizType[]
  >([]);

  // For manual selection
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);

  // For auto-generate
  const { watch } = useFormContext<CreateQuizType>();
  const watchTopics = watch('topics');
  const watchLevels = watch('levels');
  const [difficulties, setDifficulties] = useState<
    QuizQuestionDifficultyEnum[]
  >([]);
  const [questionTypes, setQuestionTypes] = useState<QuizQuestionTypeEnum[]>(
    [],
  );
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1);

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

  const editQuestionOrder = (newOrder: number[]) => {
    if (validateUniqueIndices(newOrder)) {
      // All indices are unique; update the quizQuestionIndex
      const updatedSelectedQuestions = selectedQuestions
        .map((question, index) => ({
          ...question,
          quizQuestionIndex: newOrder[index],
        }))
        .sort((a, b) => a.quizQuestionIndex - b.quizQuestionIndex);
      setSelectedQuestions(updatedSelectedQuestions);
      displayToast('Question order successfully updated.', ToastType.SUCCESS);
    } else {
      displayToast(
        'Question indices must be unique. Please check the question order and try again.',
        ToastType.ERROR,
      );
    }
  };

  const validateUniqueIndices = (indices: number[]) => {
    const uniqueIndices = [...new Set(indices)];
    return uniqueIndices.length === indices.length;
  };

  const autoGenerateQuizQuestions = async (
    filterOptions: QuizQuestionPaginationFilter,
    numberOfQuestions: number,
  ) => {
    try {
      const response = await getFilteredQuestions(filterOptions);
      const questionData: {
        questions: QuizQuestionData[];
        totalCount: number;
      } = response.data;
      console.log(questionData);
      if (questionData.totalCount < numberOfQuestions) {
        displayToast(
          `Only ${questionData.totalCount} questions found. Please reduce the number of questions or add more questions to the question bank.`,
          ToastType.ERROR,
        );
      } else {
        // Pick questions randomly
        const shuffled = Array.from(questionData.questions)
          .sort(() => 0.5 - Math.random())
          .slice(0, numberOfQuestions);
        const shuffledQuestions = shuffled.map((question, index) => {
          return {
            quizQuestionId: question.id,
            quizQuestionIndex: index + 1, // 1-based indexing for quiz questions
            quizQuestionMarks: 1,
          };
        });
        setSelectedQuestions(shuffledQuestions);
        displayToast(
          `${numberOfQuestions} questions successfully selected and added to the quiz.`,
          ToastType.SUCCESS,
        );
      }
    } catch (error) {
      displayToast(
        'Questions could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const handleAutoGenerateQuizQuestions = async () => {
    // Convert input parameters to filter options
    const filterOptions = {
      difficulty: difficulties,
      levels: watchLevels,
      questionType: questionTypes,
      showLatestOnly: true, // fixed
      status: [QuizQuestionStatusEnum.READY], // fixed
      topics: watchTopics.map((topic) => QuizQuestionTopicEnum[topic]),
    };
    await autoGenerateQuizQuestions(filterOptions, numberOfQuestions);
  };

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
            onClick={handleAddQuestions}
          />
        </>
      )}
      {questionSelectionMode === 'AUTO_GENERATE' &&
        selectedQuestions.length === 0 && (
          <>
            <QuizTopicsField />
            <QuizLevelsField />
            <QuizDifficultyField
              difficulties={difficulties}
              onChange={setDifficulties}
            />
            <QuestionTypeField
              questionTypes={questionTypes}
              onChange={setQuestionTypes}
            />
            <NumberOfQuestionsField
              initialNumQuestions={numberOfQuestions}
              onChange={setNumberOfQuestions}
            />
            <div className="flex justify-center">
              <GenericButton
                type="button"
                text="Auto-select Questions"
                onClick={() => handleAutoGenerateQuizQuestions()}
              />
            </div>
          </>
        )}
      {questionSelectionMode !== '' && (
        <SelectedQuestionsTable
          selectedQuestions={selectedQuestions}
          editQuestionMarks={editQuestionMarks}
          removeQuizQuestion={removeQuizQuestion}
          editQuestionOrder={editQuestionOrder}
        />
      )}
    </>
  );
};
