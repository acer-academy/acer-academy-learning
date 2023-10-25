import {
  QuizQuestionData,
  QuizQuestionTypeEnum,
  TakeAnswerData,
} from '@acer-academy-learning/data-access';
import { Divider, LexOutput, Spinner } from '@acer-academy-learning/common-ui';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import {
  getQuizQuestionById as apiGetQuestionById,
  getTakeAnswersByTakeAndQuizQuestion as apiTakeAnsByTakeAndQues,
  getCorrectRateByQuestionId as apiCorrectRate,
  getAverageTimeTakenByQuestionId as apiAverageTime,
} from '@acer-academy-learning/data-access';
import { QuizSelectAnswer } from './quizSelectAnswer';

export type QuizQuestionRowProps = {
  questionId: string;
  takeId: string;
  questionNumber: number;
  marks: number;
};

/**
 * Quiz question card component
 * @returns {JSX.Element}
 */
export const QuizQuestionRow = ({
  questionId,
  takeId,
  questionNumber,
  marks,
}: QuizQuestionRowProps) => {
  const [question, setQuestion] = useState<QuizQuestionData>();
  const [takeAnswer, setTakeAnswer] = useState<TakeAnswerData[]>();
  const [correctRate, setCorrectRate] = useState<string>('');
  const [averageTime, setAverageTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuestion = async () => {
    setLoading(true);
    const question = await apiGetQuestionById(questionId);
    setQuestion(question);
    setLoading(false);
  };

  const fetchTakeAnswers = async () => {
    setLoading(true);
    const answers = await apiTakeAnsByTakeAndQues(questionId, takeId);
    setTakeAnswer(answers.data);
    setLoading(false);
  };

  const fetchStatistics = async () => {
    setLoading(true);
    const answer = await apiAverageTime(questionId);
    setAverageTime(answer.data);
    const res = await apiCorrectRate(questionId);
    setCorrectRate(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
    fetchTakeAnswers();
    fetchStatistics();
  }, []);

  const answerOptions = useMemo(() => {
    switch (question?.questionType) {
      case QuizQuestionTypeEnum.MCQ:
      case QuizQuestionTypeEnum.TFQ:
        return (
          <QuizSelectAnswer
            type="radio"
            answers={question.answers}
            takeAnswers={takeAnswer ? takeAnswer : []}
          />
        );
      case QuizQuestionTypeEnum.MRQ:
        return (
          <QuizSelectAnswer
            type="checkbox"
            answers={question.answers}
            takeAnswers={takeAnswer ? takeAnswer : []}
          />
        );
      default:
        return (
          <LexOutput
            editorStateStr={(takeAnswer && takeAnswer[0].studentAnswer) || ''}
          />
        );
    }
  }, [question, questionNumber]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="opacity-100 transition-opacity duration-300">
        <div
          className={`bg-gray-200 px-4 py-2 text-left font-bold text-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 text-base border border-gray-400 rounded-t flex justify-between bg-student-primary-600 text-white`}
        >
          <span>Question {questionNumber}</span>
          <span>
            {marks} mark{marks > 1 ? 's' : ''}
          </span>
        </div>
        <div className="rounded-b border-b border-x border-gray-200 bg-white px-4 py-5 sm:px-6 shadow space-y-4 flex flex-col">
          <LexOutput editorStateStr={question?.questionText || ''} />
          <Divider lineClassName="border-student-primary-600" />
          {answerOptions}
          <div className="bg-gray-100 px-3 py-3 sm:px-3 shadow space-y-4 flex flex-col">
            <span>{`Time taken: ${
              takeAnswer && takeAnswer[0].timeTaken
            } seconds`}</span>
            <span>
              <span className="font-bold">{`${correctRate}%`}</span>
              {` of students got this question right.`}
            </span>
            <span>
              {`On average, students take `}
              <span className="font-bold">{averageTime}</span>
              {` seconds to complete this question`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
