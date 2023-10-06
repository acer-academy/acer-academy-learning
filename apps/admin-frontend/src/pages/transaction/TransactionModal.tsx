import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { TransactionData } from 'libs/data-access/src/lib/types/transaction';
import { TermData } from 'libs/data-access/src/lib/types/term';
import { refundTransaction } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';
import TransactionTypeBadge from './TransactionTypeBadge';
import {
  convertIntToFloat,
  getCurrentTerms,
} from '@acer-academy-learning/data-access';
import ReceiptUrlButton from './ReceiptUrlButton';

interface TransactionModalProps {
  transaction: TransactionData | null;
  onClose: () => void;
  onRefunded?: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
  onRefunded,
}) => {
  const { displayToast, ToastType } = useToast();
  const [currentTerm, setCurrentTerm] = useState<TermData>();

  const fetchTerms = async () => {
    try {
      const currentTermsResponse = await getCurrentTerms();
      const currentTerms: TermData[] = currentTermsResponse.data;
      setCurrentTerm(currentTerms[0]);
    } catch (error) {
      displayToast(
        'Terms could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  if (!transaction) return null;

  const handleRefund = async () => {
    try {
      await refundTransaction(transaction.id);
      displayToast(`Refund Successful!`, ToastType.SUCCESS);
      onClose();
      if (typeof onRefunded === 'function') {
        onRefunded();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      displayToast(`Refund Failed: ${error.message}!`, ToastType.ERROR);
    }
  };

  return (
    <Transition.Root show={!!transaction} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Transaction Details
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="flex flex-col gap-y-2 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>Transaction ID:</span>
                          <span>{transaction.id}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Student Name:</span>
                          <span>
                            {transaction.student.firstName}{' '}
                            {transaction.student.lastName}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Student ID:</span>
                          <span>{transaction.student.id}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>
                            {'$' + convertIntToFloat(transaction.amount)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Currency:</span>
                          <span>{transaction.currency}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Date Time:</span>
                          <span>
                            {new Date(transaction.dateTime).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Credits Transacted:</span>
                          <span>
                            {transaction.transactionType === 'DEDUCTED' ||
                            transaction.transactionType === 'STRIPE_DEDUCTED'
                              ? `- ${transaction.creditsTransacted}`
                              : `+ ${transaction.creditsTransacted}`}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Transaction Type:</span>
                          <TransactionTypeBadge
                            value={transaction.transactionType}
                          />
                        </div>

                        <div className="flex justify-between">
                          <span>Reference ID:</span>
                          <span>{transaction.referenceId}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Reason:</span>
                          <span>{transaction.reason}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Term:</span>
                          <span>{transaction.term.name}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Receipt URL:</span>
                          <ReceiptUrlButton
                            value={
                              transaction.stripeTransaction?.receiptUrl ?? ''
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  {!transaction.referenceId &&
                    transaction.transactionType === 'PURCHASED' &&
                    transaction.termId === currentTerm?.id && (
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        onClick={handleRefund}
                      >
                        Refund
                      </button>
                    )}
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TransactionModal;
