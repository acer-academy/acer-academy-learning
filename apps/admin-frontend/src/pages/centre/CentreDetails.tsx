import { useToast } from '@acer-academy-learning/common-ui';
import {
  CentreData,
  CentreUpdateData,
} from 'libs/data-access/src/lib/types/centre';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CentreDeleteModal } from './CentreDeleteModal';
import {
  getCentreById,
  updateCentre as apiUpdateCentre,
  deleteCentre as apiDeleteCentre,
} from '@acer-academy-learning/data-access';

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
      console.log(centreData);
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
      const response = await api.classrooms.getClassroomsByCentre(id);
      const classroomsData: ClassroomData[] = response.data;
      console.log(classroomsData);
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
      console.log(updatedCentre);
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
      console.log(response);
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

  useEffect(() => {
    if (centreId) getCentreClassrooms(centreId);
  }, [centre]);

  useEffect(() => {
    if (centreId) getCurrentCentre(centreId);
  }, []);

  useEffect(() => {
    if (updatesMade && centreId) {
      const centreUpdateData: CentreUpdateData = {
        name: updatedCentreName,
        address: updatedCentreAddress,
      };
      console.log(centreUpdateData);
      updateCentre(centreId, centreUpdateData);
    }
  }, [updatesMade]);

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <a
          className="hover:text-adminGreen-600 underline"
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
              className="flex items-center col-span-1 border-0 rounded bg-transparent ring-1 ring-inset focus:ring-2 focus:ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500"
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
                className="text-adminGreen-600 hover:underline"
              >
                Update
              </button>
            ) : (
              <button
                disabled={isEditingCentreAddress}
                onClick={() => setIsEditingCentreName(true)}
                className={
                  !isEditingCentreAddress
                    ? 'hover:text-adminGreen-600 underline'
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
              className="flex items-center col-span-1 border-0 rounded bg-transparent ring-1 ring-inset focus:ring-2 focus:ring-inset ring-gray-300 text-gray-900 focus:ring-adminGreen-500"
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
                className="text-adminGreen-600 hover:underline"
              >
                Update
              </button>
            ) : (
              <button
                disabled={isEditingCentreName}
                onClick={() => setIsEditingCentreAddress(true)}
                className={
                  !isEditingCentreName
                    ? 'hover:text-adminGreen-600 underline'
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
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-adminGreen-600 border border-transparent rounded-md hover:bg-adminGreen-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adminGreen-500"
            onClick={() => {
              //setIsCreateModalOpen(true);
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
                  <thead className="bg-gray-50">
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
                      classrooms.map((classroom) => (
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
                            Actions
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
      {isDeleteModalOpen && centreId && (
        <CentreDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteCentre={deleteCentre}
        />
      )}
    </div>
  );
};
