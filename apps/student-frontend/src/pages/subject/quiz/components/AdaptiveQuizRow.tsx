import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { VIEW_ADAPTIVE_QUIZ } from '../../../../libs/routes';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const smallDataClassName = `text-xs px-2`;

export type AdaptiveQuizRowType = {
  iconStyles?: string;
  className?: string;
};
export const AdaptiveQuizRow = ({
  className,
  iconStyles,
}: AdaptiveQuizRowType) => {
  const navigate = useNavigate();
  return (
    <li className={`border-x border-b border-gray-400 ${className}`}>
      <button
        onClick={() => navigate('adaptive')}
        type="button"
        className="flex items-center space-x-4 px-6 py-4 w-full"
      >
        <RocketLaunchIcon className={`h-8 w-8 ${iconStyles}`} />
        <div className="flex flex-col space-y-1">
          <span className="text-base font-bold underline hover:no-underline self-start">
            Adaptive Learning
          </span>
          <div className="flex">
            <small className={`${smallDataClassName} pl-0`}>
              Challenge Yourself!
            </small>
          </div>
        </div>
      </button>
    </li>
  );
};
