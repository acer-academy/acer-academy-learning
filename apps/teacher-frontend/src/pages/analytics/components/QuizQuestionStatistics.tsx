import { Divider, LexOutput } from '@acer-academy-learning/common-ui';
import { SingleQuestionStatistics } from '@acer-academy-learning/data-access';
import { CheckIcon } from '@heroicons/react/24/outline';

export const QuizQuestionStatistics: React.FC<{
  quizQuestion: SingleQuestionStatistics;
}> = (props) => {
  const {
    quizQuestionId,
    quizQuestionIndex,
    quizQuestionMarks,
    questionText,
    correctRate,
    averageTimeTaken,
    options,
  } = props.quizQuestion;

  const getTimeString = () => {
    const averageTotalTimeTaken = Math.round(averageTimeTaken);
    if (!averageTotalTimeTaken) return 'None';
    if (averageTotalTimeTaken < 60) return `${averageTotalTimeTaken} seconds`;
    let numMins = Math.floor(averageTotalTimeTaken / 60);
    const numHrs = Math.floor(numMins / 60);
    numMins %= 60;
    return `${numHrs > 0 ? `${numHrs} hour` : ''} ${
      numMins > 0 ? `${numMins} minutes` : ''
    }`;
  };

  const getPercentageRespondents = (respondents: number) => {
    return `${Math.round(
      (respondents / options.map((x) => x.count).reduce((x, y) => x + y, 0)) *
        100,
    )}%`;
  };

  const getSingleBarComponent = (count: number, isCorrect: boolean) => {
    const normalizedCount = Math.round(
      (count / options.map((x) => x.count).reduce((x, y) => x + y, 0)) * 10,
    );
    return (
      <div className="flex gap-1 w-1/6">
        <div
          style={{
            width: `${normalizedCount}em`,
            height: '1.5em',
            backgroundColor: isCorrect ? 'green' : 'gray',
          }}
        ></div>
        {isCorrect && <CheckIcon className="h-5 text-green-700" />}
      </div>
    );
  };

  return (
    <div
      id={quizQuestionId}
      className="rounded-lg border bg-white border-gray-300 overflow-hidden shadow-sm"
    >
      <div
        className={`px-4 py-2 font-bold flex justify-between bg-teacher-primary-800 text-white`}
      >
        <span>Question {quizQuestionIndex}</span>
        <span>
          {quizQuestionMarks} mark{quizQuestionMarks > 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-col gap-4 py-5 px-5">
        <LexOutput editorStateStr={questionText} />
        {options.map((option) => (
          <div key={option.answer} className="flex items-center gap-2">
            <div
              className={
                option.isCorrect
                  ? 'flex border grow border-green-400 bg-green-200 p-3 text-base rounded items-center'
                  : 'flex border grow border-gray-400 bg-white p-3 text-base rounded items-center'
              }
            >
              <LexOutput editorStateStr={option.answer} />
              <div className="ml-auto flex w-1/4 justify-end gap-4 items-center">
                <span className="text-sm font-light text-gray-700">{`${option.count} respondents`}</span>
                <span className="font-semibold w-10">
                  {getPercentageRespondents(option.count)}
                </span>
              </div>
            </div>
            {getSingleBarComponent(option.count, option.isCorrect)}
          </div>
        ))}
        <Divider lineClassName="border-teacher-primary-800" />
        <span className="font-light text-gray-700">
          On average, students spent
          <span className="font-bold text-black">{` ${getTimeString()} `}</span>{' '}
          on this question, and
          <span className="font-bold text-black">{` ${correctRate}% `}</span>of
          of them answered correctly.
        </span>
      </div>
    </div>
  );
};
