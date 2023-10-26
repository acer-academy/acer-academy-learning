import { RadioGroup } from '@headlessui/react';
import { SearchStudentsSection } from './SearchStudentsSection';
import {
  QuizData,
  Teacher,
  updateQuiz,
} from '@acer-academy-learning/data-access';
import { useEffect } from 'react';
import {
  GenericButton,
  useAuth,
  useToast,
} from '@acer-academy-learning/common-ui';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

export const StudentsSection: React.FC<{
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  allocatedTo: string[];
  setAllocatedTo: (allocatedTo: string[]) => void;
  publishedQuiz?: QuizData;
}> = (props) => {
  const { isPublic, setIsPublic, allocatedTo, setAllocatedTo, publishedQuiz } =
    props;
  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth<Teacher>();

  const changesMade = () => {
    const lengthCheck =
      allocatedTo.length !== publishedQuiz?.allocatedTo.length;
    const allocatedToCheck = !allocatedTo
      .map((x) => publishedQuiz?.allocatedTo.includes(x))
      .reduce((x, y) => x && y, true);
    const publicCheck = publishedQuiz?.isPublic !== isPublic;
    return lengthCheck || allocatedToCheck || publicCheck;
  };

  const updateAllocatedTo = async (quiz: QuizData) => {
    if (!user || !user.id) throw Error('Error: Not logged in.');
    try {
      const updateValues = {
        title: quiz.title,
        description: quiz.description,
        topics: quiz.topics,
        levels: quiz.levels,
        rewardPoints: quiz.rewardPoints,
        timeAllowed: quiz.timeAllowed,
        totalMarks: quiz.totalMarks,
        rewardMinimumMarks: quiz.rewardMinimumMarks,
        quizQuestions: quiz.quizQuestions,
        subject: quiz.subject,
        teacherCreated: user.id,
        allocatedTo: allocatedTo ?? [],
        isPublic: isPublic,
      };
      const newQuiz = await updateQuiz({
        quizId: quiz.id,
        data: updateValues,
      });
      displayToast('Successfully updated question version', ToastType.SUCCESS);
      navigate(`/subjects/${quiz.subject}/quizzes/${newQuiz.data.id}`);
    } catch (error) {
      const errorMsg = isAxiosError<{ error: string }>(error)
        ? error.response?.data.error
        : 'Unknown error';
      displayToast('Error: ' + errorMsg, ToastType.ERROR);
      console.error(error);
    }
  };

  const options = [
    {
      name: 'Public Quiz',
      description: `Quiz will be accessible to all students of the quiz's levels`,
      isPublic: true,
    },
    {
      name: 'Allocated Quiz',
      description: 'Quiz will only be accessible to allocated students',
      isPublic: false,
    },
  ];

  useEffect(() => {
    if (publishedQuiz) {
      setAllocatedTo(publishedQuiz.allocatedTo);
    }
  }, [isPublic]);

  return (
    <div>
      {isPublic && (
        <RadioGroup value={isPublic} onChange={setIsPublic}>
          <div className="mt-10">
            <RadioGroup.Label className="text-2xl font-semibold leading-6 text-gray-900">
              Select public or allocated quiz
            </RadioGroup.Label>
          </div>
          <div className="-space-y-px rounded-md bg-white mt-4 mb-4">
            {options.map((option, optionIdx) => (
              <RadioGroup.Option
                key={option.name}
                value={option.isPublic}
                className={({ checked }) => `
                ${optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : ''}
                ${
                  optionIdx === options.length - 1
                    ? 'rounded-bl-md rounded-br-md'
                    : ''
                }
                ${
                  checked
                    ? 'z-10 border-indigo-200 bg-indigo-50'
                    : 'border-gray-200'
                }
                relative flex cursor-pointer border p-4 focus:outline-none
              `}
              >
                {({ active, checked }) => (
                  <>
                    <span
                      className={`
                      ${
                        checked
                          ? 'bg-indigo-600 border-transparent'
                          : 'bg-white border-gray-300'
                      }
                      ${active ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}
                      mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center
                    `}
                      aria-hidden="true"
                    >
                      <span className="rounded-full bg-white w-1.5 h-1.5" />
                    </span>
                    <span className="ml-3 flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className={`
                        ${checked ? 'text-indigo-900' : 'text-gray-900'}
                        block text-sm font-medium
                      `}
                      >
                        {option.name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={`
                        ${checked ? 'text-indigo-700' : 'text-gray-500'}
                        block text-sm
                      `}
                      >
                        {option.description}
                      </RadioGroup.Description>
                    </span>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
      {!isPublic && (
        <SearchStudentsSection
          allocatedTo={allocatedTo || []}
          setAllocatedTo={setAllocatedTo}
          setIsPublic={setIsPublic}
        />
      )}
      {publishedQuiz && changesMade() && (
        <div className="flex justify-end mt-10 gap-5">
          <GenericButton
            onClick={() => {
              updateAllocatedTo(publishedQuiz);
            }}
            className="hover:bg-gray-700"
            text="Update"
          ></GenericButton>
        </div>
      )}
    </div>
  );
};
