import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../../wrapper/AuthContext';
import { LayoutRole } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../wrapper/ToastProvider';

export const LogoutButton = () => {
  const { role } = useThemeContext();
  const { logout } = useAuth();
  const { displayToast, ToastType } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      // To handle separately once tested
      displayToast('Successfully logged out!', ToastType.SUCCESS);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      <ArrowRightOnRectangleIcon
        className={`h-6 w-6 shrink-0 text-icon-primary  ${
          role === LayoutRole.Student
            ? 'hover:text-student-secondary-500'
            : 'hover:text-teacher-secondary-500'
        }`}
      />
    </button>
  );
};
