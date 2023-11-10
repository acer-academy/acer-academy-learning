import { useToast } from '@acer-academy-learning/common-ui';
import {
  CentreData,
  CentreUpdateData,
} from 'libs/data-access/src/lib/types/centre';
import { ClassroomData } from 'libs/data-access/src/lib/types/classroom';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import {
  getCentreById,
  updateCentre as apiUpdateCentre,
  deleteCentre as apiDeleteCentre,
  getClassroomsByCentre as apiGetClassroomsByCentre,
  deleteClassroom as apiDeleteClassroom,
} from '@acer-academy-learning/data-access';
import { ClassroomCreateModal } from './ClassroomCreateModal';

export const CentreDetails: React.FC = () => {
  const [centre, setCentre] = useState<CentreData>();
  const { centreId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatedCentreName, setUpdatedCentreName] = useState('');
  const [updatedCentreAddress, setUpdatedCentreAddress] = useState('');
  const [isEditingCentreName, setIsEditingCentreName] = useState(false);
  const [isEditingCentreAddress, setIsEditingCentreAddress] = useState(false);
  const [updatesMade, setUpdatesMade] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeletingClassroom, setIsDeletingClassroom] = useState(false);
  const [deleteClassroomId, setDeleteClassroomId] = useState('');
  const [isEditingClassroom, setIsEditingClassroom] = useState(false);
  const [editClassroomData, setEditClassroomData] = useState<ClassroomData>();

  const { displayToast, ToastType } = useToast();
  const navigate = useNavigate();

  const wereUpdatesMade = () => {
    if (
      centre?.name.trim() != updatedCentreName.trim() ||
      centre?.address.trim() != updatedCentreAddress.trim()
    ) {
      setUpdatesMade(true);
    }
  };

  const getCurrentCentre = async (id: string) => {
    try {
      const response = await getCentreById(id);
      const centreData: CentreData = response.data;
      setCentre(centreData);
      setUpdatedCentreName(centreData.name);
      setUpdatedCentreAddress(centreData.address);
    } catch (error) {
      displayToast(
        'Centre could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const getCentreClassrooms = async (id: string) => {
    try {
      const response = await apiGetClassroomsByCentre(id);
      const classroomsData: ClassroomData[] = response.data;
      setClassrooms(classroomsData);
    } catch (error) {
      displayToast(
        'Classrooms could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const updateCentre = async (
    centreId: string,
    centreData: CentreUpdateData,
  ) => {
    try {
      const response = await apiUpdateCentre(centreId, centreData);
      const updatedCentre: CentreData = response.data;
      displayToast('Centre updated successfully.', ToastType.SUCCESS);
      setCentre(updatedCentre);
    } catch (error: any) {
      setUpdatedCentreName(centre?.name || '');
      setUpdatedCentreAddress(centre?.address || '');
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Centre could not be updated: Unknown error.',
          ToastType.ERROR,
        );
      }
    } finally {
      setUpdatesMade(false);
    }
  };

  const deleteCentre = async () => {
    if (!centreId) return;
    try {
      const response = await apiDeleteCentre(centreId);
      displayToast('Centre deleted successfully.', ToastType.INFO);
      navigate('/centre-management');
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Centre could not be deleted: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const deleteClassroom = async () => {
    if (!(deleteClassroomId as string)) return;
    try {
      const response = await apiDeleteClassroom(deleteClassroomId);
      displayToast('Classroom deleted successfully.', ToastType.INFO);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Centre could not be deleted: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsDeletingClassroom(false);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    if (centreId) getCentreClassrooms(centreId);
  }, [centre, isCreateModalOpen, isDeleteModalOpen]);

  useEffect(() => {
    if (centreId) getCurrentCentre(centreId);
  }, []);

  useEffect(() => {
    if (updatesMade && centreId) {
      const centreUpdateData: CentreUpdateData = {
        name: updatedCentreName,
        address: updatedCentreAddress,
      };
      updateCentre(centreId, centreUpdateData);
    }
  }, [updatesMade]);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <a
          className="hover:text-admin-primary-700 underline"
          href="centre-management"
        >{`< Back`}</a>
        {centre && (
          <div className="inline-flex justify-between">
            <span className="text-2xl font-bold tracking-tight">
              Centre: {centre.name}
            </span>
            <button
              className="inline-flex h-min justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
        <div className="grid grid-cols-4 gap-7 text-m">
          <div className="flex items-center col-span-1 font-semibold">
            Centre name
          </div>
          {isEditingCentreName ? (
            <input
              name="updatedCentreName"
              className="flex items-center col-span-1 border-0 rounded bg-transparent ring-1 ring-inset focus:ring-2 focus:ring-inset ring-gray-300 text-gray-900 focus:ring-admin-primary-900"
              placeholder="Acer Academy"
              value={updatedCentreName}
              onChange={(e) => {
                setUpdatedCentreName(e.target.value);
              }}
            ></input>
          ) : (
            <div className="col-span-1 h-10 flex items-center pl-3">
              {centre?.name}
            </div>
          )}
          <div className="flex items-center col-span-2">
            {isEditingCentreName ? (
              <button
                onClick={() => {
                  setIsEditingCentreName(false);
                  wereUpdatesMade();
                }}
                className="text-admin-primary-700 hover:underline"
              >
                Update
              </button>
            ) : (
              <button
                disabled={isEditingCentreAddress}
                onClick={() => setIsEditingCentreName(true)}
                className={
                  !isEditingCentreAddress
                    ? 'hover:text-admin-primary-700 underline'
                    : 'text-gray-400'
                }
              >
                Edit
              </button>
            )}
          </div>
          <div className="flex items-center col-span-1 font-semibold">
            Centre address
          </div>
          {isEditingCentreAddress ? (
            <input
              name="updatedCentreAddress"
              className="flex items-center col-span-1 border-0 rounded bg-transparent ring-1 ring-inset focus:ring-2 focus:ring-inset ring-gray-300 text-gray-900 focus:ring-admin-primary-900"
              placeholder="18 Yishun Ave 9 #01-36"
              value={updatedCentreAddress}
              onChange={(e) => {
                setUpdatedCentreAddress(e.target.value);
              }}
            ></input>
          ) : (
            <div className="col-span-1 h-10 flex items-center pl-3">
              {centre?.address}
            </div>
          )}
          <div className="flex items-center col-span-2">
            {isEditingCentreAddress ? (
              <button
                onClick={() => {
                  setIsEditingCentreAddress(false);
                  wereUpdatesMade();
                }}
                className="text-admin-primary-700 hover:underline"
              >
                Update
              </button>
            ) : (
              <button
                disabled={isEditingCentreName}
                onClick={() => setIsEditingCentreAddress(true)}
                className={
                  !isEditingCentreName
                    ? 'hover:text-admin-primary-700 underline'
                    : 'text-gray-400'
                }
              >
                Edit
              </button>
            )}
          </div>
        </div>
        <div className="inline-flex justify-end">
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-admin-primary-700 border border-transparent rounded-md hover:bg-admin-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-900"
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-0.5"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add Classroom
          </button>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-lg font-bold text-gray-900 sm:pl-6"
                      >
                        Classroom Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Capacity
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Available
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-lg font-bold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {classrooms.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="whitespace-nowrap py-4 px-4 font-light italic text-gray-400 text-center"
                        >
                          No classrooms have been added yet.
                        </td>
                      </tr>
                    ) : (
                      classrooms
                        .sort((c1: ClassroomData, c2: ClassroomData) =>
                          c1.name.localeCompare(c2.name),
                        )
                        .map((classroom) => (
                          <tr key={classroom.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-m font-medium text-gray-900 sm:pl-6">
                              {classroom.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-m text-gray-500">
                              {classroom.capacity}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-m text-gray-500">
                              {classroom.available ? 'Yes' : 'No'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-m text-gray-500">
                              <div className="flex gap-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 fill-gray-400 stroke-2 hover:fill-black cursor-pointer"
                                  viewBox="0 0 16 16"
                                  onClick={() => {
                                    setIsEditingClassroom(true);
                                    setEditClassroomData(classroom);
                                    setIsCreateModalOpen(true);
                                  }}
                                >
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                  <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 fill-gray-400 stroke-2 hover:fill-black cursor-pointer"
                                  viewBox="0 0 16 16"
                                  onClick={() => {
                                    setIsDeletingClassroom(true);
                                    setDeleteClassroomId(classroom.id);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                                </svg>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && centreId && !isDeletingClassroom && (
        <DeleteConfirmationModal
          modalTitle="Delete centre"
          modalMessage="Are you sure you want to delete this centre? This action
      cannot be undone."
          setIsModalOpen={setIsDeleteModalOpen}
          deleteCallback={deleteCentre}
        />
      )}
      {isDeleteModalOpen && isDeletingClassroom && (
        <DeleteConfirmationModal
          modalTitle="Delete classroom"
          modalMessage="Are you sure you want to delete this classroom? This action
      cannot be undone."
          setIsModalOpen={setIsDeleteModalOpen}
          deleteCallback={deleteClassroom}
          cancelCallback={() => {
            setIsDeletingClassroom(false);
          }}
        />
      )}
      {isCreateModalOpen && !isEditingClassroom && (
        <ClassroomCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          centreId={centreId || ''}
        />
      )}
      {isCreateModalOpen && isEditingClassroom && (
        <ClassroomCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          centreId={centreId || ''}
          isEdit={true}
          editClassroomData={editClassroomData}
          callback={() => {
            setIsEditingClassroom(false);
          }}
        />
      )}
    </div>
  );
};
