import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export type SecondaryLayoutProps = {
  desktopSidebar?: React.ReactNode;
  mobileSidebar?: React.ReactNode;
  className?: string;
  routesWithoutSidebar?: string[];
};

export const SidebarLayout = ({
  desktopSidebar,
  mobileSidebar,
  className,
  routesWithoutSidebar,
}: SecondaryLayoutProps) => {
  const location = useLocation();
  const isWithoutSideBar = useMemo(
    () => routesWithoutSidebar?.includes(location.pathname),
    [routesWithoutSidebar, location],
  );
  if (isWithoutSideBar) {
    return (
      <div
        className={`relative overflow-y-scroll h-full py-10 px-4 sm:px-6 lg:px-8 ${className}`}
      >
        <Outlet />
      </div>
    );
  }

  return (
    <div className={`relative overflow-y-scroll h-full ${className}`}>
      {mobileSidebar}
      {desktopSidebar}

      <main className="py-10 lg:pl-72 h-full">
        {/* <main className="lg:pl-72"> */}
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
