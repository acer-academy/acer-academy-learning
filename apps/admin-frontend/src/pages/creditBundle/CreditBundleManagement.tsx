import React, { useState, useEffect } from 'react';
import { getAllCreditBundles } from '@acer-academy-learning/data-access';
import { CreditBundleData } from 'libs/data-access/src/lib/types/creditBundle';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './CreditBundleManagement.css'; // Import your CSS file
import CreditBundleModal from './CreditBundleModal';
import { ColDef } from 'ag-grid-community';

const CreditBundleManagement = () => {
  const [creditBundles, setCreditBundles] = useState<CreditBundleData[]>([]);
  const [selectedCreditBundle, setSelectedCreditBundle] =
    useState<CreditBundleData | null>(null);

  useEffect(() => {
    const fetchCreditBundles = async () => {
      try {
        const response = await getAllCreditBundles();
        const allCreditBundles: CreditBundleData[] = response.data;
        setCreditBundles(allCreditBundles);
      } catch (error) {
        console.error('Error retrieving credit bundles:', error);
      }
    };

    fetchCreditBundles();
  }, []);

  const onRowClicked = (params: any) => {
    setSelectedCreditBundle(params.data);
  };

  const columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', minWidth: 250 },
    { headerName: 'Name', field: 'name', minWidth: 250 },
    {
      headerName: 'Description',
      field: 'description',
      valueFormatter: (params) => {
        const description = params.value;
        return description?.trim() || '-';
      },
      minWidth: 250,
    },
    {
      headerName: 'Number of Credits',
      field: 'numCredits',
      minWidth: 150,
    },
    { headerName: 'Base Price', field: 'basePrice', minWidth: 150 },
    {
      headerName: 'Status',
      field: 'isActive',
      minWidth: 150,
      cellRenderer: (params: any) => {
        const isActive = params.value;
        let className =
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium';
        let text = '';

        switch (isActive) {
          case true:
            className += ' bg-green-100 text-green-700';
            text = 'ACTIVE';
            break;
          case false:
            className += ' bg-red-100 text-red-700';
            text = 'INACTIVE';
            break;
          default:
            className += ' bg-gray-100 text-gray-700';
            text = 'ERROR';
        }

        return <span className={className}>{text}</span>;
      },
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { borderRight: '1px solid #e0e0e0' }, // Add right border to each cell
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tight">
            Credit Bundles
          </span>
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-adminGreen-600 border border-transparent rounded-md hover:bg-adminGreen-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adminGreen-500"
            onClick={() => {
              // setIsCreateModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4 fill-white stroke-2 relative mt-0.5"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            Add Credit Bundle
          </button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ height: '500px', width: '100%' }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={creditBundles}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            animateRows={true}
            onRowClicked={onRowClicked}
          />
          {selectedCreditBundle && (
            <CreditBundleModal
              creditBundle={selectedCreditBundle}
              onClose={() => setSelectedCreditBundle(null)}
            />
          )}
        </div>
      </div>
      {/* {isDeleteModalOpen && (
        <FaqTopicDeleteModal
          setIsModalOpen={setIsDeleteModalOpen}
          deleteFaqTopic={deleteFaqTopic}
        />
      )}
      {isCreateModalOpen && (
        <FaqTopicCreateModal
          setIsModalOpen={setIsCreateModalOpen}
          currentFaqTopics={faqTopics}
          createFaqTopic={createFaqTopic}
        />
      )} */}
    </div>
  );
  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '80%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={creditBundles}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        animateRows={true}
        onRowClicked={onRowClicked}
      />
      {selectedCreditBundle && (
        <CreditBundleModal
          creditBundle={selectedCreditBundle}
          onClose={() => setSelectedCreditBundle(null)}
        />
      )}
    </div>
  );
};

export default CreditBundleManagement;
