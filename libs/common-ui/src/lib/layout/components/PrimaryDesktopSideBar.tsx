import { SideBarProps } from './type';
import { useThemeContext } from '../contexts/ThemeContext';
import { DisclosureMenuItem } from './DisclosureMenuItem';
import { DisclosureLeafItem } from './DisclosureLeafItem';
import { getThemeClassName } from '../../utils/getThemeClassName';

export const PrimaryDesktopSideBar = ({
  navigationMenu,
  logo,
}: SideBarProps) => {
  const { role } = useThemeContext();
  return (
    <div className="hidden lg:fixed mt-[10vh] lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div
        className={`flex grow flex-col gap-y-5 overflow-y-auto ${'bg-white'} border-r border-gray-200 px-6`}
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
                    activeColor={'text-white'}
                    textColor={getThemeClassName('text', role, true, 700)}
                    textHoverColor={'hover:text-white'}
                    groupHoverColor={getThemeClassName(
                      'group-hover:text',
                      role,
                      true,
                      700,
                    )}
                    bgColor={'bg-gray-900'}
                    bgHoverColor={getThemeClassName(
                      'hover:bg',
                      role,
                      false,
                      700,
                    )}
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
