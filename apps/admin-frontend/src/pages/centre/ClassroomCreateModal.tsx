import { useToast } from '@acer-academy-learning/common-ui';
import {
  createClassroom as apiCreateClassroom,
  updateClassroom as apiUpdateClassroom,
} from '@acer-academy-learning/data-access';
import {
  ClassroomCreateData,
  ClassroomData,
} from 'libs/data-access/src/lib/types/classroom';
import { Fragment, useEffect, useState } from 'react';

interface ClassroomCreateModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  centreId: string;
  isEdit?: boolean;
  editClassroomData?: ClassroomData;
  callback?: () => void;
}

export const ClassroomCreateModal: React.FC<ClassroomCreateModalProps> = ({
  setIsModalOpen,
  centreId,
  isEdit,
  editClassroomData,
  callback,
}) => {
  const [classroomData, setClassroomData] = useState<ClassroomCreateData>({
    name: '',
    available: true,
    capacity: 1,
    centreId: centreId,
  });
  const [invalidNameSubmitted, setInvalidNameSubmitted] = useState(false);
  const [editClassroomId, setEditClassroomId] = useState('');

  const { displayToast, ToastType } = useToast();

  useEffect(() => {
    if (isEdit && editClassroomData) {
      setEditClassroomId(editClassroomData.id);
      const classroomUpdateData: ClassroomCreateData = {
        name: editClassroomData.name,
        available: editClassroomData.available,
        capacity: editClassroomData.capacity,
        centreId: editClassroomData.centreId,
      };
      setClassroomData(classroomUpdateData);
    }
  }, []);

  useEffect(() => {
    setInvalidNameSubmitted(false);
  }, [classroomData]);

  const handleCreateOrEdit = async () => {
    if (classroomData.name.length < 5) {
      setInvalidNameSubmitted(true);
      return;
    }
    try {
      if (isEdit) {
        await apiUpdateClassroom(editClassroomId, {
          ...classroomData,
          name: classroomData.name.trim(),
        });
      } else {
        await apiCreateClassroom(classroomData);
      }
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          isEdit
            ? 'Classroom could not be created: Unknown error.'
            : 'Classroom could not be modified: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      if (callback) callback();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <Fragment>
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white p-5 rounded-lg shadow-md h-42 w-96">
            <div className="flex flex-col items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {!isEdit ? 'Create classroom' : 'Edit classroom'}
              </h3>
              <div className="w-full mt-3 mb-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Classroom name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ${
                      invalidNameSubmitted
                        ? 'ring-red-300 text-red-900 focus:ring-red-500'
                        : 'ring-gray-300 text-gray-900 focus:ring-adminGreen-500'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    placeholder="Classroom 1"
                    value={classroomData.name}
                    onChange={(e) => {
                      setClassroomData({
                        name: e.target.value,
                        capacity: classroomData.capacity,
                        available: classroomData.available,
                        centreId: classroomData.centreId,
                      });
                    }}
                    aria-invalid={true}
                    aria-describedby="name-error"
                  />
                </div>
                {invalidNameSubmitted && (
                  <p
                    className="absolute b-0 text-sm text-red-600"
                    id="name-error"
                  >
                    Classroom name cannot be less than 5 characters
                  </p>
                )}
              </div>
              <div className="w-full mb-5">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Classroom capacity
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    min="1"
                    name="capacity"
                    id="capacity"
                    className={`block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                    value={classroomData.capacity}
                    onChange={(e) => {
                      setClassroomData({
                        name: classroomData.name,
                        capacity: e.target.value
                          ? Number.parseInt(e.target.value)
                          : 0,
                        available: classroomData.available,
                        centreId: classroomData.centreId,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center mb-5 w-full">
                <div className="flex items-center">
                  <input
                    id="available-checkbox"
                    name="available-checkbox"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-adminGreen-600 focus:ring-adminGreen-600"
                    checked={classroomData.available}
                    onChange={(e) => {
                      setClassroomData({
                        name: classroomData.name,
                        capacity: classroomData.capacity,
                        available: e.target.checked,
                        centreId: classroomData.centreId,
                      });
                    }}
                  />
                  <label
                    htmlFor="available-checkbox"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Classroom available
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={() => {
                  if (callback) callback();
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                disabled={classroomData.name.length == 0}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none
                  ${
                    classroomData.name.length == 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-adminGreen-600 hover:bg-adminGreen-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adminGreen-500'
                  }`}
                onClick={() => {
                  handleCreateOrEdit();
                }}
              >
                {!isEdit ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
};
