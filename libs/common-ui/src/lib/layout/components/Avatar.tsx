import { UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import React from 'react';

export type AvatarProps = {
  imageUrl?: string;
  name: string;
};

const commonImageStyles = 'h-8 w-8 rounded-full';

export const Avatar = ({ imageUrl, name }: AvatarProps) => {
  return (
    <div className="flex items-center flex-1">
      {(imageUrl && (
        <img
          className={`${commonImageStyles} `}
          src={imageUrl}
          alt="Your Profile"
        />
      )) || <UserIcon className={`${commonImageStyles}`} />}
      <span className="sr-only">Your profile</span>
      <span aria-hidden="true" className="ml-4">
        {name}
      </span>
    </div>
  );
};
