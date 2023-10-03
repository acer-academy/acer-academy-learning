import { Outlet } from 'react-router-dom';

export type SecondaryLayoutProps = {
  desktopSidebar?: React.ReactNode;
  mobileSidebar?: React.ReactNode;
  className?: string;
};

export const SidebarLayout = ({
  desktopSidebar,
  mobileSidebar,
  className,
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
      <div className={`relative overflow-y-scroll h-full ${className ?? ''}`}>
        {mobileSidebar}
        {desktopSidebar}

        {/* Commenting this out instead of removing in case we changing this later */}
        <main className="py-10 lg:pl-72">
          {/* <main className="lg:pl-72"> */}
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};
