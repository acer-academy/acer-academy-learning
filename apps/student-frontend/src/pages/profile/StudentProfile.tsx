/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import {
  Avatar,
  EditableFieldRow,
  FullscreenSpinner,
  camelCaseToTitleCase,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import {
  SubjectEnum,
  updateParent,
  updateStudent,
} from '@acer-academy-learning/data-access';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Parent, Student } from 'libs/data-access/src/lib/types/student';
import { useMemo, useEffect, useState } from 'react';
import { z } from 'zod';
import { includes } from 'lodash';
import { ProfileFieldType } from './types';
import { ProfileField } from './components/ProfileField';
import { cloneDeep } from 'lodash';
import { StaticRowField } from './components/StaticRowField';
import { ErrorText } from './components/ErrorText';
import { GenericModal } from './components/GenericModal';
import { ZodInputRow } from './components/ZodInputRow';
import {
  firstNameSchema,
  lastNameSchema,
  parentProfileSchema,
  passwordChangeSchema,
  phoneNumberSchema,
  schoolSchema,
  studentProfileSchema,
  subjectsSchema,
} from './schemas';
import { ParentForm } from './components/ParentForm';

const phoneRegex = /^(6|8|9)\d{7}$/;

const renderInputValue = (value: string | any[]): string =>
  Array.isArray(value) ? value.join(', ') : (value as string);

const subjects = Object.entries(SubjectEnum).map(([key, value]) => ({
  id: key.toLowerCase(),
  label: key.charAt(0).toUpperCase() + key.toLowerCase().slice(1),
  value: value,
}));

