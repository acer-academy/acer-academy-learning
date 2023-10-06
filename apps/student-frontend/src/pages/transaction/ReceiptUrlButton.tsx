import React from 'react';

interface ReceiptUrlButtonProps {
  value: string;
}

const ReceiptUrlButton: React.FC<ReceiptUrlButtonProps> = ({ value }) => {
  const className =
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700';

  if (!value) {
    return (
      <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700">
        No Invoice
      </div>
    );
  }

  return (
    <a
      className={className}
      href={value}
      target="_blank"
      rel="noopener noreferrer"
    >
      Get Invoice
    </a>
  );
};

export default ReceiptUrlButton;
