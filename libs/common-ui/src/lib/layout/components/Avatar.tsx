import React, { useMemo } from 'react';
import { getThemeClassName } from '../../utils/getThemeClassName';
import { useThemeContext } from '../contexts/ThemeContext';

export type AvatarProps = {
  imageUrl?: string;
  firstName: string;
  bgStyle?: string;
  borderStyle?: string;
  logoTextStyle?: string;
  textStyle?: string;
  size?: string;
  textSize?: string;
};

const commonImageStyles = 'h-8 w-8 rounded-full';

export const Avatar = ({
  imageUrl,
  firstName,
  bgStyle,
  textStyle,
  logoTextStyle,
  borderStyle,
  size,
  textSize,
}: AvatarProps) => {
  const initial = useMemo(
    () => firstName.charAt(0).toLocaleUpperCase(),
    [firstName],
  );

  const { role } = useThemeContext();

  return (
    <div className="flex items-center flex-1">
      {(imageUrl && (
        <img
          className={`${commonImageStyles} `}
          src={imageUrl}
          alt="Your Profile"
        />
      )) || (
        <span
          // @TODO: Definitely nt the best way to do it, will refine if gt time
          className={`flex  ${
            size ?? 'lg:h-10 lg:w-10 h-8 w-8 '
          } shrink-0 items-center justify-center rounded-lg border ${
            borderStyle ?? getThemeClassName('border', role, true, 500)
          } ${bgStyle ?? getThemeClassName('bg', role, true, 600)}  ${
            textSize ?? 'text-[0.625rem] lg:text-[1rem]'
          } font-medium ${logoTextStyle ?? 'text-text-primary'}`}
        >
          {initial}
        </span>
      )}
      <span className="sr-only">Your profile</span>
      <span
        aria-hidden="true"
        className={`ml-4 ${textStyle ?? 'text-text-primary'}`}
      >
        {firstName.charAt(0).toLocaleUpperCase() + firstName.slice(1)}
      </span>
    </div>
  );
};
