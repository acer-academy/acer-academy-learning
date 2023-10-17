import { ErrorField, GenericInput } from '@acer-academy-learning/common-ui';
import { CreateQuizType } from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

const rewardMinimumMarksId = 'reward-minimum-marks';

export const QuizRewardMinimumMarksField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateQuizType>();
  return (
    <>
      <label
        htmlFor={rewardMinimumMarksId}
        className="text-base flex items-center"
      >
        Reward Minimum Marks
      </label>
      <Controller
        control={control}
        name="rewardMinimumMarks"
        render={({ field: { onChange, value, onBlur } }) => (
          <div className="flex space-x-4 items-center">
            <GenericInput
              onChange={(e) => onChange(parseInt(e.target.value))}
              onBlur={onBlur}
              value={value ?? ''}
              type="number"
              id={rewardMinimumMarksId}
              name={rewardMinimumMarksId}
              inputClassName="w-20"
              hasError={!!errors?.rewardMinimumMarks?.message}
            />
            <ErrorMessage
              name="rewardMinimumMarks"
              render={({ message }) => <ErrorField message={message} />}
            />
          </div>
        )}
      />
    </>
  );
};
