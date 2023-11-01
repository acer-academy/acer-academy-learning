import { GenericButton, useToast } from '@acer-academy-learning/common-ui';
import {
  ConsolidatedQuizStatistics,
  StudentTakeDataWithTakenBy,
  getTakesByQuizId,
} from '@acer-academy-learning/data-access';
import { useEffect, useMemo, useState } from 'react';
import { QuizStudentMasqueradePreview } from './QuizStudentMasqueradePreview';
import { EyeIcon } from '@heroicons/react/24/outline';

export const QuizStudentMasquerade: React.FC<{
  quizStats?: ConsolidatedQuizStatistics;
}> = (props) => {
  const { quizStats } = props;
  const { displayToast, ToastType } = useToast();
  const [takes, setTakes] = useState<StudentTakeDataWithTakenBy[]>([]);
  const [selectedTakeId, setSelectedTakeId] = useState<string>('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectTake = (takeId: string) => {
    setSelectedTakeId(takeId);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (quizStats?.quizDetails.id)
      getTakesByQuizId(quizStats.quizDetails.id)
        .then((res) => {
          setTakes(res.data);
        })
        .catch((error: any) => {
          displayToast(
            'Student attempts could not be retrieved from the server: ' +
              error.message,
            ToastType.ERROR,
          );
        });
  }, []);

  useEffect(() => {
    if (takes.length > 0) {
      setSelectedTakeId(takes[0].id);
    }
  }, [takes]);

  useEffect(() => {
    if (takes.length > 0) {
      const selectedTake =
        takes.find((take) => take.id == selectedTakeId) ?? takes[0];
      const takesSliced = takes.splice(takes.indexOf(selectedTake), 1)[0];
      takes.unshift(takesSliced);
      setTakes(takes);
    }
  }, [selectedTakeId]);

  const getTakenByAndDateString = (takeId: string) => {
    if (takes.length == 0) return '';
    const take = takes.filter((take) => takeId == take.id)[0];
    if (!take) return '';
    const dateString = displayTimeAttemptedAt(take.attemptedAt);
    return (
      <div className="flex flex-col text-left">
        <span>{`${take.takenBy.firstName} ${take.takenBy.lastName}`}</span>
        <span className="text-xs text-gray-300">{dateString}</span>
      </div>
    );
  };

  const displayTimeAttemptedAt = (time: string) => {
    if (!time) return '';
    const date = time.split('T')[0];
    const timeStamp = time.split('T')[1].split(':');
    const meridiem = Number(timeStamp[0]) < 12 ? 'AM' : 'PM';
    return `${date} at ${Number(timeStamp[0]) % 12}:${timeStamp[1]}${meridiem}`;
  };

  const quizResultPreview = useMemo(() => {
    return (
      <>
        {selectedTakeId.length > 0 ? (
          <QuizStudentMasqueradePreview takeId={selectedTakeId} />
        ) : (
          <div className="text-gray-700 italic flex justify-center mt-20">
            Select a student attempt to view
          </div>
        )}
      </>
    );
  }, [selectedTakeId]);

  return (
    <div className="relative">
      {isDropdownOpen ? (
        <div className="fixed max-h-96 no-scrollbar overflow-y-scroll text-sm font-semibold z-50 bottom-10 rounded-lg right-10 bg-teacher-primary-600 text-white shadow-lg">
          {takes.map((take, index) => (
            <div
              key={take.id}
              className={`flex items-center gap-1.5 cursor-pointer ${
                index == takes.length - 1 ? '' : 'border-b'
              } border-teacher-primary-800 px-4 py-2 `}
              onClick={() => handleSelectTake(take.id)}
            >
              {take.id == selectedTakeId ? (
                <EyeIcon className="h-5 mr-1"></EyeIcon>
              ) : (
                <></>
              )}
              {getTakenByAndDateString(take.id)}
            </div>
          ))}
        </div>
      ) : (
        <GenericButton
          icon={<EyeIcon className="h-5 mr-1"></EyeIcon>}
          text={getTakenByAndDateString(selectedTakeId)}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="z-50 px-4 py-2 rounded fixed bottom-10 right-10 shadow-lg"
        />
      )}

      <div>{quizResultPreview}</div>
    </div>
  );
};
