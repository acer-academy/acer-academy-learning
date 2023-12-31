import {
  GenericSelect,
  screamingSnakeToTitleCase,
  useToast,
  LexEditor,
  ErrorField,
  GenericButton,
} from '@acer-academy-learning/common-ui';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import {
  CreateQuizQuestionType,
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
} from '@acer-academy-learning/data-access';
import {
  Controller,
  FieldErrors,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import { QuestionAnswers } from './QuestionAnswers';
import { QuestionTopicsCombo } from './QuestionTopicsCombo';
import { QuestionLevelsCombo } from './QuestionLevelsCombo';
import { omit } from 'lodash';
import { ErrorMessage } from '@hookform/error-message';

const difficulties = Object.values(QuizQuestionDifficultyEnum);
const statuses = Object.values(QuizQuestionStatusEnum);

export type QuestionCardProps = {
  onSubmitForm: (values: CreateQuizQuestionType) => Promise<void>;
  submitText?: string;
};

export const QuestionCard = ({
  onSubmitForm,
  submitText,
}: QuestionCardProps) => {
  const { displayToast, ToastType } = useToast();
  const { control, handleSubmit } = useFormContext<CreateQuizQuestionType>();

  const { errors } = useFormState<CreateQuizQuestionType>();

  const handleSubmitForm = async (values: CreateQuizQuestionType) => {
    onSubmitForm(values);
  };

  const handleError = (errors: FieldErrors<CreateQuizQuestionType>) => {
    const msg = Object.entries(errors).map(([type, errorObj]) => (
      <>
        <p key={type} className="space-y-1">
          <strong>
            {type.charAt(0).toLocaleUpperCase() + type.substring(1)} Error:{' '}
          </strong>
          {errorObj.message ?? errorObj.root?.message}
        </p>
        {type === 'answers' &&
          Object.entries(omit(errors.answers, 'root') ?? {}).map?.(
            ([key, answer]: [string, any]) => (
              <p key={key}>
                <strong>
                  Field #
                  {parseInt(answer?.answer?.ref?.name?.split('.')?.[1] ?? key) +
                    1}
                  :
                </strong>{' '}
                {answer?.root?.message}
                {answer?.answer?.message}
                {answer?.explanation?.message}
                {answer?.isCorrect?.message}
              </p>
            ),
          )}
      </>
    ));
    displayToast(<div key={'error-msg'}>{msg}</div>, ToastType.ERROR);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm, handleError)}
      className="border border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col"
    >
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Question:
      </h3>
      <Controller
        control={control}
        name="questionText"
        render={({ field: { onChange, value, onBlur }, fieldState }) => (
          <>
            <LexEditor
              hasError={!!errors.questionText?.message}
              onChange={onChange}
              editorStateStr={value}
              onBlur={onBlur}
            />
            <ErrorMessage
              errors={errors}
              name="questionText"
              render={({ message }) => <ErrorField message={message} />}
            />
          </>
        )}
      />
      <QuestionTypeSelect />
      <QuestionAnswers />
      <QuestionTopicsCombo />
      <QuestionLevelsCombo />
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Difficulty:
      </h3>
      <Controller
        control={control}
        name="difficulty"
        render={({ field: { onChange, value } }) => (
          <GenericSelect
            options={difficulties}
            onChange={onChange}
            selected={value}
            getDisplayValue={(option) => screamingSnakeToTitleCase(option)}
            placeholder="Choose Difficulty"
            errorMessage={errors.difficulty?.message}
          />
        )}
      />
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Status:
      </h3>
      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <GenericSelect
            options={statuses}
            onChange={onChange}
            selected={value}
            getDisplayValue={(option) => screamingSnakeToTitleCase(option)}
            placeholder="Choose Status"
            errorMessage={errors.status?.message}
          />
        )}
      />
      <GenericButton
        text={submitText ?? 'Submit'}
        className={`bg-student-primary-900 hover:bg-student-secondary-700 inline-flex font-semibold self-center text-center`}
      />
    </form>
  );
};
