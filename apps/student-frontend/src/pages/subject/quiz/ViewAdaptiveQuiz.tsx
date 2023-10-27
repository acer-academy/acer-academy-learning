import {
  BackButton,
  Divider,
  ErrorField,
  GenericBadges,
  GenericButton,
  GenericComboBox,
  screamingSnakeToTitleCase,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  CreateAdaptiveQuizType,
  QuizQuestionTopicEnum,
  createAdaptiveQuizSchema,
} from '@acer-academy-learning/data-access';
import { ErrorMessage } from '@hookform/error-message';
import React, { useCallback } from 'react';
import { Controller, FieldErrors } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const topicEnums = Object.values(QuizQuestionTopicEnum);
export const ViewAdaptiveQuiz = () => {
  const navigate = useNavigate();
  const { displayToast, ToastType } = useToast();
  const formMethods = useZodForm({
    schema: createAdaptiveQuizSchema,
    defaultValues: {
      topics: [],
    },
  });

  const onSubmit = async (values: CreateAdaptiveQuizType) => {
    navigate(`take/?topics=${encodeURIComponent(values.topics.join(','))}`);
  };

  const onError = useCallback(
    (errors: FieldErrors<CreateAdaptiveQuizType>) => {
      const msg = Object.entries(errors).map(([type, errorObj]) => (
        <p key={type} className="space-y-1">
          <strong>
            {type.charAt(0).toLocaleUpperCase() +
              type
                .substring(1)
                .split(/(?=[A-Z])/)
                .join(' ')}{' '}
            Error{' '}
          </strong>
          {errorObj.message ?? errorObj.root?.message}
        </p>
      ));
      console.error(errors);
      displayToast(<div key={'quiz-error-msg'}>{msg}</div>, ToastType.ERROR);
    },
    [ToastType.ERROR, displayToast],
  );

  return (
    <form
      onSubmit={formMethods.handleSubmit(onSubmit, onError)}
      className="flex flex-col space-y-4 relative h-full"
    >
      <BackButton className="bg-student-primary-600 hover:bg-student-primary-700 self-start" />
      <h1 className="text-3xl font-bold tracking-tight ">Adaptive Quiz</h1>
      <Divider lineClassName="border-gray-900" />
      <h1 className="text-3xl font-bold tracking-tight ">Description</h1>
      <p>
        Go through a series of questions based on your preferred topics. These
        questions get progressively harder based on your ability to answer them!
      </p>
      <Controller
        control={formMethods.control}
        name="topics"
        render={({ field: { value, onChange } }) => (
          <section>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Choose Your Topic(s):
            </h3>
            <Controller
              control={formMethods.control}
              name={'topics'}
              render={({ field: { onChange, value } }) => (
                <>
                  <GenericBadges
                    onChange={onChange}
                    badges={value}
                    getDisplayValue={(badge) =>
                      screamingSnakeToTitleCase(badge)
                    }
                    allowRemove
                  />
                  <ErrorMessage
                    errors={formMethods.formState.errors}
                    name="topics"
                    render={({ message }) => <ErrorField message={message} />}
                  />
                  <GenericComboBox
                    options={topicEnums}
                    onChange={onChange}
                    selected={value}
                    displayValue={(topic) => screamingSnakeToTitleCase(topic)}
                  />
                </>
              )}
            />
          </section>
        )}
      />
      <GenericButton
        className="bg-student-primary-600 hover:bg-student-primary-700 self-center absolute bottom-0"
        text="Start Adaptive Quiz"
      />
    </form>
  );
};
