import React from 'react';

export type ErrorFieldType = {
  message?: string;
};
export const ErrorField = ({ message }: ErrorFieldType) => {
  return <span className="text-xs font-semibold text-red-500">{message}</span>;
};
