import { LexOutput } from '@acer-academy-learning/common-ui';
import { QuizAnswer } from '@acer-academy-learning/data-access';

export type AdaptiveQuizSelectAnswerProps = {
  answers: QuizAnswer[];
  takeAnswers: string[];
  type: React.HTMLInputTypeAttribute | undefined;
};
export const AdaptiveQuizSelectAnswer = ({
  answers,
  takeAnswers,
  type,
}: AdaptiveQuizSelectAnswerProps) => {
  return (
    <>
      {answers.map((answer) => (
        <div key={answer.id}>
          <label
            className={
              answer.isCorrect
                ? 'border border-green-400 bg-green-200 p-3 text-base rounded flex items-center space-x-3'
                : takeAnswers &&
                  takeAnswers.some((ans) => answer.answer === ans)
                ? 'border border-red-400 bg-red-200 p-3 text-base rounded flex items-center space-x-3'
                : 'border border-gray-400 bg-white p-3 text-base rounded flex items-center space-x-3'
            }
          >
            <input
              className="text-student-secondary-700 focus:ring-student-secondary-700"
              type={type}
              value={answer.answer}
              disabled={true}
              checked={
                takeAnswers
                  ? takeAnswers.some((ans) => answer.answer === ans)
                  : false
              }
            />
            <LexOutput editorStateStr={answer.answer} />
          </label>
          {answer.explanation ? (
            <div className="bg-white px-2 py-2 align-middle sm:px-2 lg:px-2 border border-gray">
              <span className="font-bold">Explanation</span>
              <LexOutput editorStateStr={answer.explanation} />
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
};
