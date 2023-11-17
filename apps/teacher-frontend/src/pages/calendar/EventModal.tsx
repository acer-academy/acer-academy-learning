import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getCentreById } from '@acer-academy-learning/data-access';

interface EventModalProps {
  onClose: () => void;
  event: any;
}

export const EventModal: React.FC<EventModalProps> = ({ onClose, event }) => {

  const [centreData, setCentreData] = useState(null);

  useEffect(() => {
    const fetchCentre = async () => {
      try {
        const centreData = await getCentreById(event.classroom.centreId);
        setCentreData(centreData.data);
        console.log(centreData);
      } catch (error) {
        console.error('Error fetching session details:', error);
        // Optional: Handle error, e.g., show error message
      }
    };

    fetchCentre();
  }, [event.id]);


  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Session Details
            </h3>
            <div className="mt-2">
              <p>
                <strong>Start:</strong>{' '}
                {moment(event?.start).format('MMMM Do YYYY, h:mm a')}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {moment(event?.end).format('MMMM Do YYYY, h:mm a')}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
              <p>
                <strong>Centre:</strong> {centreData?.name}
              </p>
              <p>
                <strong>Address:</strong> {centreData?.address}
              </p>
              <p>
                <strong>Classroom:</strong> {event?.classroom?.name}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
               <p>
                <strong>Levels:</strong> {event?.levels?.join(', ')}
              </p>
              <p>
                <strong>Subjects:</strong>{' '}
                {event?.subjects
                  ?.map(
                    (subject) =>
                      subject.charAt(0) + subject.slice(1).toLowerCase(),
                  )
                  .join(', ')}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />

              <p>
                <strong>Teacher:</strong> {event?.teacher?.firstName}{' '}
                {event?.teacher?.lastName}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
              <p>
                <strong>Students:</strong>{' '}
                {event?.students
                  ?.map((student) => student.firstName)
                  .join(', ')}
              </p>
              <p>
                <strong>Available slots:</strong>{' '}
                {event?.classroom.capacity - event?.students.length}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teacher-primary-900 text-base font-medium text-white hover:bg-teacher-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teacher-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
