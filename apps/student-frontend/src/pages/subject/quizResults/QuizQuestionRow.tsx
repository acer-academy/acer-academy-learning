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
import { QuizSelectAnswer } from './QuizSelectAnswer';
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
    setLoading(true);
    fetchQuestion();
    fetchTakeAnswers();
    fetchStatistics();
    setLoading(false);
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
          <>
            <div className="flex space-x-5">
              {takeAnswer && takeAnswer[0] ? (
                <LexOutput
                  editorStateStr={takeAnswer[0].studentAnswer || '-'}
                />
              ) : (
                <></>
              )}
              {takeAnswer && takeAnswer[0] ? (
                takeAnswer[0].isCorrect ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#43a047"
                      d="M40.6,12.1L17,35.7l-9.6-9.6L4.6,29L17,41.3l26.4-26.4L40.6,12.1z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#F44336"
                      d="M21.5 4.5H26.501V43.5H21.5z"
                      transform="rotate(45.001 24 24)"
                    ></path>
                    <path
                      fill="#F44336"
                      d="M21.5 4.5H26.5V43.501H21.5z"
                      transform="rotate(135.008 24 24)"
                    ></path>
                  </svg>
                )
              ) : (
                <></>
              )}
            </div>
            <Divider lineClassName="border-student-primary-600" />
            <span className="font-bold">Correct Answer</span>
            <LexOutput editorStateStr={question?.answers[0].answer || '-'} />
            {question?.answers[0].explanation ? (
              <div className="bg-white px-2 py-2 align-middle sm:px-2 lg:px-2 border border-gray">
                <span className="font-bold">Explanation</span>
                <LexOutput editorStateStr={question?.answers[0].explanation} />
              </div>
            ) : (
              <></>
            )}
          </>
        );
    }
  }, [question, questionNumber]);

  if (loading) {
    return <Spinner />;
  }

  return (
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
        <div className="bg-gray-100 px-3 py-3 sm:px-3 shadow space-y-2 flex flex-col">
          <span className="font-bold">Time Analysis</span>
          {takeAnswer && takeAnswer[0] ? (
            <span>{`Time taken: ${takeAnswer[0].timeTaken} seconds`}</span>
          ) : (
            <span>
              {`It appears that you were unable to complete this question within the given time frame.`}
            </span>
          )}
          <span className="flex items-center gap-1">
            {`On average, students take `}
            <span className="font-bold">{averageTime}</span>
            {` seconds to complete this question. `}
            {takeAnswer && takeAnswer[0] && takeAnswer[0].timeTaken ? (
              takeAnswer[0].timeTaken < parseFloat(averageTime) ? (
                <span className="px-2">
                  {/* {`Well done! You completed this question faster than most students.`} */}
                  <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 150 150"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <circle cx="50" cy="50" r="20" fill="#689f38"></circle>
                    <circle
                      cx="60.03"
                      cy="63.1"
                      r="56.1"
                      fill="#7cb342"
                    ></circle>
                    <path
                      d="M23.93 29.7c4.5-7.1 14.1-13 24.1-14.8c2.5-.4 5-.6 7.1.2c1.6.6 2.9 2.1 2 3.8c-.7 1.4-2.6 2-4.1 2.5a44.64 44.64 0 0 0-23 17.4c-2 3-5 11.3-8.7 9.2c-3.9-2.3-3.1-9.5 2.6-18.3z"
                      fill="#aed581"
                    ></path>
                  </svg>
                </span>
              ) : (
                <span>
                  <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 150 150"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    preserveAspectRatio="xMidYMid meet"
                    fill="#000000"
                  >
                    <circle cx="50" cy="50" r="20" fill="#bd2727" />

                    <circle cx="60.03" cy="63.1" r="56.1" fill="#D22B2B" />

                    <path
                      d="M23.93 29.7c4.5-7.1 14.1-13 24.1-14.8c2.5-.4 5-.6 7.1.2c1.6.6 2.9 2.1 2 3.8c-.7 1.4-2.6 2-4.1 2.5a44.64 44.64 0 0 0-23 17.4c-2 3-5 11.3-8.7 9.2c-3.9-2.3-3.1-9.5 2.6-18.3z"
                      fill="#e06969"
                    />
                  </svg>
                  {/* {`You took longer to complete this question than most students, which could indicate that you were putting extra thought into it.`} */}
                </span>
              )
            ) : (
              <span></span>
            )}
          </span>
          <span className="font-bold">Correctness</span>
          <span>
            <span className="font-bold">{`${correctRate}%`}</span>
            {` of students got this question right.`}
          </span>
          {takeAnswer &&
          takeAnswer[0] &&
          ((question?.questionType !== QuizQuestionTypeEnum.MRQ &&
            takeAnswer[0].isCorrect === true) ||
            takeAnswer.filter((takeAns) => takeAns.isCorrect === true)
              .length ===
              question?.answers.filter((ans) => ans.isCorrect === true)
                .length) ? (
            parseFloat(correctRate) < 50 ? (
              <span>
                {`Well done! You have a good grasp of `}
                <span className="font-bold">
                  {question?.topics
                    .map((a) => a.toLowerCase().split('_').join(' '))
                    .join(', ')}
                </span>
                {`! This is a tricky question.`}
              </span>
            ) : (
              <></>
            )
          ) : parseFloat(correctRate) > 50 ? (
            <span>
              {`Did you make a careless mistake? This is a common question that most students got right.`}
            </span>
          ) : (
            <> </>
          )}
        </div>
      </div>
    </div>
  );
};
