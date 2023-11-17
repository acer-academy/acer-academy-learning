import {
  FullscreenSpinner,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  AnnouncementData,
  CreateAnnouncementType,
  Teacher,
  createAnnouncementSchema,
  updateAnnouncement,
} from '@acer-academy-learning/data-access';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import omitDeep from 'omit-deep-lodash';
import { isAxiosError } from 'axios';
import { CreateAnnouncementForm } from './components/CreateAnnouncementForm';

export type EditAnnouncementProps = {
  announcement: AnnouncementData;
};

export const EditAnnouncement = ({ announcement }: EditAnnouncementProps) => {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();

  const formMethods = useZodForm({
    schema: createAnnouncementSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: omitDeep(announcement, 'id') as CreateAnnouncementType,
  });

  const onSubmit = async (values: CreateAnnouncementType) => {
    if (!!announcementId && !!user) {
      try {
        const updateValues = {
          ...values,
          teacherId: user.id,
        };
        await updateAnnouncement(announcementId, updateValues);
        displayToast('Successfully updated quiz!', ToastType.SUCCESS);
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

  if (formMethods.formState.isLoading) {
    return <FullscreenSpinner />;
  }

  return (
    <FormProvider {...formMethods}>
      <CreateAnnouncementForm
        onSubmitForm={onSubmit}
        submitText="Edit Announcement"
        isUpdate={true}
      />
    </FormProvider>
  );
};
