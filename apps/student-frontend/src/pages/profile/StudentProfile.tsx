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
  FullscreenSpinner,
  camelCaseToTitleCase,
  useAuth,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { SubjectEnum } from '@acer-academy-learning/data-access';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Parent, Student } from 'libs/data-access/src/lib/types/student';
import { useMemo, useEffect, useState } from 'react';
import { z } from 'zod';
import { includes } from 'lodash';
import { ProfileFieldType } from './types';
import { ProfileField } from './components/ProfileField';
import { updateStudent } from '../../api/student';
import { cloneDeep } from 'lodash';
import { StaticRowField } from './components/StaticRowField';
import { ErrorText } from './components/ErrorText';

const phoneRegex = /^(6|8|9)\d{7}$/;

const renderInputValue = (value: string | any[]): string =>
  Array.isArray(value) ? value.join(', ') : (value as string);

const subjects = Object.entries(SubjectEnum).map(([key, value]) => ({
  id: key.toLowerCase(),
  label: key.charAt(0).toUpperCase() + key.toLowerCase().slice(1),
  value: value,
}));

export const studentProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
  subjects: z
    .array(z.nativeEnum(SubjectEnum))
    .min(1, 'You must select at least one subject.'),
  school: z.string().trim().min(1, 'School cannot be empty.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone Number cannot be empty.')
    .regex(phoneRegex, 'Please enter a valid phone number.'),
});

export const parentProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
  phoneNumber: z.string().trim().min(1, 'Phone Number cannot be empty.'),
});

// Let's handle everything on this level first
export const StudentProfile = () => {
  const { displayToast, ToastType } = useToast();
  const { user: authUser, updateUser: setAuthUser } = useAuth<Student>();

  // States
  const [user, setUser] = useState(cloneDeep(authUser));
  // const user = useMemo(() => cloneDeep(authUser), [authUser]);
  const [firstNameOnEdit, setFirstNameOnEdit] = useState(false);
  const [lastNameOnEdit, setLastNameOnEdit] = useState(false);
  const [subjectsOnEdit, setSubjectsOnEdit] = useState(false);
  const [schoolOnEdit, setSchoolOnEdit] = useState(false);
  const [phoneNumberOnEdit, setPhoneNumberOnEdit] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    trigger,
  } = useZodForm({
    schema: studentProfileSchema,
    values: useMemo(
      () => ({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        subjects: user?.subjects ?? [],
        school: user?.school ?? '',
        phoneNumber: user?.phoneNumber ?? '',
      }),
      [user],
    ),
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
    const newParent = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    } as Parent;
    const newUser = cloneDeep(user);
    newUser?.parents?.push(newParent);
    setUser(newUser);
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
    values: z.infer<typeof studentProfileSchema>,
    setOnEdit: (val: boolean) => void,
    fieldName: string,
  ) => {
    if (user.id) {
      try {
        const res = await updateStudent(user?.id, values);
        console.log(res);
        setAuthUser(res.student);
        displayToast(fieldName + ' updated successfully!', ToastType.SUCCESS);
      } catch (error) {
        displayToast('Error occurred: ' + error, ToastType.ERROR);
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
                      errors?.firstName
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...register('firstName')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className={`text-red-600 text-xs`}>
                    {errors.firstName?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit((values) =>
                    handleSubmitForm(values, setFirstNameOnEdit, 'First Name'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                      errors?.lastName
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...register('lastName')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className={`text-red-600 text-xs`}>
                    {errors.lastName?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit((values) =>
                    handleSubmitForm(values, setLastNameOnEdit, 'Last Name'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                <div className="flex space-x-4">
                  {subjects.map((subject) => (
                    <label key={subject.id} className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('subjects')}
                        // checked={selectedSubjects.includes(subject.value)}
                        // onChange={() => handleSubjectChange(subject.value)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        value={subject.value}
                      />
                      <span className="ml-2 text-gray-700 text-sm">
                        {subject.label}
                      </span>
                      <ErrorText message={errors.subjects?.message} />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit((values) =>
                    handleSubmitForm(values, setSubjectsOnEdit, 'Subjects'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                      errors?.school
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...register('school')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className={`text-red-600 text-xs`}>
                    {errors.school?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit((values) =>
                    handleSubmitForm(values, setSchoolOnEdit, 'School'),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                      errors?.phoneNumber
                        ? 'focus-within:ring-red-600 ring-red-600'
                        : 'focus-within:ring-student-primary-600'
                    } text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset  sm:max-w-md`}
                  >
                    <input
                      type="text"
                      {...register('phoneNumber')}
                      className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className={`text-red-600 text-xs`}>
                    {errors.phoneNumber?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit((values) =>
                    handleSubmitForm(
                      values,
                      setPhoneNumberOnEdit,
                      'Phone Number',
                    ),
                  )}
                  className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

            {/* {userFields.map((field) => (
              <ProfileField
                key={field.id}
                userId={user.id}
                updateUser={updateStudent}
                setUser={setAuthUser}
                {...field}
            />
          ))} */}
          </div>
          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
            Parents Particulars
            {user.parents?.length === 1 && (
              <button
                onClick={handleAddParent}
                type="button"
                className="ml-2 rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
            {user.parents?.length === 2 && (
              <button
                onClick={handleRemoveParent}
                type="button"
                className="ml-2 rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <MinusIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
          {user.parents?.map((parent) => (
            <div className="mt-10 grid grid-cols-3 gap-2">
              <ProfileField
                label={'First Name'}
                value={parent.firstName}
                id={parent.firstName}
                userId={user.id}
                updateUser={updateStudent}
                setUser={setAuthUser}
              />
              <ProfileField
                label={'Last Name'}
                value={parent.lastName}
                id={parent.lastName}
                userId={user.id}
                updateUser={updateStudent}
                setUser={setAuthUser}
              />
              <ProfileField
                label={'Phone Number'}
                value={parent.phoneNumber}
                id={parent.phoneNumber}
                userId={user.id}
                updateUser={updateStudent}
                setUser={setAuthUser}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
