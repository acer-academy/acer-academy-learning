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
} from '@acer-academy-learning/common-ui';
import { SubjectEnum } from '@acer-academy-learning/data-access';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { Parent, Student } from 'libs/data-access/src/lib/types/student';
import { useMemo, useEffect, useState } from 'react';
import { z } from 'zod';
import { includes } from 'lodash';
import { ProfileFieldType } from './types';
import { ProfileField } from './components/ProfileField';
import { LevelEnum } from '@prisma/client';
import { updateStudent } from '../../api/student';
import { cloneDeep } from 'lodash';

export const studentProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
  email: z.string().trim().optional(),
  subjects: z.nativeEnum(SubjectEnum),
  level: z.nativeEnum(LevelEnum),
  school: z.string().trim().min(1, 'School cannot be empty.'),
  phoneNumber: z.string().trim().min(1, 'Phone Number cannot be empty.'),
});

export const parentProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
  phoneNumber: z.string().trim().min(1, 'Phone Number cannot be empty.'),
});

export const StudentProfile = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth<Student>();
  // const user = useMemo(() => cloneDeep(authUser), [authUser]);
  const [user, setUser] = useState(cloneDeep(authUser));

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

  useEffect(() => {
    setUser(cloneDeep(authUser));
  }, [authUser]);

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
            {userFields.map((field) => (
              <ProfileField
                key={field.id}
                userId={user.id}
                updateUser={updateStudent}
                setUser={setAuthUser}
                {...field}
              />
            ))}
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
