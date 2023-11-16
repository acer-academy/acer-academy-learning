import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { on } from 'events';
import {
  bookSession,
  cancelSession,
  getSessionById,
  getCentreById,
} from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';

interface EventModalProps {
  onClose: () => void;
  studentId: string;
  event: any;
  fetchSessions: () => Promise<void>;
}

export const EventModal: React.FC<EventModalProps> = ({
  onClose,
  event,
  studentId,
  fetchSessions,
}) => {
  const [session, setSession] = useState(null);
  const { displayToast, ToastType } = useToast();
  const [centreData, setCentreData] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSessionById(event.id);
        console.log(sessionData.data);
        setSession(sessionData.data);
      } catch (error) {
        console.error('Error fetching session details:', error);
        // Optional: Handle error, e.g., show error message
      }
    };

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

    fetchSession();
    fetchCentre();
  }, [event.id]);

  console.log(event);
  const isStudentBooked = () => {
    return session?.students.some((student) => student.id === studentId);
  };

  async function handleSubmit() {
    try {
      const response = await bookSession(event.id, studentId);
      if (response.status === 200) {
        displayToast('Successfully booked.', ToastType.SUCCESS);
        // onClose();
        await fetchSessions();
        const fetchSession = async () => {
          try {
            const sessionData = await getSessionById(event.id);
            console.log(sessionData.data);
            setSession(sessionData.data);
          } catch (error) {
            console.error('Error fetching session details:', error);
            // Optional: Handle error, e.g., show error message
          }
        };

        fetchSession();
        // displayToast('Session created successfully!', ToastType.SUCCESS);
      }
    } catch (err) {
      // onClose();
      displayToast(`${err.response.data.error}`, ToastType.ERROR);
    }

    // console.log(studentId, event.id)
    // await bookSession(event.id, studentId)
  }

  // Function to handle unbooking
  const handleUnbook = async () => {
    try {
      const response = await cancelSession(event.id, studentId);
      if (response.status === 200) {
        displayToast('Successfully unbooked.', ToastType.SUCCESS);
        // onClose();
        await fetchSessions();

        const fetchSession = async () => {
          try {
            const sessionData = await getSessionById(event.id);
            console.log(sessionData.data);
            setSession(sessionData.data);
          } catch (error) {
            console.error('Error fetching session details:', error);
            // Optional: Handle error, e.g., show error message
          }
        };

        fetchSession();
        // displayToast('Session created successfully!', ToastType.SUCCESS);
      }
    } catch (err) {
      console.log('error');
      // onClose();
      displayToast(`${err.response.data.error}`, ToastType.ERROR);
    }
  };

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
                {moment(session?.start).format('MMMM Do YYYY, h:mm a')}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {moment(session?.end).format('MMMM Do YYYY, h:mm a')}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
              <p>
                <strong>Centre:</strong> {centreData?.name}
              </p>
              <p>
                <strong>Address:</strong> {centreData?.address}
              </p>
              <p>
                <strong>Classroom:</strong> {session?.classroom?.name}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
              <p>
                <strong>Levels:</strong> {session?.levels?.join(', ')}
              </p>
              <p>
                <strong>Subjects:</strong>{' '}
                {session?.subjects
                  ?.map(
                    (subject) =>
                      subject.charAt(0) + subject.slice(1).toLowerCase(),
                  )
                  .join(', ')}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
              <p>
                <strong>Teacher:</strong> {session?.teacher?.firstName}{' '}
                {session?.data?.session?.teacher?.lastName}
              </p>
              <div className="w-full border-t border-gray-300 mt-2 mb-2" />
              <p>
                <strong>Students:</strong>{' '}
                {session?.students
                  ?.map((student) => student.firstName)
                  .join(', ')}
              </p>
              <p>
                <strong>Available slots:</strong>{' '}
                {session?.classroom.capacity - session?.students.length}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {isStudentBooked() ? (
              <button
                onClick={handleUnbook}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Unbook
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Book
              </button>
            )}
            <button
              onClick={onClose}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
