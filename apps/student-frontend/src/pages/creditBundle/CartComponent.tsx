import { Fragment, useState } from 'react';
import { CreditBundleCartItem } from 'libs/data-access/src/lib/types/creditBundle';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CartComponent({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onChangeQuantity,
}: {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CreditBundleCartItem[];
  onRemove: (bundleId: string) => void;
  onChangeQuantity: (bundleId: string, newQuantity: number) => void;
}) {
  const [promoCode, setPromoCode] = useState('');

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.basePrice * item.quantity,
    0,
  );

  const totalCredits = cartItems.reduce(
    (acc, item) => acc + item.numCredits * item.quantity,
    0,
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cartItems.map((bundle) => (
                              <li key={bundle.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={
                                      bundle.imageSrc ||
                                      'default-image-path.jpg'
                                    }
                                    alt={bundle.description || bundle.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{bundle.name}</h3>
                                      <p className="ml-4">
                                        $
                                        {(
                                          bundle.basePrice * bundle.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {bundle.description}
                                    </p>
                                  </div>

                                  <p className="text-sm text-gray-400">
                                    Price: ${bundle.basePrice.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    Credits: {bundle.numCredits}
                                  </p>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center text-gray-500">
                                      <p>Qty</p>
                                      <select
                                        id={`quantity-${bundle.id}`}
                                        name={`quantity-${bundle.id}`}
                                        value={bundle.quantity}
                                        onChange={(e) =>
                                          onChangeQuantity(
                                            bundle.id,
                                            parseInt(e.target.value),
                                          )
                                        }
                                        className="ml-2 block max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                      >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                      </select>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => onRemove(bundle.id)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      {/* Total Credits */}
                      <div className="border-t border-gray-200 px-4 py-1 sm:px-6 bg-gray-100">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Total Credits</p>
                          <p>{totalCredits}</p>
                        </div>
                      </div>

                      {/* PromoCode */}
                      <div className="border-t border-gray-200 pt-4 pb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Apply Promo Code
                        </h3>
                        <div className="mt-2 flex">
                          <input
                            type="text"
                            name="promo-code"
                            id="promo-code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 flex-grow sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter your code"
                          />
                          <button
                            type="button"
                            className="ml-3 bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex items-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                              // Handle promo code application logic here
                              console.log('Promo code applied:', promoCode);
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="pt-4 pb-2">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                      </div>

                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={onClose}
                          >
                            Continue Shopping{' '}
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
