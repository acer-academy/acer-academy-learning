import { type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FullscreenSpinner } from './FullscreenSpinner';
import { Redirect } from './Redirect';
// import { useLoginState } from '~/features/auth'

type PublicPageWrapperProps = {
  /**
   * If `strict` is true, only users without the login flag in localStorage can access the route.
   * i.e. signin page, where authed users accessing that page should be
   * redirected out.
   * If `strict` is false, then both authed and non-authed users can access
   * the route.
   * Defaults to `false`.
   *
   * 'redirectsTo'
   * Defaults to '/'
   */
  strict?: boolean;
  redirectsTo?: string;
};

/**
 * Page wrapper that renders children only if the login cookie (and hence login state) is NOT found.
 * Otherwise, will redirect to the route passed into 'redirectsTo'.
 *
 * @note There is no authentication being performed by this component. This component is merely a wrapper that checks for the presence of the login flag in cookies.
 */
export const PublicPageWrapper = ({
  strict,
  children,
  redirectsTo,
}: PropsWithChildren<PublicPageWrapperProps>): JSX.Element => {
  const navigate = useNavigate();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (user && strict) {
    return <Redirect redirectTo={redirectsTo ?? '/'} />;
  }

  // @note 🚨 choosing not to couple this with RRD's <Outlet/> component to make it more flexible
  return <>{children}</>;
};
