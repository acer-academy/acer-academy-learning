import { FullscreenSpinner } from './FullscreenSpinner';
import { useAuth } from './AuthContext';
import { Redirect } from './Redirect';
import { PropsWithChildren } from 'react';

export type EnforceLoginStatePageWrapperProps = {
  redirectTo: string;
};

/**
 * Page wrapper that renders children only if the user state has been set.
 * Otherwise, will redirect to the route passed into the `redirectTo` prop.
 *
 * @note There is no authentication being performed by this component. This component is merely a wrapper that checks for the presence of the login flag in cookies.
 */
export const EnforceLoginStatePageWrapper = ({
  redirectTo,
  children,
}: PropsWithChildren<EnforceLoginStatePageWrapperProps>): React.ReactElement => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (user) {
    // @note 🚨 choosing not to couple this with RRD's <Outlet/> component to make it more flexible
    return <>{children}</>;
  }

  return <Redirect redirectTo={redirectTo} />;
};
