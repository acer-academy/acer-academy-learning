import {
  BackButton,
  GenericButton,
  useToast,
} from '@acer-academy-learning/common-ui';
import { CreateAnnouncementType } from '@acer-academy-learning/data-access';
import { FieldErrors, useFormContext } from 'react-hook-form';
import { AnnouncementTitle } from './AnnouncementTitle';
import { AnnouncementMessage } from './AnnouncementMessage';
import { AnnouncementLevelsField } from './AnnouncementLevelsField';
import { AnnouncementSubjectsField } from './AnnouncementSubjectsField';
import { AnnonuncementCentresField } from './AnnonuncementCentresField';

export type CreateAnnouncementFormProps = {
  onSubmitForm: (values: CreateAnnouncementType) => Promise<void>;
  submitText: string;
  isUpdate: boolean;
};

export const CreateAnnouncementForm = ({
  onSubmitForm,
  submitText,
}: CreateAnnouncementFormProps) => {
  const { displayToast, ToastType } = useToast();
  const { handleSubmit } = useFormContext<CreateAnnouncementType>();

  const onError = (errors: FieldErrors<CreateAnnouncementType>) => {
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
      <div className="text-2xl py-1 font-bold tracking-tight">{submitText}</div>
      <form
        onSubmit={handleSubmit(onSubmitForm, onError)}
        className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded shadow space-y-4 flex flex-col"
      >
        <AnnouncementTitle />
        <AnnouncementMessage />
        <AnnouncementLevelsField />
        <AnnouncementSubjectsField />
        <AnnonuncementCentresField />
        <GenericButton
          type="submit"
          text={submitText}
          className="self-center bg-teacher-primary-900 hover:bg-teacher-secondary-700"
        />
      </form>
    </section>
  );
};
