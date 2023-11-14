import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericButton } from './GenericButton';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { LayoutRole } from '../layout';

export type BackButtonProps = {
  role?: LayoutRole;
  path?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const BackButton = ({ role, path, className }: BackButtonProps) => {
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
      role={role}
      text="Back"
      type="button"
      icon={<ArrowUturnLeftIcon className="h-4 w-4" />}
      onClick={handleOnClick}
      className={className ?? 'hover:bg-gray-700'}
    />
  );
};
