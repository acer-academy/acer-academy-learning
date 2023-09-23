import { Dialog, Transition } from '@headlessui/react';
import { updateTeacher } from '@acer-academy-learning/data-access';
import { TeacherData } from 'libs/data-access/src/lib/types/teacher';
import { useToast } from '@acer-academy-learning/common-ui';
import React, { Fragment, useEffect, useState } from 'react';

export interface TeacherUpdateModalProps {
  teacherData?: TeacherData;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isOpen: boolean;
}

export const TeacherUpdateModal: React.FC<TeacherUpdateModalProps> = (
  props: TeacherUpdateModalProps,
) => {
  const { teacherData, setIsModalOpen, isOpen } = props;
  const { displayToast, ToastType } = useToast();

  const [updUser, setUpdUser] = useState<any>({
    firstName: teacherData?.firstName || '',
    lastName: teacherData?.lastName || '',
    subjects: teacherData?.subjects || [],
    levels: teacherData?.levels || [],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (teacherData) {
      setUpdUser({
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        subjects: teacherData.subjects,
        levels: teacherData.levels,
      });
    }
  }, [teacherData]);

  if (!teacherData) {
    return null;
  }

  enum SubjectEnum {
    MATHEMATICS = 'MATHEMATICS',
    ENGLISH = 'ENGLISH',
    SCIENCE = 'SCIENCE',
  }

  const subjects = [
    { id: 'english', value: 'ENGLISH' },
    { id: 'science', value: 'SCIENCE' },
    { id: 'math', value: 'MATHEMATICS' },
    // add more subjects as needed
  ];

  const levels = [
    ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    ['S1', 'S2', 'S3', 'S4', 'S5'],
    ['J1', 'J2'],
    // add more rows as needed
  ];

  const handleChange = (field: string, data: string) => {
    if (field === 'subject') {
      setUpdUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          subjects: prevUser.subjects.includes(data)
            ? prevUser.subjects.filter((subj: string) => subj !== data)
            : [...prevUser.subjects, data],
        };
        return updatedUser;
      });
    } else if (field === 'level') {
      setUpdUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          levels: prevUser.levels.includes(data)
            ? prevUser.levels.filter((level: string) => level !== data)
            : [...prevUser.levels, data],
        };
        return updatedUser;
      });
    }
  };

  const editProfile = () => {
    setIsEditing(true);
  };

  const saveProfile = async () => {
    try {
      if (updUser.subjects.length === 0 || updUser.levels.length === 0) {
        displayToast(
          `You need to choose at least a Subject and Level`,
          ToastType.ERROR,
        );
      } else if (
        updUser.firstName.length === 0 ||
        updUser.lastName.length === 0
      ) {
        displayToast(
          `Please fill in your First and Last name`,
          ToastType.ERROR,
        );
      } else {
        const subjectEnumArray: SubjectEnum[] = updUser.subjects
          .filter((subject: string) => subject in SubjectEnum)
          .map(
            (subject: string) =>
              SubjectEnum[subject as keyof typeof SubjectEnum],
          );
        const updated = await updateTeacher(teacherData.id, {
          ...updUser,
          subjects: subjectEnumArray,
        });
        setIsEditing(false);
        displayToast(`Profile updated!`, ToastType.SUCCESS);
      }
    } catch (error) {
      displayToast('Profile update failed', ToastType.ERROR);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
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
                <div className="h-full">
                  <div className="mx-8 sm:mx-auto sm:w-full sm:max-w-[1000px]">
                    <div className="flex justify-between items-center">
                      <h1 className="mt-6 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Teacher Profile
                      </h1>
                      <div className="mt-4 sm:mt-0">
                        {isEditing ? (
                          <button
                            onClick={saveProfile}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
                          >
                            Save Profile
                          </button>
                        ) : (
                          <button
                            onClick={editProfile}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
                          >
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[1000px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            First Name:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={updUser.firstName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
                                setUpdUser({
                                  ...updUser,
                                  firstName: e.target.value,
                                })
                              }
                              autoFocus
                            />
                          ) : (
                            <span className="text-gray-800">
                              {updUser.firstName}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-600">
                            Last Name:
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={updUser.lastName}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) =>
                                setUpdUser({
                                  ...updUser,
                                  lastName: e.target.value,
                                })
                              }
                              autoFocus
                            />
                          ) : (
                            <span className="ext-gray-800">
                              {updUser.lastName}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">
                              Levels:
                            </span>
                            {isEditing ? (
                              <div className="w-3/4 mt-2 flex flex-col space-y-4 pl-3 py-5">
                                {levels.map((row, rowIndex) => (
                                  <div
                                    key={rowIndex}
                                    className="flex space-x-4 justify-start"
                                  >
                                    {row.map((level) => (
                                      <label
                                        key={level}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={updUser.levels.includes(
                                            level,
                                          )}
                                          onChange={() =>
                                            handleChange('level', level)
                                          }
                                          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <span className="ml-2 text-gray-700">
                                          {level}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="ext-gray-800">
                                {updUser.levels
                                  ? updUser.levels.join(', ')
                                  : ''}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-semibold text-gray-600">
                              Subjects:
                            </span>
                            {isEditing ? (
                              <div className="w-3/4 mt-2 flex justify-between space-y-4 pl-3">
                                {subjects.map((subject) => (
                                  <label
                                    key={subject.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={updUser.subjects.includes(
                                        subject.value,
                                      )}
                                      onChange={() =>
                                        handleChange('subject', subject.value)
                                      }
                                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <span className="ml-2 text-gray-700">
                                      {subject.value}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-800">
                                {updUser.subjects
                                  ? updUser.subjects.join(', ')
                                  : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-600">
                          Email:
                        </span>
                        <span className="text-gray-800">
                          {teacherData.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
