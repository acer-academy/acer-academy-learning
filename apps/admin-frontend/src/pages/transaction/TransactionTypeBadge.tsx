import React from 'react';

interface TransactionTypeBadgeProps {
  value: string;
}

const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({
  value,
}) => {
  let className =
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium';
  const text = value;

  switch (value) {
    case 'PURCHASED':
      className += ' bg-green-100 text-green-700';
      break;
    case 'DEDUCTED':
      className += ' bg-red-100 text-red-700';
      break;
    default:
      className += ' bg-gray-100 text-gray-700';
  }

  return <span className={className}>{text}</span>;
};

export default TransactionTypeBadge;
