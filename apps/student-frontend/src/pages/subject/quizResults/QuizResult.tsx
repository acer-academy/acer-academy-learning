import { useToast } from '@acer-academy-learning/common-ui';
import {
  QuizQuestionData,
  StudentTakeData,
} from '@acer-academy-learning/data-access';
import { useEffect, useState } from 'react';
import {
  getTakeByTakeId as apiGetTakeById,
  getTakeAnswersByTakeAndQuizQuestion as apiTakeAnsByTakeAndQues,
} from '@acer-academy-learning/data-access';
import { useParams } from 'react-router-dom';
import { QuizQuestionRow } from './quizQuestionRow';

export const QuizResult: React.FC = () => {
  const { displayToast, ToastType } = useToast();
  const { takeId } = useParams();

  const [take, setTake] = useState<StudentTakeData | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionData[]>([]);
  let index = 1;

  const fetchTake = async () => {
    try {
      if (takeId) {
        const response = await apiGetTakeById(takeId);
        setTake(response.data);
      }
    } catch (error) {
      displayToast(
        'Quiz result could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTake();
  }, []);

  const fetchTakeAnswers = async (questionId: string, takeId: string) => {
    await apiTakeAnsByTakeAndQues(questionId, takeId);
  };

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="flex align-middle justify-between">
          <div className="flex align-middle gap-4">
            <span className="text-2xl py-1 font-bold tracking-tight">
              Quiz Results: {`${take?.marks}/ ${take?.quiz.totalMarks}`}
            </span>
          </div>
        </div>

        <div className="min-w-max">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4">
                {take?.quiz.quizQuestions.map((quizQuestion) => (
                  <QuizQuestionRow
                    key={quizQuestion.quizQuestionId}
                    questionId={quizQuestion.quizQuestionId}
                    takeId={take.id}
                    questionNumber={index++}
                    marks={quizQuestion.quizQuestionMarks}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
