import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullscreenSpinner } from './FullscreenSpinner';

export type RedirectProps = {
  /**
   * Route to redirect to when user is not authenticated. MUST be declared
   */
  redirectTo: string;
};

export const Redirect = ({ redirectTo }: RedirectProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(redirectTo, { replace: true });
  }, []);
  return <FullscreenSpinner />;
};
