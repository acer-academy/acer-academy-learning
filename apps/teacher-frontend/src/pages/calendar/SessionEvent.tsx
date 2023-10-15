import React from 'react';
// import { Session } from './CustomCalendar.types';
import { SessionData } from 'libs/data-access/src/lib/types/session';

export default function SessionEvent({ session }: { session: SessionData }) {
  const { classroom, levels, subjects, teacher } = session;

  // console.log(session);

  return (
    <div className="p-1 h-full text-black">
      <div className="flex items-center justify-between">
        <div className="flex">
          <p className="text-xs">Capacity: {classroom.capacity}</p>
        </div>
      </div>
      <div className="flex">
        <p className="text-xs">Teacher: {teacher.firstName}</p>
      </div>
      <div className="flex">
        <p className="text-xs">Levels: {levels}</p>
      </div>
      <div className="flex">
        <p className="text-xs">Subjects: {subjects}</p>
      </div>
      <div className="flex">
        <p className="text-xs">CentreId: {classroom.centreId}</p>
      </div>
      <div className="mt-4">
        {/* {address.split('\n').map((add) => (
          <p className="text-xs">{add}</p>
        ))} */}
      </div>
    </div>
  );
}
