import { Fragment } from 'react';
import QRCode from 'react-qr-code';

interface QrModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  sessionId: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  setIsModalOpen,
  sessionId,
}) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <Fragment>
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white p-5 rounded-lg shadow-md h-42">
            <div className="flex flex-col items-start justify-between gap-3">
              <h1 className="text-lg font-bold leading-6 text-gray-900">
                Mark Attendance
              </h1>
              <div className="gap-10 px-3">
                <QRCode
                  size={256}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  value={`http://localhost:3000/attendance/${sessionId}`}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <div className="flex items-center justify-center px-20 py-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex w-full justify-center rounded-md bg-teacher-primary-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teacher-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-secondary-600"
                >
                  Close Qr Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};
