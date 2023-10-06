import React, { useState } from 'react';
import visaLogo from '../../assets/Visa_Inc._logo.svg.png';
import mastercardLogo from '../../assets/MasterCard_Logo.svg.png';
import { CreditBundleCartItem } from 'libs/data-access/src/lib/types/creditBundle';
import { createTransaction } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CreditBundleCartItem[];
  transactionState: any;
};

const logos = {
  visa: visaLogo,
  mastercard: mastercardLogo,
};

type Errors = {
  cardNumber?: string;
  cardHolder?: string;
  month?: string;
  year?: string;
  cvv?: string;
};

const CreditCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  transactionState,
}) => {
  const { displayToast, ToastType } = useToast();
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | null>(null);
  const [errors, setErrors] = useState<Errors>({
    cardNumber: '',
    cardHolder: '',
    month: '',
    year: '',
    cvv: '',
  });

  //   console.log(cartItems);
  console.log(transactionState);

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setCardHolder(value);
    }
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardHolder: 'Name must only contain alphabets',
      }));
    } else {
      setErrors((prevErrors) => {
        const { cardHolder, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value) || value === '') {
      setCardNumber(value);
    }

    if (!/^[0-9]*$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardNumber: 'Card Number must be numeric',
      }));
    } else {
      setErrors((prevErrors) => {
        const { cardNumber, ...rest } = prevErrors;
        return rest;
      });
    }

    if (value.startsWith('4')) {
      setCardType('visa');
    } else if (value.startsWith('5')) {
      setCardType('mastercard');
    } else {
      setCardType(null);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value) || value === '') {
      setMonth(value);
    }

    if (!/^[0-9]*$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        month: 'Month must be numeric',
      }));
    } else {
      setErrors((prevErrors) => {
        const { month, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value) || value === '') {
      setYear(value);
    }

    if (!/^[0-9]*$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        year: 'Year must be numeric',
      }));
    } else {
      setErrors((prevErrors) => {
        const { year, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value) || value === '') {
      setCvv(value);
    }

    if (!/^[0-9]*$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cvv: 'CVV must be numeric',
      }));
    } else {
      setErrors((prevErrors) => {
        const { cvv, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createTransaction(transactionState);

      displayToast('Paid successfully.', ToastType.SUCCESS);
    } catch (error: any) {
      if (error.response) {
        displayToast(`${error.response.data.error}`, ToastType.ERROR);
      } else {
        displayToast('Unknown error.', ToastType.ERROR);
      }
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl relative w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          X
        </button>
        <h2 className="text-2xl mb-4">Enter Credit Card Details</h2>
        {cardType && (
          <img
            src={logos[cardType]}
            alt={cardType}
            className="w-12 mt-2 absolute top-6 right-6"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="w-full p-2 border rounded-md"
            maxLength={16}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber}</p>
          )}
          <input
            type="text"
            placeholder="Card Holder"
            value={cardHolder}
            onChange={handleCardHolderChange}
            className="w-full p-2 border rounded-md"
          />
          {errors.cardHolder && (
            <p className="text-red-500 text-sm">{errors.cardHolder}</p>
          )}
          <div className="flex space-x-2 items-start">
            <input
              type="text"
              placeholder="MM"
              value={month}
              onChange={handleMonthChange}
              className="w-20 p-2 border rounded-md"
              maxLength={2}
            />
            <span>/</span>
            <input
              type="text"
              placeholder="YY"
              value={year}
              onChange={handleYearChange}
              className="w-20 p-2 border rounded-md"
              maxLength={2}
            />
            <div className="ml-4">
              {errors.month && (
                <p className="text-red-500 text-sm mb-1">{errors.month}</p>
              )}
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year}</p>
              )}
            </div>
          </div>

          <input
            type="password"
            placeholder="CVV"
            value={cvv}
            onChange={handleCvvChange}
            className="w-1/2 p-2 border rounded-md mt-4"
            maxLength={3}
          />
          {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md"
          >
            Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditCardModal;
