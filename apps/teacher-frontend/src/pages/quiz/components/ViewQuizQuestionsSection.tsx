import { QuizData } from '@acer-academy-learning/data-access';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTION_BANK } from '../../../libs/routes';
import { LexOutput } from '@acer-academy-learning/common-ui';
import { LevelTag } from '../../question-bank/LevelTag';
import { TopicTag } from '../../question-bank/TopicTag';
import DifficultyTag from '../../question-bank/DifficultyTag';
import { QuizStatusTag } from '../../question-bank/QuizStatusTag';
import TypeTag from '../../question-bank/QuestionTypeTag';

export type ViewQuizQuestionsSectionProps = {
  quiz: QuizData;
};

export const ViewQuizQuestionsSection = ({
  quiz,
}: ViewQuizQuestionsSectionProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  const navToSelectedQuestion = (selectedQuestionId: string) => {
    // for now will push to url/question-bank/questionId, change as needed
    navigate(`${QUESTION_BANK}/${selectedQuestionId}`);
  };

  return (
    <div>
      <div className="min-w-max">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-3.5 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                    >
                      Question
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                    >
                      Version
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                    >
                      Level(s)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                    >
                      Topic(s)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 "
                    >
                      Difficulty
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                    >
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {quiz.quizQuestions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                      >
                        No questions found.
                      </td>
                    </tr>
                  ) : (
                    quiz.quizQuestions.map(({ quizQuestion: question }) => (
                      <tr
                        key={question.id}
                        className="hover:bg-slate-50 hover:cursor-pointer"
                        onClick={() => {
                          navToSelectedQuestion(question.id);
                        }}
                      >
                        <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900 max-w-0">
                          <div>
                            <span>
                              <LexOutput
                                editorStateStr={question.questionText}
                                shorten
                              />
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{`v${question.version}`}</span>
                            <span className="text-xs text-gray-500">
                              {question.version == 1 ? 'Created:' : 'Updated:'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {String(question.createdAt).split('T')[0]}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                          <div className="flex flex-col gap-1">
                            {question.levels.map((level, index) => {
                              return (
                                <LevelTag
                                  key={index}
                                  index={index}
                                  levelEnum={level}
                                />
                              );
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                          <div className="flex flex-col gap-1 max-w-min">
                            {question.topics.map((topic, index) => {
                              return (
                                <TopicTag
                                  key={index}
                                  index={index}
                                  topicEnum={topic}
                                />
                              );
                            })}
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                          <DifficultyTag difficulty={question.difficulty} />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                          <QuizStatusTag status={question.status} />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                          <TypeTag type={question.questionType} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
