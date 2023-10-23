import {
  GenericButton,
  LexOutput,
  getSubjectEnumFromPathParam,
  useAuth,
  useToast,
} from '@acer-academy-learning/common-ui';
import {
  QuizData,
  QuizQuestionData,
  Teacher,
  getQuizQuestionAllVersionsById,
  updatePublishedQuiz,
} from '@acer-academy-learning/data-access';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DifficultyTag from '../../question-bank/DifficultyTag';
import { LevelTag } from '../../question-bank/LevelTag';
import TypeTag from '../../question-bank/QuestionTypeTag';
import { QuizStatusTag } from '../../question-bank/QuizStatusTag';
import { TopicTag } from '../../question-bank/TopicTag';
import SelectQuizQuestionVersionModal from './SelectQuizQuestionVersionModal';

export type UpdatePublishedQuizQuestionsSectionProps = {
  quiz: QuizData;
};

export const UpdatePublishedQuizQuestionsSection = ({
  quiz,
}: UpdatePublishedQuizQuestionsSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject } = useParams();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();

  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestionData>();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [futureQuestionVersions, setFutureQuestionVersions] = useState<
    QuizQuestionData[]
  >([]);
  const [
    isUpdateQuestionVersionModalOpen,
    setIsUpdateQuestionVersionModalOpen,
  ] = useState(false);

  const handleQuestionSelected = async (
    question: QuizQuestionData,
    index: number,
  ) => {
    // Fetch future question versions
    const questionVersions = await getQuizQuestionAllVersionsById(question.id);
    const futureQuestionVersions = questionVersions.filter(
      (q: QuizQuestionData) => q.version > question.version,
    );
    if (futureQuestionVersions.length === 0) {
      displayToast(
        'No future question versions found for Question #' + (index + 1),
        ToastType.ERROR,
      );
    } else {
      setSelectedQuestion(question);
      setSelectedQuestionIndex(index + 1);
      setFutureQuestionVersions(futureQuestionVersions);
      setIsUpdateQuestionVersionModalOpen(true);
    }
  };

  const handleUpdateQuestionVersion = async (newQuestionId: string) => {
    try {
      if (!!subject && !!user && !!selectedQuestion) {
        const updateValues = {
          title: quiz.title,
          description: quiz.description,
          topics: quiz.topics,
          levels: quiz.levels,
          rewardPoints: quiz.rewardPoints,
          timeAllowed: quiz.timeAllowed,
          totalMarks: quiz.totalMarks,
          rewardMinimumMarks: quiz.rewardMinimumMarks,
          quizQuestions: quiz.quizQuestions.map((q) => {
            return {
              quizQuestionId: q.quizQuestion.id,
              quizQuestionIndex: 0, // Placeholder index to satisfy format of request
              quizQuestionMarks: 0, // Placeholder marks to satisfy format of request
            };
          }),
          subject: getSubjectEnumFromPathParam(subject),
          teacherCreated: user.id,
          oldQuestionId: selectedQuestion.id,
          newQuestionId: newQuestionId,
        };
        const newQuiz = await updatePublishedQuiz({
          quizId: quiz.id,
          data: updateValues,
        });
        displayToast(
          'Successfully updated question version',
          ToastType.SUCCESS,
        );
        // Navigate to new quiz ID (new version of the quiz that is created)
        navigate(`/subjects/math/quizzes/${newQuiz.data.id}#questions`);
      } else {
        displayToast(
          'Error: Not logged in or subject not found',
          ToastType.ERROR,
        );
      }
    } catch (error) {
      const errorMsg = isAxiosError<{ error: string }>(error)
        ? error.response?.data.error
        : 'Unknown error';
      displayToast('Error: ' + errorMsg, ToastType.ERROR);
      console.error(error);
    }
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
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-lg font-bold text-gray-900 w-56"
                    >
                      Action
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
                    quiz.quizQuestions.map(
                      ({ quizQuestion: question }, index) => (
                        <tr key={question.id} className="hover:bg-slate-50">
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
                                {question.version == 1
                                  ? 'Created:'
                                  : 'Updated:'}
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
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900 w-56">
                            <GenericButton
                              type="button"
                              text="Update Question Version"
                              onClick={() =>
                                handleQuestionSelected(question, index)
                              }
                              className="mr-5"
                            />
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selectedQuestion && (
        <SelectQuizQuestionVersionModal
          oldQuestion={selectedQuestion}
          oldQuestionIndex={selectedQuestionIndex}
          futureQuestionVersions={futureQuestionVersions}
          onClick={handleUpdateQuestionVersion}
          open={isUpdateQuestionVersionModalOpen}
          setOpen={setIsUpdateQuestionVersionModalOpen}
        />
      )}
    </div>
  );
};
