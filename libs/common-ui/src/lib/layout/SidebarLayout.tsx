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
      <div className={`relative h-full ${className ?? ''}`}>
        {mobileSidebar}
        {desktopSidebar}

        <main className="lg:pl-72">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};
