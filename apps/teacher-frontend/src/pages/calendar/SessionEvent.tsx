import React from 'react';
// import { Session } from './CustomCalendar.types';
import { SessionData } from 'libs/data-access/src/lib/types/session';

export default function SessionEvent({ session }: { session: SessionData }) {
  const { classroom, levels, subjects, teacher } = session;

  // console.log(session);

  return (
    <div className="h-full text-black">
      <div className="flex items-center justify-between">
        <div className="flex">
          <p className="text-xs">Capacity: {classroom.capacity}</p>
        </div>
      </div>
      <div className="flex">
        <p className="text-xs">Teacher: {teacher.firstName}</p>
      </div>
      <div className="flex">
        <p className="text-xs">Levels: {levels.join(', ')}</p>
      </div>
      <div className="flex">
        <p className="text-xs">Subjects: {subjects.join(', ')}</p>
      </div>
      <div className="flex">
        <p className="text-xs">Centre: {classroom.centre.name}</p>
      </div>
      <div className="mt-4">
      </div>
    </div>
  );
}

