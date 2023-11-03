import {
  BackButton,
  GenericButton,
  useToast,
} from '@acer-academy-learning/common-ui';
import { CreateAssignmentType } from '@acer-academy-learning/data-access';
import { AssignmentTitle } from './AssignmentTitle';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { AssignmentDescription } from './AssignmentDescription';
import { AssignmentFileName } from './AssignmentFileName';
import { AssignmentFileUrl } from './AssignmentFileUrl';
import { AssignmentLevelsField } from './AssignmentLevelsField';
import { AssignmentTotalMarksField } from './AssignmentTotalMarksField';
import { AssignmentDueDateField } from './AssignmentDueDateField';

export type CreateAssignmentFormProps = {
  onSubmitForm: (values: CreateAssignmentType) => Promise<void>;
};

export const CreateAssignmentForm = ({
  onSubmitForm,
}: CreateAssignmentFormProps) => {
  const { displayToast, ToastType } = useToast();
  const { handleSubmit } = useFormContext<CreateAssignmentType>();

  const onError = (errors: FieldErrors<CreateAssignmentType>) => {
    const msg = Object.entries(errors).map(([type, errorObj]) => (
      <p key={type} className="space-y-1">
        <strong>
          {type.charAt(0).toLocaleUpperCase() +
            type
              .substring(1)
              .split(/(?=[A-Z])/)
              .join(' ')}{' '}
          Error:{' '}
        </strong>
        {errorObj.message ?? errorObj.root?.message}
      </p>
    ));
    console.error(errors);
    displayToast(<div key={'quiz-error-msg'}>{msg}</div>, ToastType.ERROR);
  };

  return (
    <section className="space-y-4">
      <BackButton />
      <div className="text-2xl py-1 font-bold tracking-tight">
        Create Assignment
      </div>
      <form
        onSubmit={handleSubmit(onSubmitForm, onError)}
        className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col"
      >
        <AssignmentTitle />
        <AssignmentDescription />
        <AssignmentDueDateField />
        <AssignmentLevelsField />
        <AssignmentTotalMarksField />
        <AssignmentFileName />
        <AssignmentFileUrl />
        <GenericButton
          type="submit"
          text="Create"
          className="self-center hover:bg-gray-700"
        />
      </form>
    </section>
  );
};
