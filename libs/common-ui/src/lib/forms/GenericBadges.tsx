import React from 'react';
import { GenericBadge } from './GenericBadge';

export type GenericBadgesProps<T> = {
  badges?: T[];
  getDisplayValue: (item: T) => string;
  onChange?: (badges: T[]) => void;
  allowRemove?: boolean;
};

export const GenericBadges = <T,>({
  badges,
  getDisplayValue,
  onChange,
  allowRemove,
}: GenericBadgesProps<T>) => {
  const handleRemove = (idx: number) => {
    if (badges) {
      const newBadges = [...badges];
      newBadges.splice(idx, 1);
      if (onChange) {
        onChange(newBadges);
      }
    }
  };
  return (
    <section>
      {badges?.map((badge, idx) => (
        <GenericBadge
          key={idx}
          badge={getDisplayValue(badge)}
          onRemove={allowRemove ? () => handleRemove(idx) : undefined}
        />
      ))}
    </section>
  );
};
