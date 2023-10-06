import React from 'react';

export type StaticRowFieldProp = {
  title: string;
  value: string;
};

export const StaticRowField = ({ title, value }: StaticRowFieldProp) => {
  return (
    <>
      <span className="block text-sm font-medium leading-6 text-gray-900 text-left">
        {title}
      </span>
      <span className="leading-6 text-sm py-1.5">{value}</span>
      <div />
    </>
  );
};
