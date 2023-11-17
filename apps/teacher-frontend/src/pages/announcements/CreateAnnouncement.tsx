import {
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  CreateAnnouncementType,
  Teacher,
  createAnnouncement,
  createAnnouncementSchema,
} from '@acer-academy-learning/data-access';
import { isAxiosError } from 'axios';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CreateAnnouncementForm } from './components/CreateAnnouncementForm';
import { DEFAULT_CREATE_ANNOUNCEMENT_VALUES } from './constants';

export const CreateAnnouncement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();

  const formMethods = useZodForm({
    schema: createAnnouncementSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: DEFAULT_CREATE_ANNOUNCEMENT_VALUES,
  });

  const onSubmit = async (values: CreateAnnouncementType) => {
    if (user) {
      const createValues = {
        ...values,
        teacherId: user.id,
      };
      try {
        await createAnnouncement(createValues);
        displayToast('Successfully created announcement!', ToastType.SUCCESS);
        navigate(-1);
      } catch (error) {
        const errorMsg = isAxiosError<{ error: string }>(error)
          ? error.response?.data.error
          : 'Unknown error';
        displayToast('Error: ' + errorMsg, ToastType.ERROR);
        console.error(error);
      }
    } else {
      displayToast('Error: Not logged in!', ToastType.ERROR);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <CreateAnnouncementForm
        onSubmitForm={onSubmit}
        submitText="Create Announcement"
        isUpdate={false}
      />
    </FormProvider>
  );
};