// Let's handle everything on this level first
export const StudentProfile = () => {
  const { displayToast, ToastType } = useToast();
  const { user: authUser, updateUser: setAuthUser } = useAuth<Student>();

  useEffect(() => {
    // Sort
    authUser?.parents?.sort((p1, p2) =>
      p1.id < p2.id ? -1 : p1.id === p2.id ? 0 : 1,
    );
  }, [authUser]);

  // States
  const [user, setUser] = useState(cloneDeep(authUser));
  // const user = useMemo(() => cloneDeep(authUser), [authUser]);
  const [firstNameOnEdit, setFirstNameOnEdit] = useState(false);
  const [lastNameOnEdit, setLastNameOnEdit] = useState(false);
  const [subjectsOnEdit, setSubjectsOnEdit] = useState(false);
  const [schoolOnEdit, setSchoolOnEdit] = useState(false);
  const [phoneNumberOnEdit, setPhoneNumberOnEdit] = useState(false);
  const [parentModalIsOpen, setParentModalIsOpen] = useState(false);
  const [changePasswordModalIsOpen, setChangePasswordModaIsOpen] =
    useState(false);

  // Form Registers
  // const {
  //   formState: { errors },
  //   handleSubmit,
  //   register,
  // } = useZodForm({
  //   schema: studentProfileSchema,
  //   values: useMemo(
  //     () => ({
  //       firstName: user?.firstName ?? '',
  //       lastName: user?.lastName ?? '',
  //       subjects: user?.subjects ?? [],
  //       school: user?.school ?? '',
  //       phoneNumber: user?.phoneNumber ?? '',
  //     }),
  //     [user],
  //   ),
  // });

  const {
    formState: { errors: studentFirstNameErrors },
    handleSubmit: handleStudentFirstNameSubmit,
    register: studentFirstNameRegister,
  } = useZodForm({
    schema: firstNameSchema,
    values: useMemo(
      () => ({
        firstName: user?.firstName ?? '',
      }),
      [user],
    ),
    mode: 'onBlur',
  });

  const {
    formState: { errors: studentWithLastNameErrors },
    handleSubmit: handleStuLastNameSubmit,
    register: studentLastNameRegister,
  } = useZodForm({
    schema: lastNameSchema,
    values: useMemo(
      () => ({
        lastName: user?.lastName ?? '',
      }),
      [user],
    ),
    mode: 'onBlur',
  });

  const {
    formState: { errors: studentSubjectErrors },
    handleSubmit: handleStudentSubjectSubmit,
    register: studentSubjectRegister,
  } = useZodForm({
    schema: subjectsSchema,
    values: useMemo(
      () => ({
        subjects: user?.subjects ?? [],
      }),
      [user],
    ),
    mode: 'onBlur',
  });
  const {
    formState: { errors: studentSchoolErrors },
    handleSubmit: handleStudentSchoolSubmit,
    register: studentSchoolRegister,
  } = useZodForm({
    schema: schoolSchema,
    values: useMemo(
      () => ({
        school: user?.school ?? '',
      }),
      [user],
    ),
    mode: 'onBlur',
  });
  const {
    formState: { errors: studentPhoneNumberErrors },
    handleSubmit: handleStudentPhoneNumberSubmit,
    register: phoneNumberRegister,
  } = useZodForm({
    schema: phoneNumberSchema,
    values: useMemo(
      () => ({
        phoneNumber: user?.phoneNumber ?? '',
      }),
      [user],
    ),
    mode: 'onBlur',
  });

  const {
    formState: { errors: parentErrors },
    handleSubmit: handleParentSubmit,
    register: parentRegister,
  } = useZodForm({
    schema: parentProfileSchema,
    values: useMemo(
      () => ({
        firstName: '',
        lastName: '',
        phoneNumber: '',
      }),
      [],
    ),
    mode: 'onTouched',
  });

  // const {
  //   formState: { errors: modifyParentOneErrors },
  //   handleSubmit: handleParentOneSubmit,
  //   register: registerParentOne,
  // } = useZodForm({
  //   schema: parentProfileSchema,
  //   values: useMemo(
  //     () => ({
  //       firstName: user?.parents?.length > 0 && user?.parents?.[0].firstName ?? '',
  //       lastName: user?.parents?.[0].lastName ?? '',
  //       phoneNumber: user?.parents?.[0].phoneNumber ?? '',
  //     }),
  //     [user?.parents],
  //   ),
  // });

  // const {
  //   formState: { errors: modifyParentTwoErrors },
  //   handleSubmit: handleParentTwoSubmit,
  //   register: registerParentTwo,
  // } = useZodForm({
  //   schema: parentProfileSchema,
  //   values: useMemo(
  //     () => ({
  //       firstName: user?.parents?.[1].firstName ?? '',
  //       lastName: user?.parents?.[1].lastName ?? '',
  //       phoneNumber: user?.parents?.[1].phoneNumber ?? '',
  //     }),
  //     [user?.parents],
  //   ),
  // });

  const {
    formState: { errors: passwordErrors },
    handleSubmit: handlePasswordSubmit,
    register: passwordRegister,
    reset: resetPassword,
  } = useZodForm({
    schema: passwordChangeSchema,
    values: useMemo(
      () => ({
        password: '',
        confirmPassword: '',
      }),
      [],
    ),
    mode: 'onChange',
  });

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  // Wrangle user data into something to map on
  const userFields = useMemo<ProfileFieldType[]>(
    () =>
      Object.keys(studentProfileSchema.shape).map((field) => ({
        id: field,
        label: camelCaseToTitleCase(field),
        value: user?.[field as keyof Student],
        isEditable: !includes(['email', 'password', 'level'], field),
        onEditMode: false,
      })) as ProfileFieldType[],
    [user],
  );

  // Handlers
  const handleAddParent = () => {
    setParentModalIsOpen(true);
  };
  const handleRemoveParent = () => {
    const newUser = cloneDeep(user);
    newUser?.parents.pop();
    setUser(newUser);
  };

  if (!user) {
    return <FullscreenSpinner />;
  }

  const handleSubmitForm = async (
    values:
      | Partial<z.infer<typeof studentProfileSchema>>
      | Partial<z.infer<typeof passwordChangeSchema>>,
    setOnEdit: (val: boolean) => void,
    fieldName: string,
    callback?: () => void,
  ) => {
    if (user.id) {
      try {
        const res = await updateStudent(user?.id, values);
        setAuthUser(res.student);
        displayToast(fieldName + ' updated successfully!', ToastType.SUCCESS);
        if (callback) {
          callback();
        }
      } catch (error) {
        displayToast('Error occurred: ' + error, ToastType.ERROR);
      }
    }
    setOnEdit(false);
  };

  const handleCreateParentSubmitForm = async (
    values: z.infer<typeof parentProfileSchema>,
    setOnEdit: (val: boolean) => void,
    message: string,
  ) => {
    if (user.id) {
      try {
        const shape = {
          firstName: user.firstName,
          parents: {
            create: [values],
          },
        };
        const res = await updateStudent(user?.id, shape);
        setAuthUser(res.student);
        displayToast(message, ToastType.SUCCESS);
      } catch (error) {
        displayToast(
          'Error occurred creating parent: ' + error,
          ToastType.ERROR,
        );
      }
    }
    setOnEdit(false);
  };

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <Avatar
            firstName={user?.firstName ?? 'Student'}
            size="h-20 w-20"
            textSize="lg:text-[2rem]"
          />
          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
            Personal Particulars
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          {/* <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"> */}
          <div className="mt-10 grid grid-cols-3 gap-2">
            {/* First Name */}

            <label
              htmlFor={user.firstName}
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              First Name
            </label>
            {(firstNameOnEdit && (
              <>
                <div className="flex flex-col">
                  <div
                    className={`${
                      studentFirstNameErrors?.firstName
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...studentFirstNameRegister('firstName')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <ErrorText
                    message={studentFirstNameErrors.firstName?.message}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStudentFirstNameSubmit((values) =>
                    handleSubmitForm(values, setFirstNameOnEdit, 'First Name'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-student-primary-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-student-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
                >
                  Save
                </button>
              </>
            )) || (
              <>
                <span className="leading-6 text-sm py-1.5">
                  {user.firstName}
                </span>
                <button
                  type="button"
                  onClick={() => setFirstNameOnEdit(true)}
                  className="text-student-primary-600 hover:underline"
                >
                  Edit
                </button>
              </>
            )}

            {/* Last Name */}
            <label
              htmlFor={user.lastName}
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Last Name
            </label>
            {(lastNameOnEdit && (
              <>
                <div className="flex flex-col">
                  <div
                    className={`${
                      studentWithLastNameErrors?.lastName
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...studentLastNameRegister('lastName')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* <span className={`text-red-600 text-xs`}>
                    {}
                  </span> */}
                  <ErrorText
                    message={studentWithLastNameErrors.lastName?.message}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStuLastNameSubmit((values) =>
                    handleSubmitForm(values, setLastNameOnEdit, 'Last Name'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-student-primary-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-student-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
                >
                  Save
                </button>
              </>
            )) || (
              <>
                <span className="leading-6 text-sm py-1.5">
                  {user.lastName}
                </span>
                <button
                  type="button"
                  onClick={() => setLastNameOnEdit(true)}
                  className="text-student-primary-600 hover:underline"
                >
                  Edit
                </button>
              </>
            )}
            {/* Email Name */}
            <StaticRowField title={'Email'} value={user.email} />
            {/* Subjects Name */}
            <label
              htmlFor={'subjects'}
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Subjects
            </label>
            {(subjectsOnEdit && (
              <>
                <div className="flex flex-col">
                  <div className="flex space-x-4">
                    {subjects.map((subject) => (
                      <label key={subject.id} className="flex items-center">
                        <input
                          type="checkbox"
                          {...studentSubjectRegister('subjects')}
                          // checked={selectedSubjects.includes(subject.value)}
                          // onChange={() => handleSubjectChange(subject.value)}
                          className="h-5 w-5 rounded border-gray-300 text-student-primary-600 focus:ring-student-primary-600"
                          value={subject.value}
                        />
                        <span className="ml-2 text-gray-700 text-sm">
                          {subject.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <ErrorText message={studentSubjectErrors.subjects?.message} />
                </div>
                <button
                  type="button"
                  onClick={handleStudentSubjectSubmit((values) =>
                    handleSubmitForm(values, setSubjectsOnEdit, 'Subjects'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-student-primary-900 px-2 py-1 font-semibold text-white shadow-sm hover:bg-student-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
                >
                  Save
                </button>
              </>
            )) || (
              <>
                <span className="leading-6 text-sm py-1.5">
                  {renderInputValue(user.subjects)}
                </span>
                <button
                  type="button"
                  onClick={() => setSubjectsOnEdit(true)}
                  className="text-student-primary-600 hover:underline"
                >
                  Edit
                </button>
              </>
            )}

            {/* Level Name */}
            <StaticRowField
              title={'Level'}
              value={renderInputValue(user.level)}
            />
            {/* School Name */}
            <label
              htmlFor={user.school}
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              School
            </label>
            {(schoolOnEdit && (
              <>
                <div className="flex flex-col">
                  <div
                    className={`${
                      studentSchoolErrors?.school
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...studentSchoolRegister('school')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className={`text-red-600 text-xs`}>
                    {studentSchoolErrors.school?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStudentSchoolSubmit((values) =>
                    handleSubmitForm(values, setSchoolOnEdit, 'School'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-student-primary-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-student-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
                >
                  Save
                </button>
              </>
            )) || (
              <>
                <span className="leading-6 text-sm py-1.5">{user.school}</span>
                <button
                  type="button"
                  onClick={() => setSchoolOnEdit(true)}
                  className="text-student-primary-600 hover:underline"
                >
                  Edit
                </button>
              </>
            )}
            {/* Phone Number */}
            <label
              htmlFor={user.phoneNumber}
              className="block text-sm font-medium leading-6 text-gray-900 text-left"
            >
              Phone Number
            </label>
            {(phoneNumberOnEdit && (
              <>
                <div className="flex flex-col">
                  <div
                    className={`${
                      studentPhoneNumberErrors?.phoneNumber
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...phoneNumberRegister('phoneNumber')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className={`text-red-600 text-xs`}>
                    {studentPhoneNumberErrors.phoneNumber?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStudentPhoneNumberSubmit((values) =>
                    handleSubmitForm(
                      values,
                      setPhoneNumberOnEdit,
                      'Phone Number',
                    ),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-student-primary-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-student-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
                >
                  Save
                </button>
              </>
            )) || (
              <>
                <span className="leading-6 text-sm py-1.5">
                  {user.phoneNumber}
                </span>
                <button
                  type="button"
                  onClick={() => setPhoneNumberOnEdit(true)}
                  className="text-student-primary-600 hover:underline"
                >
                  Edit
                </button>
              </>
            )}
            <span className="block text-sm font-medium leading-6 text-gray-900 text-left">
              Password
            </span>
            <button
              type="button"
              onClick={() => setChangePasswordModaIsOpen(true)}
              // className="text-student-primary-600 hover:underline"
              className="rounded-md bg-student-primary-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-student-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
            >
              Change Password
            </button>
          </div>
          {user.parents?.length < 2 && (
            <button
              onClick={handleAddParent}
              type="button"
              className="ml-2 rounded-full bg-student-primary-900 p-1.5 text-white shadow-sm hover:bg-student-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
            >
              <PlusIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {user.parents?.map((parent) => (
            <ParentForm
              key={parent.id}
              parent={parent}
              student={user}
              openAddParentModal={handleAddParent}
            />
          ))}
          {/* Change Password Modal */}
          <GenericModal
            isOpen={changePasswordModalIsOpen}
            setIsOpen={setChangePasswordModaIsOpen}
            title="Change Password"
          >
            <ZodInputRow
              label="Password"
              id="password"
              type="password"
              register={passwordRegister}
              registerKey="password"
              fieldError={passwordErrors.password}
              errorMessage={passwordErrors.password?.message}
            />
            <ZodInputRow
              label="Confirm Password"
              id="confirm-password"
              type="password"
              register={passwordRegister}
              registerKey="confirmPassword"
              fieldError={passwordErrors.confirmPassword}
              errorMessage={passwordErrors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={handlePasswordSubmit((values) =>
                handleSubmitForm(
                  { password: values.password },
                  setChangePasswordModaIsOpen,
                  'Password',
                  resetPassword,
                ),
              )}
              // className="text-student-primary-600 hover:underline"
              className="rounded-md bg-student-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-student-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
            >
              Change Password
            </button>
          </GenericModal>
          {/* Parent Creation MOdal */}
          <GenericModal
            isOpen={parentModalIsOpen}
            setIsOpen={setParentModalIsOpen}
          >
            <ZodInputRow
              label="First Name"
              id="first-name"
              type="text"
              register={parentRegister}
              registerKey={'firstName'}
              errorMessage={parentErrors.firstName?.message}
            />
            <ZodInputRow
              label="Last Name"
              id="last-name"
              type="text"
              register={parentRegister}
              registerKey={'lastName'}
              errorMessage={parentErrors.lastName?.message}
            />
            <ZodInputRow
              label="Phone Number"
              id="phone-number"
              type="text"
              register={parentRegister}
              registerKey={'phoneNumber'}
              errorMessage={parentErrors.phoneNumber?.message}
            />
            <button
              className="ml-2 rounded-full bg-student-primary-900 p-1.5 text-white shadow-sm hover:bg-student-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
              type="button"
              onClick={handleParentSubmit((values) =>
                handleCreateParentSubmitForm(
                  values,
                  setParentModalIsOpen,
                  'New parent entry created.',
                ),
              )}
            >
              Create
            </button>
          </GenericModal>
        </div>
      </div>
    </form>
  );
};
