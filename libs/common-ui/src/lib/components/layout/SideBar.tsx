import { DisclosureMenuItem } from './DisclosureMenuItem';
import { NavigationSection } from '../../layout/components/type';
export type SideBarProps = {
  navigationSections: NavigationSection[];
};

export const SideBar = ({ navigationSections }: SideBarProps) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-admin-primary-600 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            {navigationSections.map((section) => (
              <li key={section.name}>
                {section.name && (
                  <div className="text-xs font-semibold leading-6 text-admin-primary-200">
                    {section.name}
                  </div>
                )}
                <ul className="-mx-2 space-y-1">
                  {section.menu.map((item) => (
                    <li key={item.name}>
                      <DisclosureMenuItem item={item} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="-mx-6 mt-auto">
              <img
                className="h-8 w-8 rounded-full bg-admin-primary-700"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
