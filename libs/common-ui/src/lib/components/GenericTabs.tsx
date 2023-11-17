import { classNames } from '@acer-academy-learning/common-ui';
import { useLocation, useNavigate } from 'react-router-dom';

type TabOption = {
  name: string;
  path: string;
  current: boolean;
};

export type GenericTabsProps = {
  tabs: TabOption[];
};

export const GenericTabs = ({ tabs }: GenericTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const onTabClick = (path: string) => {
    navigate('#' + path, { replace: true });
  };
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={
            tabs.find((tab) => tab?.path === location.hash.slice(1))?.name
          }
        >
          {tabs.map((tab) => (
            <option onClick={() => onTabClick(tab.path)} key={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => onTabClick(tab.path)}
                className={classNames(
                  tab.path === location.hash.slice(1)
                    ? 'border-teacher-primary-800 text-teacher-primary-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
