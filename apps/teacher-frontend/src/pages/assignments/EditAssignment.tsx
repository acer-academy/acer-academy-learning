import {
  FullscreenSpinner,
  getSubjectEnumFromPathParam,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  AssignmentData,
  CreateAssignmentType,
  Teacher,
  createAssignmentSchema,
  getAssignmentById,
  updateAssignment,
} from '@acer-academy-learning/data-access';
import { FormProvider } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CreateAssignmentForm } from './components/CreateAssignmentForm';
import omitDeep from 'omit-deep-lodash';
import { isAxiosError } from 'axios';

export type EditAssignmentProps = {
  assignment: AssignmentData;
};

export const EditAssignment = ({ assignment }: EditAssignmentProps) => {
  const { subject, assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth<Teacher>();
  const { displayToast, ToastType } = useToast();

  const formMethods = useZodForm({
    schema: createAssignmentSchema,
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: omitDeep(assignment, 'id') as CreateAssignmentType,
  });

  const onSubmit = async (values: CreateAssignmentType) => {
    if (!!assignmentId && !!subject && !!user) {
      try {
        const subjectEnum = getSubjectEnumFromPathParam(subject ?? '');
        const updateValues = {
          ...values,
          subject: subjectEnum,
          teacherId: user.id,
        };
        const updatedAssignment = await updateAssignment(
          assignmentId,
          updateValues,
        );
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
      displayToast(
        'Error: Not logged in or subject not found',
        ToastType.ERROR,
      );
    }
  };

  if (formMethods.formState.isLoading) {
    return <FullscreenSpinner />;
  }

  return (
    <FormProvider {...formMethods}>
      <CreateAssignmentForm
        onSubmitForm={onSubmit}
        submitText="Edit Assignment"
        isUpdate={true}
      />
    </FormProvider>
  );
};
