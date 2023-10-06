import React from 'react';
import { Spinner } from './Spinner';

export const FullscreenSpinner = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
};
