export type NavigationMenuItem = {
  name: string;
  path?: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  children?: NavigationMenuItem[];
  defaultChild?: string;
};

export type NavigationSection = {
  name: string;
  menu: NavigationMenuItem[];
};

export type MobileProps = {
  setSidebarOpen: (open: boolean) => void;
};

export type SideBarProps = {
  navigationSections: NavigationSection[];
};
