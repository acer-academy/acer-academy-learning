import { AcerAcademyLogo } from '../logo/logo';
import { DesktopSideBar } from './components/DesktopSideBar';
import { MobileSideBar } from './components/MobileSideBar';
import { MobileTopNav } from './components/MobileTopNav';
import { NavigationMenuItem } from './components/type';
import { LayoutRole } from './constants';
import { MobileProvider } from './contexts/mobile.context';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarLayout } from './SidebarLayout';

export type SecondaryLayoutProps = {
  navigationMenu: NavigationMenuItem[];
  role: LayoutRole;
};

export const SecondaryLayout = ({
  navigationMenu,
  role,
}: SecondaryLayoutProps) => {
  return (
    <ThemeProvider role={role}>
      <SidebarLayout
        desktopSidebar={
          <DesktopSideBar
            navigationMenu={navigationMenu}
            logo={<AcerAcademyLogo />}
          />
        }
        mobileSidebar={
          <MobileProvider>
            <MobileSideBar navigationMenu={navigationMenu} />
            <MobileTopNav />
          </MobileProvider>
        }
      />
    </ThemeProvider>
  );
};
