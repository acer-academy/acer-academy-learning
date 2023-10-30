import { GenericButton, useToast } from '@acer-academy-learning/common-ui';
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
import { useFormContext } from 'react-hook-form';
import { NumberOfQuestionsField } from './NumberOfQuestionsField';
import { QuestionTypeField } from './QuestionTypeField';
import { QuizDifficultyField } from './QuizDifficultyField';
import { QuizLevelsField } from './QuizLevelsField';
import { QuizTopicsField } from './QuizTopicsField';

interface AutoGenerateInputParametersFormProps {
  setSelectedQuestions: (selectedQuestions: QuizQuestionInQuizType[]) => void;
}

export const AutoGenerateInputParametersForm: React.FC<
  AutoGenerateInputParametersFormProps
> = (props: AutoGenerateInputParametersFormProps) => {
  const { setSelectedQuestions } = props;

  const { displayToast, ToastType } = useToast();

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

  return (
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
          className="hover:bg-gray-700"
          type="button"
          text="Auto-select Questions"
          onClick={() => handleAutoGenerateQuizQuestions()}
        />
      </div>
    </>
  );
};
