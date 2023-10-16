import {
  GenericButton,
  GenericInput,
  LexOutput,
} from '@acer-academy-learning/common-ui';
import DifficultyTag from '../../question-bank/DifficultyTag';
import { LevelTag } from '../../question-bank/LevelTag';
import TypeTag from '../../question-bank/QuestionTypeTag';
import { TopicTag } from '../../question-bank/TopicTag';
import {
  QuizQuestionData,
  QuizQuestionInQuizType,
  getQuizQuestionById,
} from '@acer-academy-learning/data-access';
import { useState, useEffect } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface SelectedQuestionsTableProps {
  selectedQuestions: QuizQuestionInQuizType[];
  editQuestionMarks: (questionId: string, marks: number) => void;
}

export const SelectedQuestionsTable: React.FC<SelectedQuestionsTableProps> = (
  props: SelectedQuestionsTableProps,
) => {
  const { selectedQuestions, editQuestionMarks } = props;
  console.log('SelectedQuestionsTable: selectedQuestions', selectedQuestions);

  const [questionIdToObjectMap, setQuestionIdToObjectMap] = useState<{
    [questionId: string]: QuizQuestionData;
  }>({});

  const [isEditing, setIsEditing] = useState(false);
  const [editMarksQuestionId, setEditMarksQuestionId] = useState<string>('');
  const [editedMarks, setEditedMarks] = useState(0);

  const handleEditClick = () => {
    if (isEditing) {
      // User clicked the edit button
      editQuestionMarks(editMarksQuestionId, editedMarks);
      setIsEditing(false);
      setEditMarksQuestionId('');
    } else {
      // User clicked the PencilSquareIcon to start editing
      const selectedQuestion = selectedQuestions.find(
        (q) => q.quizQuestionId === editMarksQuestionId,
      );
      if (selectedQuestion) {
        setEditedMarks(selectedQuestion.quizQuestionMarks || 0);
        setIsEditing(true);
      }
    }
  };

  const calculateTotalMarks = () =>
    selectedQuestions
      .map((question) => question.quizQuestionMarks)
      .reduce((a, b) => a + b, 0);

  const fetchQuizQuestionData = async () => {
    selectedQuestions.map(async (question) => {
      const quizQuestionData = await getQuizQuestionById(
        question.quizQuestionId,
      );
      setQuestionIdToObjectMap((prev) => ({
        ...prev,
        [question.quizQuestionId]: quizQuestionData,
      }));
    });
  };

  useEffect(() => {
    fetchQuizQuestionData();
  }, [selectedQuestions]);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col gap-7 align-middle">
        <div className="flex align-middle justify-between">
          <div className="flex flex-col align-middle gap-2">
            <div className="text-2xl py-1 font-bold tracking-tight mb-4">
              Selected Questions
            </div>
            <div>Number of Questions: {selectedQuestions.length}</div>
            <div>Total Marks: {calculateTotalMarks()} </div>
          </div>
        </div>

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
                        Index
                      </th>
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
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {selectedQuestions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                        >
                          No questions selected. <br />
                          Use the "Find Questions" button to search for
                          questions to add to the quiz.
                        </td>
                      </tr>
                    ) : (
                      selectedQuestions.map((question) => (
                        <tr
                          key={question.quizQuestionId}
                          className="hover:bg-slate-50 hover:cursor-pointer"
                        >
                          <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                            <div className="pl-3.5 pr-3 text-left">
                              {question.quizQuestionIndex}
                            </div>
                          </td>
                          <td className="py-4 pl-3.5 pr-3 text-xs font-medium text-gray-900 max-w-0">
                            <div>
                              <span>
                                <LexOutput
                                  editorStateStr={
                                    questionIdToObjectMap[
                                      question.quizQuestionId
                                    ]?.questionText
                                  }
                                  shorten
                                />
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-900">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">{`v${
                                questionIdToObjectMap[question.quizQuestionId]
                                  ?.version
                              }`}</span>
                              <span className="text-xs text-gray-500">
                                {questionIdToObjectMap[question.quizQuestionId]
                                  ?.version == 1
                                  ? 'Created:'
                                  : 'Updated:'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {
                                  String(
                                    questionIdToObjectMap[
                                      question.quizQuestionId
                                    ]?.createdAt,
                                  ).split('T')[0]
                                }
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-4 px-3 font-medium text-gray-900">
                            <div className="flex flex-col gap-1">
                              {questionIdToObjectMap[
                                question.quizQuestionId
                              ]?.levels.map((level, index) => {
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
                              {questionIdToObjectMap[
                                question.quizQuestionId
                              ]?.topics.map((topic, index) => {
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
                            <DifficultyTag
                              difficulty={
                                questionIdToObjectMap[question.quizQuestionId]
                                  ?.difficulty
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-3 font-medium text-gray-900">
                            <TypeTag
                              type={
                                questionIdToObjectMap[question.quizQuestionId]
                                  ?.questionType
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap font-medium text-gray-900 space-x-1 w-max pr-3">
                            <div className="pl-3.5 pr-3 text-left">
                              <div className="inline-flex items-center">
                                {isEditing &&
                                editMarksQuestionId ===
                                  question.quizQuestionId ? (
                                  <div className="flex flex-col mt-2">
                                    <GenericInput
                                      type="number"
                                      inputClassName="w-20 mr-4"
                                      value={editedMarks}
                                      onBlur={() => {
                                        if (!editedMarks) {
                                          setEditedMarks(1);
                                        }
                                      }}
                                      onChange={(e) => {
                                        setEditedMarks(
                                          parseInt(e.target.value),
                                        );
                                      }}
                                      hasError={editedMarks <= 0}
                                    />
                                    {editedMarks < 1 && (
                                      <div className="text-red-600 text-xs mt-2">
                                        Marks must be <br /> at least 1.
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  question.quizQuestionMarks
                                )}
                                {isEditing &&
                                editMarksQuestionId ===
                                  question.quizQuestionId ? (
                                  <button
                                    disabled={editedMarks < 1}
                                    onClick={() => handleEditClick()}
                                    className={`inline-flex items-center gap-x-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-center self-center disabled:bg-gray-400 disabled:cursor-not-allowed`}
                                  >
                                    Edit
                                  </button>
                                ) : (
                                  <PencilSquareIcon
                                    className="w-4 h-4 text-gray-500 ml-4 font-semibold"
                                    onClick={() => {
                                      setEditMarksQuestionId(
                                        question.quizQuestionId,
                                      );
                                      handleEditClick();
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            {/* <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteQuestionId(question.id);
                                setDeleteModalOpen(true);
                              }}
                              className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600"
                            >
                              <TrashIcon className="w-6 h-6 text-white" />
                            </button> */}
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
      {/* <WarningModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title={'Delete Question'}
        description={
          'Are you sure you want to remove this question from the quiz?'
        }
        confirmContent={'Delete'}
        dismissContent={'Cancel'}
        onConfirm={() => deleteQuizQuestionMutate(deleteQuestionId)}
      /> */}
    </div>
  );
};
