import React from 'react';

export type DividerProps = {
  lineClassName?: string;
  containerClassName?: string;
};

export const Divider = ({
  lineClassName,
  containerClassName,
}: DividerProps) => {
  return (
    <div className={`relative h-[1px] ${containerClassName}`}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className={`w-full border-t border-gray-200 ${lineClassName}`} />
      </div>
    </div>
  );
};
