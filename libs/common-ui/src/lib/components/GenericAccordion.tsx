import { Disclosure } from '@headlessui/react';
import { MdArrowRight } from 'react-icons/md';

export type GenericAccordionProps = {
  title: string;
  titleClassName?: string;
  arrowClassName?: string;
  content: React.ReactNode;
  contentClassName?: string;
};

export const GenericAccordion = ({
  title,
  titleClassName,
  arrowClassName,
  content,
  contentClassName,
}: GenericAccordionProps) => {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={`flex items-center w-full ${
              open ? 'rounded-t-lg' : 'rounded-lg'
            } bg-gray-300 px-4 py-2 text-left font-bold text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 text-base border border-gray-400 ${titleClassName}`}
          >
            <span>{title}</span>
            <MdArrowRight
              className={`ml-auto h-8 w-8 text-gray-900 ${
                open ? 'rotate-90 transform' : ''
              } ${arrowClassName}`}
            />
          </Disclosure.Button>
          <Disclosure.Panel
            className={`text-gray-900 text-base md:text-xl ${contentClassName}`}
          >
            {content}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
