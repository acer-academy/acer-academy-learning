import { UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import React from 'react';

export type AvatarProps = {
  imageUrl?: string;
};

const commonImageStyles = 'h-8 w-8 rounded-full bg-gray-50 ';

export const Avatar = ({ imageUrl }: AvatarProps) => {
  return (
    <>
      {(imageUrl && (
        <img
          className={`${commonImageStyles} `}
          src={imageUrl}
          alt="Your Profile"
        />
      )) || <UserIcon className={`${commonImageStyles}`} />}
      <span className="sr-only">Your profile</span>
      <span aria-hidden="true">Tom Cook</span>
    </>
  );
};
