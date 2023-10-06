import React from 'react';
import { GenericBadge } from './GenericBadge';

export type GenericBadgesProps<T> = {
  badges?: T[];
  getDisplayValue: (item: T) => string;
  onChange: (badges: T[]) => void;
};

export const GenericBadges = <T,>({
  badges,
  getDisplayValue,
  onChange,
}: GenericBadgesProps<T>) => {
  const handleRemove = (idx: number) => {
    if (badges) {
      const newBadges = [...badges];
      newBadges.splice(idx, 1);
      onChange(newBadges);
    }
  };
  return (
    <section className="space-x-1">
      {badges?.map((badge, idx) => (
        <GenericBadge
          key={idx}
          badge={getDisplayValue(badge)}
          onRemove={() => handleRemove(idx)}
        />
      ))}
    </section>
  );
};
