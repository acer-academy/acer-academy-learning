import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getTransactionsByStudentId } from '@acer-academy-learning/data-access';
import { TransactionData } from 'libs/data-access/src/lib/types/transaction';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './TransactionManagement.css'; // Import your CSS file
import TransactionModal from './TransactionModal';
import TransactionTypeBadge from './TransactionTypeBadge';
import {
  RowClickedEvent,
  ValueFormatterParams,
  ValueGetterParams,
  Column,
  ColumnResizedEvent,
} from 'ag-grid-community';
import { convertIntToFloat } from '@acer-academy-learning/data-access';

import { useAuth } from '@acer-academy-learning/common-ui';
import { Student } from '@prisma/client';
import CreditsBar from '../../components/CreditsBar';
import ReceiptUrlButton from './ReceiptUrlButton';

const dateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    // Convert filter date to the start of the day in ISO format
    const startOfDay = new Date(filterLocalDateAtMidnight).toISOString();

    // Convert filter date to the end of the day in ISO format
    const endOfDay = new Date(
      filterLocalDateAtMidnight.getFullYear(),
      filterLocalDateAtMidnight.getMonth(),
      filterLocalDateAtMidnight.getDate(),
      23,
      59,
      59,
      999,
    ).toISOString();

    // Compare the cell value with the start and end dates
    if (cellValue >= startOfDay && cellValue <= endOfDay) {
      return 0;
    }
    if (cellValue < startOfDay) {
      return -1;
    }
    if (cellValue > endOfDay) {
      return 1;
    }
    return 0;
  },
};

//----Component

const TransactionManagement = () => {
  const { user: authUser } = useAuth<Student>();

  // Initialize State
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactionsByStudentId(authUser?.id);
      const allTransactions: TransactionData[] = response.data;
      console.log(allTransactions);
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  // Use Effect Hook
  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRowClicked = (params: RowClickedEvent) => {
    setSelectedTransaction(params.data);
  };

  const [pageSize, setPageSize] = useState(15); // Default page size

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const gridRef = useRef<AgGridReact | null>(null);

  const autoSizeAll = useCallback((skipHeader: boolean) => {
    const allColumnIds: string[] = [];
    if (gridRef.current) {
      const columns = gridRef.current.columnApi.getColumns();
      if (columns) {
        columns.forEach((column: Column) => {
          allColumnIds.push(column.getId());
        });
        gridRef.current.columnApi.autoSizeColumns(allColumnIds, skipHeader);
      }
    }
  }, []);

  const onColumnResized = useCallback((params: ColumnResizedEvent) => {
    console.log(params);
  }, []);

  // Set up ag-Grid
  const columnDefs = [
    {
      headerName: 'Date',
      field: 'dateTime',
      sort: 'desc',
      valueFormatter: (params: ValueFormatterParams) => {
        const date = new Date(params.value); // Assuming the dateTime is in ISO format
        // return date.toLocaleString(); // Convert date to a localized string
        return date.toLocaleDateString();
      },
      filter: 'agDateColumnFilter',
      filterParams: dateFilterParams,
      suppressMenu: true,
    },
    {
      headerName: 'Transaction ID',
      field: 'id',
      suppressMenu: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Amount',
      field: 'amount',
      valueGetter: (params: ValueGetterParams) => {
        if (params.data.amount === null || params.data.amount === undefined) {
          return '—';
        }
        return `$${convertIntToFloat(params.data.amount)}`;
      },
      width: 120,
    },
    // {
    //   headerName: 'Currency',
    //   field: 'currency',
    // },
    {
      headerName: 'Credits Transacted',
      field: 'creditsTransacted',
      valueGetter: (params: ValueGetterParams) => {
        // If transactionType is 'DEDUCTED', prepend a '-'
        return params.data.transactionType === 'DEDUCTED'
          ? `-${params.data.creditsTransacted}`
          : `+${params.data.creditsTransacted}`;
      },
    },
    {
      headerName: 'Transaction Type',
      field: 'transactionType',
      cellRenderer: TransactionTypeBadge,
    },
    { headerName: 'Reference ID', field: 'referenceId' },
    { headerName: 'Reason', field: 'reason' },
    {
      headerName: 'Term',
      field: 'term',
      valueGetter: (params: ValueGetterParams) => {
        // Assuming the student object is in params.data.student
        const term = params.data.term;
        return term.name;
      },
    },
    {
      headerName: 'Receipt',
      field: 'stripeTransaction.receiptUrl',
      cellRenderer: ReceiptUrlButton,
    },

    // { headerName: 'Promotion ID', field: 'promotionId' },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    cellStyle: { borderRight: '1px solid #e0e0e0' }, // Add right border to each cell
  };

  return (
    <div>
      <CreditsBar />
      <h3 className="text-base font-semibold leading-7 text-black mb-4">
        Transactions
      </h3>
      <div className="flex justify-between mb-3">
        <button
          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => autoSizeAll(false)}
        >
          Auto-Size All
        </button>

        <div className="flex items-center">
          <span>Show </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md shadow-sm px-25 py-1 ml-2 mr-2"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>rows per page</span>
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: '500px', width: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={transactions}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          animateRows={true}
          onRowClicked={onRowClicked}
          pagination={true}
          paginationPageSize={pageSize}
          onColumnResized={onColumnResized}
        />

        {selectedTransaction && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onRefunded={fetchTransactions} // Passing the fetchTransactions function as a prop
          />
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
