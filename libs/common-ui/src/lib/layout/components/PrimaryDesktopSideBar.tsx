import { SideBarProps } from './type';
import { useThemeContext } from '../contexts/ThemeContext';
import { LayoutRole } from '../constants';
import { DisclosureMenuItem } from './DisclosureMenuItem';
import { DisclosureLeafItem } from './DisclosureLeafItem';

export const PrimaryDesktopSideBar = ({
  navigationMenu,
  logo,
}: SideBarProps) => {
  const { role } = useThemeContext();
  return (
    <div className="hidden lg:fixed mt-[10vh] lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div
        className={`flex grow flex-col gap-y-5 overflow-y-auto ${
          role === LayoutRole.Student
            ? 'bg-student-primary-600'
            : 'bg-teacher-primary-900'
        } border-r border-gray-200 px-6`}
      >
        {logo && (
          <div className="flex h-16 shrink-0 items-center mt-4">{logo}</div>
        )}
        <nav className="flex flex-1 flex-col mt-4">
          <ul className="flex flex-1 flex-col gap-y-1 content-between">
            {navigationMenu.map(
              (item) =>
                (item.children && (
                  <DisclosureMenuItem item={item} key={item.name} />
                )) || (
                  <DisclosureLeafItem
                    item={item}
                    key={item.name}
                    isChild={false}
                  />
                ),
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};
