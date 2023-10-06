import React from 'react';

export type ErrorTextProps = {
  message?: string;
};

export const ErrorText = ({ message }: ErrorTextProps) => {
  return <span className={`text-red-600 text-xs mt-2`}>{message}</span>;
};
