import {
  CreditBundleData,
  CreditBundleCartItem,
} from 'libs/data-access/src/lib/types/creditBundle';
import { useEffect, useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { getAllCreditBundles as apiGetAllCreditBundles } from '@acer-academy-learning/data-access';
import CartComponent from './CartComponent';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import CreditsBar from '../../components/CreditsBar';
import { convertIntToFloat } from '@acer-academy-learning/data-access';

export const CreditBundleManagement: React.FC = () => {
  //Cart
  const [cart, setCart] = useState<CreditBundleCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const addToCart = (creditBundle: CreditBundleData) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === creditBundle.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === creditBundle.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...creditBundle, quantity: 1 }];
    });
  };

  const removeFromCart = (bundleId: string) => {
    setCart((prevCart) => prevCart.filter((bundle) => bundle.id !== bundleId));
  };

  const changeQuantity = (bundleId: string, newQuantity: number) => {
    setCart((prevCart) => {
      return prevCart.map((bundle) => {
        if (bundle.id === bundleId) {
          return { ...bundle, quantity: newQuantity };
        }
        return bundle;
      });
    });
  };

  //CreditBundle

  const [creditBundles, setCreditBundles] = useState<CreditBundleData[]>([]);
  const [searchbarText, setSearchbarText] = useState('');
  useState<CreditBundleData>({
    id: '',
    name: '',
    description: '',
    numCredits: 1,
    basePrice: 1,
    isActive: true,
  });

  const { displayToast, ToastType } = useToast();

  const getAllCreditBundles = async () => {
    try {
      const response = await apiGetAllCreditBundles();
      const allCreditBundles: CreditBundleData[] = response.data;
      // Filtering allCreditBundles to only include items where isActive is true
      const activeCreditBundles: CreditBundleData[] = allCreditBundles.filter(
        (bundle) => bundle.isActive,
      );

      setCreditBundles(activeCreditBundles);
    } catch (error) {
      displayToast(
        'Credit bundles could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCreditBundles();
  }, []);

  return (
    <div className="h-full bg-gray-50">
      <CreditsBar />
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="creditBundle-searchbar"
            id="creditBundle-searchbar"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-adminGreen-600 sm:text-sm sm:leading-6"
            placeholder="Search for a credit bundle..."
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
          <span className="text-2xl font-bold tracking-tight">
            Credit Bundles
          </span>
          <div className="relative group -m-2 flex items-center p-2">
            <ShoppingCartIcon
              className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
              onClick={toggleCart}
            />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </div>
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {creditBundles.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3.5 py-3.5 text-left text-sm font-semibold text-gray-900 image-column max-w-xs"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Number of Credits
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Base Price
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm"
                        >
                          Price Per Credit
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {creditBundles
                        .filter(
                          (creditBundle) =>
                            creditBundle.name
                              .toLowerCase()
                              .includes(searchbarText.toLowerCase()) ||
                            creditBundle.description
                              ?.toLowerCase()
                              .includes(searchbarText.toLowerCase()),
                        )
                        .map((creditBundle) => (
                          <tr key={creditBundle.id}>
                            <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                              {creditBundle.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 image-column max-w-xs">
                              {creditBundle.description}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {creditBundle.numCredits}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {'$' + convertIntToFloat(creditBundle.basePrice)}
                            </td>
                            <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-sm">
                              {'$' +
                                convertIntToFloat(
                                  creditBundle.basePrice /
                                    creditBundle.numCredits,
                                )}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                              <a
                                className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                                onClick={() => addToCart(creditBundle)}
                              >
                                Add To Cart
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No credit bundles have been created yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartComponent
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
        onChangeQuantity={changeQuantity}
      />
    </div>
  );
};
