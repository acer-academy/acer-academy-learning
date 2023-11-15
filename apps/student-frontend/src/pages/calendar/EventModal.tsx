import React from 'react';
import moment from 'moment';
import { on } from 'events';
import { bookSession } from '@acer-academy-learning/data-access';

interface EventModalProps {
  onClose: () => void;
  studentId: string;
  event: any;
}

export const EventModal: React.FC<EventModalProps> = ({ onClose, event, studentId }) => {

  async function handleSubmit() {


    try {
      const response = await bookSession(event.id, studentId)
      if (response) {
        console.log("success")
        // onClose();
        // await fetchSessions();
        // displayToast('Session created successfully!', ToastType.SUCCESS);
      }
    } catch (err) {
      console.log("error")
      // onClose();
      // displayToast(`${err.response.data.error}`, ToastType.ERROR);
    }

    // console.log(studentId, event.id)
    // await bookSession(event.id, studentId)
  }

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
                {moment(event?.start).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {moment(event?.end).format('MMMM Do YYYY, h:mm:ss a')}
              </p>
              <p>
                <strong>Teacher:</strong> {event?.teacher?.firstName}{' '}
                {event?.data?.session?.teacher?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {event?.teacher?.email}
              </p>
              <p>
                <strong>Students:</strong> {event?.students?.map((student) => student.firstName).join(', ')}
              </p>
              <p>
                <strong>Levels:</strong> {event?.levels?.join(', ')}
              </p>
              <p>
                <strong>Subjects:</strong> {event?.subjects?.join(', ')}
              </p>
              <p>
                <strong>Centre:</strong> {event?.classroom?.centre?.name}
              </p>
              <p>
                <strong>Classroom:</strong> {event?.classroom?.name}
              </p>
           
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
              onClick={handleSubmit}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Book
            </button>
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
