import React from 'react';

export type ProgressBarProps = {
  rounded?: boolean;
  filledColor?: string;
  height?: number;
  width: number;
  unfinishedClassName?: string;
  completedClassName?: string;
};

export const ProgressBar = ({
  width,
  filledColor,
  rounded,
  height,
  unfinishedClassName,
  completedClassName,
}: ProgressBarProps) => {
  return (
    <div
      className={`relative ${height ? height : 'h-6'} ${
        rounded ? 'rounded' : ''
      } ${unfinishedClassName} `}
    >
      <div
        style={{ width: `${width}%` }}
        className={`absolute transition-all duration-200 ${
          height ? height : 'h-6'
        } ${filledColor ? filledColor : 'bg-green-400'} ${
          rounded ? 'rounded-l' : ''
        } ${completedClassName}`}
      />
    </div>
  );
};
