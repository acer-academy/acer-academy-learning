import { PropsWithChildren } from 'react';
import { DesktopSideBar } from './components/DesktopSideBar';
import { MobileSideBar } from './components/MobileSideBar';
import { MobileTopNav } from './components/MobileTopNav';
import { MobileProvider } from './contexts/mobile.context';
import { NavigationSection } from './components/type';

export type SecondaryLayoutProps = {
  navigationSections: NavigationSection[];
} & PropsWithChildren;

export const SecondaryLayout = ({
  navigationSections,
  children,
}: SecondaryLayoutProps) => {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <MobileProvider>
          <MobileSideBar navigationSections={navigationSections} />
          <MobileTopNav />
        </MobileProvider>

        {/* Static sidebar for desktop lg: means only large */}
        <DesktopSideBar navigationSections={navigationSections} />

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};
