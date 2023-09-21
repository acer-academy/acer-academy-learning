import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullscreenSpinner } from './FullscreenSpinner';
import { useAuth } from './AuthContext';

type EnforceLoginStatePageWrapperProps = {
  /**
   * Route to redirect to when user is not authenticated. MUST be declared
   */
  redirectTo: string;
};

const Redirect = ({ redirectTo }: EnforceLoginStatePageWrapperProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('NO USER');
    navigate(redirectTo, { replace: true });
  }, []);
  return <FullscreenSpinner />;
};

/**
 * Page wrapper that renders children only if the user state has been set.
 * Otherwise, will redirect to the route passed into the `redirectTo` prop.
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
    return <>{children}</>;
  }

  return <Redirect redirectTo={redirectTo} />;
};
