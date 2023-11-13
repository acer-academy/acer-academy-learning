import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavigationMenuItem } from './components/type';
import { SidebarLayout } from './SidebarLayout';
import { NavLink } from 'react-router-dom';
import { LayoutRole } from './constants';
import { classNames } from '../utils/classNames';
import { ThemeProvider } from './contexts/ThemeContext';
import { useGetSecondaryMenu } from './hooks/useGetSecondaryMenu';
import { PrimaryDesktopSideBar } from './components/PrimaryDesktopSideBar';
import { AccountPopover } from './components/AccountPopover';
import { AcerAcademyLogo } from '../logo/logo';
import logo from '../assets/acer-academy-logo-white.png';
import { LogoutButton } from './components/LogoutButton';
import { useAuth } from '../wrapper/AuthContext';
import { Admin, Student, Teacher } from '@prisma/client';
import { DisclosureMenuItem } from './components/DisclosureMenuItem';
import { DisclosureLeafItem } from './components/DisclosureLeafItem';
import { getThemeClassName } from '../utils/getThemeClassName';
import { useToast } from '../wrapper/ToastProvider';

export type PrimaryLayoutProps = {
  accountNavigation: NavigationMenuItem;
  navigationMenu: NavigationMenuItem[];
  role: LayoutRole;
  routesWithoutSidebar?: string[];
};

export const PrimaryLayout = ({
  navigationMenu,
  role,
  accountNavigation,
  routesWithoutSidebar,
}: PrimaryLayoutProps) => {
  const { displayToast, ToastType } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const secondaryMenu = useGetSecondaryMenu([
    ...navigationMenu,
    accountNavigation,
  ]);
  const { user, logout } = useAuth<Admin | Student | Teacher>();
  const handleLogout = async () => {
    try {
      await logout();
      // To handle separately once tested
      displayToast('Successfully logged out!', ToastType.SUCCESS);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <ThemeProvider role={role}>
      <div className="h-full flex flex-col">
        <header
          className={`fixed z-[1] h-[10vh] w-full ${
            role === LayoutRole.Student
              ? 'bg-student-primary-900'
              : 'bg-teacher-primary-900'
          } flex-2 shadow-bottom `}
        >
          <nav
            className=" flex h-full items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex items-center gap-x-12">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className={'h-9 w-auto'}
                  src={logo}
                  alt="Acer Academy Logo"
                />
              </a>
              <div className="hidden lg:flex lg:gap-x-12">
                {navigationMenu.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path || ''}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? `font-bold underline shadow-bottom`
                          : 'font-semibold',
                        `text-sm leading-6 text-white hover:underline`,
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex">
              <AccountPopover
                firstName={user?.firstName ?? role}
                menuItems={accountNavigation.children}
              />
              <LogoutButton />
            </div>
          </nav>
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-10" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <AcerAcademyLogo className="h-9 w-auto" />
                  {/* <img
                    className={'h-9 w-auto'}
                    src={logo}
                    alt="Acer Academy Logo"
                  /> */}
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className={`-my-6 divide-y bg-white divide-white-500/10`}>
                  <div className="space-y-2 py-6">
                    {[...navigationMenu, accountNavigation].map(
                      (item) =>
                        (item.children && (
                          <DisclosureMenuItem item={item} key={item.name} />
                        )) || (
                          <DisclosureLeafItem
                            activeColor={'text-white'}
                            textColor={'text-student-primary-700'}
                            textHoverColor={'hover:text-gray-500'}
                            groupHoverColor={getThemeClassName(
                              'group-hover:text',
                              role,
                              true,
                              700,
                            )}
                            bgColor={'bg-gray-900'}
                            bgHoverColor={'hover:bg-gray-100'}
                            item={item}
                            key={item.name}
                            isChild={false}
                          />
                        ),
                    )}
                  </div>
                  <div className="py-6">
                    <button
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>
        <SidebarLayout
          className="mt-[10vh]"
          desktopSidebar={
            <PrimaryDesktopSideBar navigationMenu={secondaryMenu} />
          }
          routesWithoutSidebar={routesWithoutSidebar}
        />
      </div>
    </ThemeProvider>
  );
};
