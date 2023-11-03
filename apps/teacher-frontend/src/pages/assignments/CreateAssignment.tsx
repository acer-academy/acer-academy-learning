import {
  getSubjectEnumFromPathParam,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  CreateAssignmentType,
  Teacher,
  createAssignment,
  createAssignmentSchema,
} from '@acer-academy-learning/data-access';
import { isAxiosError } from 'axios';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateAssignmentForm } from './components/CreateAssignmentForm';
import { DEFAULT_CREATE_ASSIGNMENT_VALUES } from './constants';

export const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();

  const formMethods = useZodForm({
    schema: createAssignmentSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: DEFAULT_CREATE_ASSIGNMENT_VALUES,
  });

  const onSubmit = async (values: CreateAssignmentType) => {
    const subjectEnum = getSubjectEnumFromPathParam(subject ?? '');
    if (!!subjectEnum && !!user) {
      const createValues = {
        ...values,
        subject: subjectEnum,
        teacherId: user.id,
      };
      try {
        const newAssignment = await createAssignment(createValues);
        displayToast('Successfully created assignment!', ToastType.SUCCESS);
        navigate(-1);
      } catch (error) {
        const errorMsg = isAxiosError<{ error: string }>(error)
          ? error.response?.data.error
          : 'Unknown error';
        displayToast('Error: ' + errorMsg, ToastType.ERROR);
        console.error(error);
      }
    } else {
      displayToast(
        'Error: Not logged in or subject not found',
        ToastType.ERROR,
      );
    }
  };

  return (
    <FormProvider {...formMethods}>
      <CreateAssignmentForm
        onSubmitForm={onSubmit}
        submitText="Create Assignment"
        isUpdate={false}
      />
    </FormProvider>
  );
};
