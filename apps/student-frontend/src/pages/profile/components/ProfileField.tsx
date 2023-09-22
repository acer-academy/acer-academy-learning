import React, { useState } from 'react';
import { ProfileFieldType } from '../types';
import { Student } from 'libs/data-access/src/lib/types/student';
import { SubjectEnum } from '@acer-academy-learning/data-access';
import { SubjectField } from './SubjectField';

const renderValue = (value: ProfileFieldProps['value']): string =>
  Array.isArray(value) ? value.join(', ') : (value as string);

export type ProfileFieldProps = {
  updateUser: (email: string, data: any) => Promise<any>;
  // setClonedUser: Dispatch<SetStateAction<Student | null>>;
  setUser: (student: Student) => void;
  userId: string;
} & Partial<ProfileFieldType>;

/**
 * This component is to be used with a CSS Grid
 */
export const ProfileField = ({
  label,
  value,
  id,
  userId,
  setUser,
  updateUser,
}: ProfileFieldProps) => {
  const [onEditMode, setOnEditMode] = useState<boolean>(false);
  const [currValue, setCurrValue] = useState(value);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectEnum[]>();

  const handleUpdate = async () => {
    if (id) {
      const res = await updateUser(userId, { [id]: currValue });
      setUser(res.student);
      setOnEditMode(false);
    }
  };
  return (
    // <div className="flex justify-between items-center w-full">
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 text-left"
      >
        {label}
      </label>
      {(onEditMode &&
        ((Array.isArray(value) && (
          <SubjectField
            value={currValue as SubjectEnum[]}
            setValue={setCurrValue}
          />
        )) || (
          <div className="text-left flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-student-primary-600 sm:max-w-md">
            <input
              type="text"
              name={id}
              id={id}
              value={currValue as string}
              onChange={(e) => setCurrValue(e.target.value)}
              className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
          </div>
        ))) || (
        <span className="leading-6 text-sm py-1.5">{renderValue(value)}</span>
      )}
      {(onEditMode && (
        <button
          type="button"
          onClick={() => handleUpdate()}
          className="max-w-sm rounded self-center justify-self-center bg-indigo-600 px-2 py-1 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      )) || (
        <button
          type="button"
          onClick={() => setOnEditMode(true)}
          className="text-student-primary-600 hover:underline"
        >
          Edit
        </button>
      )}
    </>
    // </div>
  );
};
