import { SideBarSection } from './SideBarSection';
import { Avatar } from './Avatar';
import { SideBarProps } from './type';
import { AcerAcademyLogo } from '../../logo/logo';
import { LogoutButton } from './LogoutButton';
import { useAuth } from '../../wrapper/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { Admin, Student, Teacher } from '@prisma/client';

export const DesktopSideBar = ({ navigationMenu }: SideBarProps) => {
  const { user } = useAuth<Admin | Student | Teacher>();
  const { role } = useThemeContext();

  return (
    <div className="hidden lg:absolute lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-admin-primary-600 border-r border-gray-200 px-6">
        <div className="flex h-16 shrink-0 items-center mt-4">
          <AcerAcademyLogo />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7 justify-between content-between">
            {navigationMenu.map((section) => (
              <li key={section.name}>
                <SideBarSection section={section} key={section.name} />
              </li>
            ))}
            <li className="-mx-6 flex gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-text-primary justify-between">
              {/* @TODO: Use AuthContext to pass in name here */}
              <Avatar firstName={user?.firstName ?? role} />
              {/* @TODO: Use AuthContext to sign out from here */}
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
