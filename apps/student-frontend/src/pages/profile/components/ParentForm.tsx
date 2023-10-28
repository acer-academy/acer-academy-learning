import React, { useMemo } from 'react';
import { firstNameSchema, lastNameSchema, phoneNumberSchema } from '../schemas';
import {
  Parent,
  Student,
  UpdateParentData,
} from 'libs/data-access/src/lib/types/student';
import {
  EditableFieldRow,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { deleteParent, updateParent } from '@acer-academy-learning/data-access';
import { z } from 'zod';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { last } from 'lodash';

export type ParentFormProps = {
  parent: Parent;
  student: Student;
  openAddParentModal: () => void;
};

export const ParentForm = ({
  parent,
  student,
  openAddParentModal,
}: ParentFormProps) => {
  const {
    formState: { errors: modifyFirstNameErrors },
    handleSubmit: handleFirstNameSubmit,
    register: registerFirstName,
  } = useZodForm({
    schema: firstNameSchema,
    values: useMemo(
      () => ({
        firstName: parent.firstName ?? '',
      }),
      [parent],
    ),
  });
  const {
    formState: { errors: modifyLastNameErrors },
    handleSubmit: handleLastNameSubmit,
    register: registerLastName,
  } = useZodForm({
    schema: lastNameSchema,
    values: useMemo(
      () => ({
        lastName: parent.lastName ?? '',
      }),
      [parent],
    ),
  });
  const {
    formState: { errors: modifyPhoneNumber },
    handleSubmit: handlePhoneNumberSubmit,
    register: registerPhoneNumber,
  } = useZodForm({
    schema: phoneNumberSchema,
    values: useMemo(
      () => ({
        phoneNumber: parent.phoneNumber ?? '',
      }),
      [parent],
    ),
  });
  const { updateUser } = useAuth();
  const { displayToast, ToastType } = useToast();
  const handleParentEditSubmitForm = async (
    values:
      | z.infer<typeof firstNameSchema>
      | z.infer<typeof lastNameSchema>
      | z.infer<typeof phoneNumberSchema>,
    message: string,
    callback?: () => void,
  ) => {
    try {
      const res = await updateParent(parent.id, values as UpdateParentData);
      updateUser(res.student);
      displayToast(message, ToastType.SUCCESS);
      if (callback) {
        callback();
      }
    } catch (error) {
      displayToast('Error occurred creating parent: ' + error, ToastType.ERROR);
    }
  };

  const handleDeleteParent = async () => {
    const res = await deleteParent(parent.id);
    updateUser(res.student);
    displayToast('Parent sucessfully deleted!', ToastType.SUCCESS);
  };

  return (
    <>
      <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
        Parents Particulars
        {student.parents?.length === 2 && (
          <button
            onClick={handleDeleteParent}
            type="button"
            className="ml-2 rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <MinusIcon className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </h2>
      <div className="mt-10 grid grid-cols-3 gap-2">
        <EditableFieldRow
          label="First Name"
          value={parent.firstName}
          id={parent.firstName}
          type="text"
          register={registerFirstName}
          registerKey="firstName"
          handleSubmit={handleFirstNameSubmit}
          handleSubmitForm={handleParentEditSubmitForm}
          errorMessage={modifyFirstNameErrors.firstName?.message}
        />
        <EditableFieldRow
          label="Last Name"
          value={parent.lastName}
          id={parent.lastName}
          type="text"
          register={registerLastName}
          registerKey="lastName"
          handleSubmit={handleLastNameSubmit}
          handleSubmitForm={handleParentEditSubmitForm}
          errorMessage={modifyLastNameErrors.lastName?.message}
        />
        <EditableFieldRow
          label="Phone Number"
          value={parent.phoneNumber}
          id={parent.phoneNumber}
          type="text"
          register={registerPhoneNumber}
          registerKey="phoneNumber"
          handleSubmit={handlePhoneNumberSubmit}
          handleSubmitForm={handleParentEditSubmitForm}
          errorMessage={modifyPhoneNumber.phoneNumber?.message}
        />
      </div>
    </>
  );
};
