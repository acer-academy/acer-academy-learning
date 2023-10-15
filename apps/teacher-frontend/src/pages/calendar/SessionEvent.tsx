import React from 'react';
import { Session } from './CustomCalendar.types';

export default function SessionEvent({ session }: { session: Session }) {
  const { location, resource, address } = session;

  return (
    <div className="p-1 h-full text-black">
      <div className="flex items-center justify-between">
        <div className="flex">
          <p className="text-xs">{location}</p>
        </div>
        <div className="flex">
          <p className="text-xs">{resource}</p>
        </div>
      </div>
      <div className="mt-4">
        {address.split('\n').map((add) => (
          <p className="text-xs">{add}</p>
        ))}
      </div>
    </div>
  );
}
