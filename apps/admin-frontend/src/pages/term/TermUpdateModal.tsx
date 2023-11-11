import { TermData, TermUpdateData } from 'libs/data-access/src/lib/types/term';
import { Fragment, useState } from 'react';

interface TermUpdateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  updateTerm: (id: string, TermData: TermUpdateData) => void;
  initialTerm: TermData | undefined;
  updateId: string;
}

export const TermUpdateModal: React.FC<TermUpdateModalProps> = ({
  setIsModalOpen,
  updateTerm,
  initialTerm,
  updateId,
}) => {
  const [termData, setTermData] = useState<TermUpdateData>({
    name: initialTerm === undefined ? '' : initialTerm.name,
    startDate:
      initialTerm === undefined ? '' : initialTerm.startDate.toString(),
    endDate: initialTerm === undefined ? '' : initialTerm.endDate.toString(),
  });

  const isDatesInvalid = (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => {
    if (startDate !== undefined && endDate !== undefined) {
      let start = new Date(startDate);
      let end = new Date(endDate);
      return start > end;
    }
  };

  const isTermDataInvalid = () => {
    return (
      termData === undefined ||
      !termData.name ||
      termData.name.trim() === '' ||
      isDatesInvalid(termData.startDate, termData.endDate)
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <Fragment>
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
            <div className="flex flex-col items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Update Term
              </h3>
              <div className="w-full mt-3 mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Term Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-admin-primary-700`}
                    placeholder="AcerAcademy"
                    value={termData.name}
                    onChange={(e) => {
                      setTermData({
                        ...termData,
                        name: e.target.value,
                      });
                    }}
                    aria-invalid={true}
                    aria-describedby="name-error"
                  />
                </div>
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 focus:ring-admin-primary-700`}
                    value={
                      termData.startDate === undefined
                        ? undefined
                        : termData.startDate.substring(0, 10)
                    }
                    onChange={(e) => {
                      setTermData({
                        ...termData,
                        startDate: new Date(e.target.value).toISOString(),
                      });
                    }}
                    aria-invalid="true"
                    aria-describedby="address-error"
                  />
                </div>
              </div>
              <div className="w-full mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      isDatesInvalid(termData.startDate, termData.endDate)
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-admin-primary-700'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    value={
                      termData.endDate === undefined
                        ? undefined
                        : termData.endDate.substring(0, 10)
                    }
                    onChange={(e) => {
                      setTermData({
                        ...termData,
                        endDate: new Date(e.target.value).toISOString(),
                      });
                    }}
                    aria-invalid="true"
                    aria-describedby="address-error"
                  />
                </div>
                {isDatesInvalid(termData.startDate, termData.endDate) && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="address-error"
                  >
                    End Date must be after Start Date
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={isTermDataInvalid()}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                    ${
                      isTermDataInvalid()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-admin-primary-700 hover:bg-admin-primary-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-500'
                    }`}
                onClick={() => updateTerm(updateId, termData)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};
