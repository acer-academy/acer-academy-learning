import { Dialog, Transition } from '@headlessui/react';
import {
  FullscreenSpinner,
  useToast,
  useZodForm,
} from '@acer-academy-learning/common-ui';
import { SubjectEnum, updateStudent } from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import {
  useMemo,
  useEffect,
  useState,
  Dispatch,
  Fragment,
  PropsWithChildren,
  SetStateAction,
} from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { z } from 'zod';
import { cloneDeep } from 'lodash';

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
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone Number cannot be empty.')
    .regex(phoneRegex, 'Please enter a valid phone number.'),
});

interface StudentProfileProps {
  student?: Student;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const StudentUpdateModal = (props: StudentProfileProps) => {
  const { displayToast, ToastType } = useToast();
  const { student, isOpen, setIsOpen } = props;

  useEffect(() => {
    // Sort
    student?.parents?.sort((p1, p2) =>
      p1.id < p2.id ? -1 : p1.id === p2.id ? 0 : 1,
    );
  }, [student]);

  // States
  const [user, setUser] = useState(cloneDeep(student));
  const [firstNameOnEdit, setFirstNameOnEdit] = useState(false);
  const [lastNameOnEdit, setLastNameOnEdit] = useState(false);
  const [subjectsOnEdit, setSubjectsOnEdit] = useState(false);
  const [schoolOnEdit, setSchoolOnEdit] = useState(false);
  const [phoneNumberOnEdit, setPhoneNumberOnEdit] = useState(false);
  const [parentModalIsOpen, setParentModalIsOpen] = useState(false);

  // Form Registers
  const {
    formState: { errors },
    handleSubmit,
    register,
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
  });

  useEffect(() => {
    setUser(student);
  }, [student]);

  if (!student) {
    return null;
  }

  // Handlers
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
        setUser(res.student);
        displayToast(fieldName + ' updated successfully!', ToastType.SUCCESS);
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
        setUser(res.student);
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <form>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
                        Personal Particulars
                      </h2>
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
                                handleSubmitForm(
                                  values,
                                  setFirstNameOnEdit,
                                  'First Name',
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
                                handleSubmitForm(
                                  values,
                                  setLastNameOnEdit,
                                  'Last Name',
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
                                  <label
                                    key={subject.id}
                                    className="flex items-center"
                                  >
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
                                  </label>
                                ))}
                              </div>
                              <ErrorText message={errors.subjects?.message} />
                            </div>
                            <button
                              type="button"
                              onClick={handleSubmit((values) =>
                                handleSubmitForm(
                                  values,
                                  setSubjectsOnEdit,
                                  'Subjects',
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
                                handleSubmitForm(
                                  values,
                                  setSchoolOnEdit,
                                  'School',
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
                              {user.school}
                            </span>
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
                      </div>
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
                        />
                        <ZodInputRow
                          label="Last Name"
                          id="last-name"
                          type="text"
                          register={parentRegister}
                          registerKey={'lastName'}
                        />
                        <ZodInputRow
                          label="Phone Number"
                          id="phone-number"
                          type="text"
                          register={parentRegister}
                          registerKey={'phoneNumber'}
                        />
                        <button
                          className="ml-2 rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export type GenericModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
};

const GenericModal = ({
  isOpen,
  setIsOpen,
  title,
  children,
}: PropsWithChildren<GenericModalProps>) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-4 flex flex-col">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

type ErrorTextProps = {
  message?: string;
};

const ErrorText = ({ message }: ErrorTextProps) => {
  return <span className={`text-red-600 text-xs`}>{message}</span>;
};

type StaticRowFieldProp = {
  title: string;
  value: string;
};

const StaticRowField = ({ title, value }: StaticRowFieldProp) => {
  return (
    <>
      <span className="block text-sm font-medium leading-6 text-gray-900 text-left">
        {title}
      </span>
      <span className="leading-6 text-sm py-1.5">{value}</span>
      <div />
    </>
  );
};

type ZodInputRowProps<T extends FieldValues> = {
  id: string;
  label: string;
  type: HTMLInputElement['type'];
  register: UseFormRegister<T>;
  registerKey: Path<T>;
  errorMessage?: string;
};

const ZodInputRow = <T extends FieldValues>({
  id,
  label,
  type,
  register,
  registerKey,
  errorMessage = '',
}: ZodInputRowProps<T>) => {
  return (
    <div className={`flex items-center space-x-4 mb-7`}>
      <label
        htmlFor={id}
        className="w-1/4 text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="flex flex-col w-full">
        <input
          id={id}
          type={type}
          {...register(registerKey)}
          className={`w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
            errorMessage
              ? 'focus-within:ring-red-600 ring-red-600'
              : 'focus-within:ring-student-primary-600'
          }`}
        />
        <span className={`text-red-600 text-xs`}>{errorMessage}</span>
      </div>
    </div>
  );
};
