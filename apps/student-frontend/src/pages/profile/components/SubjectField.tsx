import { SubjectEnum } from '@acer-academy-learning/data-access';
import React, { useMemo, useState } from 'react';

export type SubjectFieldProps = {
  value: SubjectEnum[];
  setValue: (val: SubjectEnum[]) => void;
};

export const SubjectField = ({ value, setValue }: SubjectFieldProps) => {
  const [selectedSubjects, setSelectedSubjects] =
    useState<SubjectEnum[]>(value);

  const subjects = useMemo(
    () =>
      Object.entries(SubjectEnum).map(([key, value]) => ({
        id: key.toLowerCase(),
        label: key.charAt(0).toUpperCase() + key.toLowerCase().slice(1),
        value: value,
      })),
    [],
  );

  // Handler
  const handleSubjectChange = (subject: SubjectEnum) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((subj) => subj !== subject)
        : [...prevSubjects, subject],
    );
  };

  return (
    <div className="flex space-x-4">
      {subjects.map((subject) => (
        <label key={subject.id} className="flex items-center">
          <input
            type="checkbox"
            checked={selectedSubjects.includes(subject.value)}
            onChange={() => handleSubjectChange(subject.value)}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <span className="ml-2 text-gray-700">{subject.label}</span>
        </label>
      ))}
    </div>
  );
};
