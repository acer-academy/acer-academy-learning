import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '@acer-academy-learning/data-access';
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
} from 'ag-grid-community';

const TransactionsComponent = () => {
  // Initialize State
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);

  // Use Effect Hook
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getAllTransactions();
        const allTransactions: TransactionData[] = response.data;
        console.log(allTransactions);
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error retrieving transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const onRowClicked = (params: RowClickedEvent) => {
    setSelectedTransaction(params.data);
  };

  // Set up ag-Grid
  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    {
      headerName: 'Amount',
      field: 'amount',
      valueGetter: (params: ValueGetterParams) => {
        // If transactionType is 'DEDUCTED', prepend a '-'
        return `$ ${params.data.amount}`;
      },
    },
    // {
    //   headerName: 'Currency',
    //   field: 'currency',
    // },
    {
      headerName: 'Date Time',
      field: 'dateTime',
      valueFormatter: (params: ValueFormatterParams) => {
        const date = new Date(params.value); // Assuming the dateTime is in ISO format
        return date.toLocaleString(); // Convert date to a localized string
      },
    },
    {
      headerName: 'Credits Transacted',
      field: 'creditsTransacted',
      valueGetter: (params: ValueGetterParams) => {
        // If transactionType is 'DEDUCTED', prepend a '-'
        return params.data.transactionType === 'DEDUCTED'
          ? `- ${params.data.creditsTransacted}`
          : `+ ${params.data.creditsTransacted}`;
      },
    },
    {
      headerName: 'Transaction Type',
      field: 'transactionType',
      cellRenderer: TransactionTypeBadge,
    },
    { headerName: 'Reason', field: 'reason' },
    { headerName: 'Term ID', field: 'termId' },
    { headerName: 'Student ID', field: 'studentId' },
    { headerName: 'Promotion ID', field: 'promotionId' },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { borderRight: '1px solid #e0e0e0' }, // Add right border to each cell
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={transactions}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        animateRows={true}
        onRowClicked={onRowClicked}
      />
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionsComponent;
