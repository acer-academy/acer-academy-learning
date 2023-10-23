import { useAuth, useToast } from '@acer-academy-learning/common-ui';
import { StudentTakeData } from '@acer-academy-learning/data-access';
import { useEffect, useState } from 'react';

import { getTakesByStudent as apiGetTakesByStudent } from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import { QuizAttemptTableRow } from './components/QuizAttemptsTableRow';

export const TakeViewAll: React.FC = () => {
  const { user } = useAuth<Student>();
  const { displayToast, ToastType } = useToast();
  const [quizTakeMap, setQuizTakeMap] = useState<
    Map<string, StudentTakeData[]>
  >(new Map());

  const getTakesByStudent = async () => {
    try {
      if (user?.id) {
        const response = await apiGetTakesByStudent(user.id);
        const map: Map<string, StudentTakeData[]> = new Map();
        response.data.forEach((take) => {
          if (map.has(take.quizId)) {
            map.get(take.quizId)?.push(take);
            //map.get(take.quizId)?.sort((a, b) => b.marks - a.marks);
          } else {
            map.set(take.quizId, [take]);
          }
        });
        setQuizTakeMap(map);
      }
    } catch (error) {
      displayToast(
        'Quiz attempts could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const navToSelectedTake = (takeId: string) => {
    console.log(takeId);
  };

  useEffect(() => {
    getTakesByStudent();
  }, []);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="flex align-middle justify-between">
          <div className="flex align-middle gap-4">
            <span className="text-2xl py-1 font-bold tracking-tight">
              Quiz Attempts
            </span>
          </div>
        </div>

        <div className="min-w-max">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4">
                {Array.from(quizTakeMap.keys()).length == 0 ? (
                  <div className="shadow ring-1 ring-black ring-opacity-5 bg-white sm:rounded-lg">
                    <div className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center">
                      No quiz attempts found.
                    </div>
                  </div>
                ) : (
                  Array.from(quizTakeMap.values())
                    .sort((a, b) =>
                      b[b.length - 1].attemptedAt.localeCompare(
                        a[a.length - 1].attemptedAt,
                      ),
                    )
                    .map((takes, index) => (
                      <QuizAttemptTableRow
                        quizTakeMap={quizTakeMap}
                        index={index}
                        takes={takes}
                      ></QuizAttemptTableRow>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
