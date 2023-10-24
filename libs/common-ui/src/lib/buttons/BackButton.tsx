import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericButton } from './GenericButton';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export type BackButtonProps = {
  path?: string;
  className?: string;
};

export const BackButton = ({ path, className }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (path) {
      navigate(path);
    } else {
      navigate(-1);
    }
  };

  return (
    <GenericButton
      text="Back"
      type="button"
      icon={<ArrowUturnLeftIcon className="h-4 w-4" />}
      onClick={handleOnClick}
      className={className ?? 'hover:bg-gray-700'}
    />
  );
};
