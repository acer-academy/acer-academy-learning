import {
  CentreCreateData,
  CentreData,
} from 'libs/data-access/src/lib/types/centre';
import { useEffect, useState } from 'react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { CentreCreateModal } from './CentreCreateModal';
import { useToast } from '@acer-academy-learning/common-ui';
import {
  getAllCentres as apiGetAllCentres,
  createCentre as apiCreateCentre,
  deleteCentre as apiDeleteCentre,
} from '@acer-academy-learning/data-access';

export const CentreManagement: React.FC = () => {
  const [centres, setCentres] = useState<CentreData[]>([]);
  const [searchbarText, setSearchbarText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCentreId, setDeleteCentreId] = useState('');

  const { displayToast, ToastType } = useToast();

  const getAllCentres = async () => {
    try {
      const response = await apiGetAllCentres();
      const allCentres: CentreData[] = response.data;
      setCentres(allCentres);
    } catch (error) {
      displayToast(
        'Centres could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  const createCentre = async (centreData: CentreCreateData) => {
    try {
      centreData.name = centreData.name.trim();
      centreData.address = centreData.address.trim();
      await apiCreateCentre(centreData);

      displayToast('Centre created successfully.', ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast(
          'Centre could not be created: Unknown error.',
          ToastType.ERROR,
        );
      }
      console.log(error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  const deleteCentre = async () => {
    try {
      await apiDeleteCentre(deleteCentreId);
      displayToast('Centre deleted successfully.', ToastType.INFO);
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
    getAllCentres();
  }, [isDeleteModalOpen, isCreateModalOpen]);

  return (
    <div className="h-full ">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        {/* <div className="flex justify-center items-center bg-slate-500 min-w-full h-80">
          <span className="text-lg font-bold">MAP HERE</span>
        </div> */}

        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="centre-searchbar"
            id="centre-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-admin-primary-700 sm:text-sm sm:leading-6"
            placeholder="Search for a centre..."
            value={searchbarText}
            onChange={(e) => {
              setSearchbarText(e.target.value);
            }}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 fill-gray-400 stroke-2"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tight">Centres</span>
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-admin-primary-700 border border-transparent rounded-md hover:bg-admin-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-500"
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
            Add Centre
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          {centres?.length > 0 ? (
            centres
              .sort((c1: CentreData, c2: CentreData) =>
                c1.name.localeCompare(c2.name),
              )
              .filter(
                (centre) =>
                  centre.name
                    .toLowerCase()
                    .includes(searchbarText.toLowerCase()) ||
                  centre.address
                    .toLowerCase()
                    .includes(searchbarText.toLowerCase()),
              )
              .map((centre) => (
                <div
                  key={centre.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-admin-primary-700 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="min-w-0 flex-1">
                    <a
                      href={`centre-management/${centre.id}`}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {centre.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {centre.address}
                      </p>
                    </a>
                    <div className="absolute inset-y-3 right-3 flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-gray-400 stroke-2 hover:fill-black cursor-pointer"
                        viewBox="0 0 16 16"
                        onClick={() => {
                          setDeleteCentreId(centre.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <span className="text-sm italic text-gray-500">
              No centres have been added yet.
            </span>
          )}
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          modalTitle="Delete centre"
          modalMessage="Are you sure you want to delete this centre? This action
        cannot be undone."
          setIsModalOpen={setIsDeleteModalOpen}
          deleteCallback={deleteCentre}
        />
      )}
      {isCreateModalOpen && (
        <CentreCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          currentCentres={centres}
          createCentre={createCentre}
        />
      )}
    </div>
  );
};
