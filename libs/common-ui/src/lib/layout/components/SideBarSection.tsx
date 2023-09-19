import React from 'react';
import { NavigationSection } from './type';
import { DisclosureMenuItem } from './DisclosureMenuItem';
import { DisclosureLeafItem } from './DisclosureLeafItem';

export type SideBarSection = {
  section: NavigationSection;
};

export const SideBarSection = ({ section }: SideBarSection) => {
  return (
    <li>
      {section.name && (
        <div className="text-xs font-semibold leading-6 text-text-primary">
          {section.name}
        </div>
      )}
      <ul className="-mx-2 space-y-1">
        {section.menu.map(
          (item) =>
            (item.children && (
              <DisclosureMenuItem key={item.name} item={item} />
            )) || (
              <DisclosureLeafItem isChild={false} key={item.name} item={item} />
            ),
        )}
      </ul>
    </li>
  );
};
