import { Outlet } from 'react-router-dom';

export type SecondaryLayoutProps = {
  desktopSidebar?: React.ReactNode;
  mobileSidebar?: React.ReactNode;
};

export const SidebarLayout = ({
  desktopSidebar,
  mobileSidebar,
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
      <div className="relative h-full">
        {mobileSidebar}
        {desktopSidebar}

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};