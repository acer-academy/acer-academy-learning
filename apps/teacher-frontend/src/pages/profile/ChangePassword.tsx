import { useAuth } from '@acer-academy-learning/common-ui';
import { useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { updateTeacher } from '@acer-academy-learning/data-access';
import { Teacher } from 'libs/data-access/src/lib/types/teacher';

const ChangePassword: React.FC = () => {
  const { user } = useAuth<Teacher>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { displayToast, ToastType } = useToast();

  const changePassword = async () => {
    if (password !== confirmPassword) {
      displayToast('Password do not match', ToastType.ERROR);
      return;
    }
    if (password === '') {
      displayToast('Please enter new password', ToastType.ERROR);
      return;
    }
    try {
      await updateTeacher(user.id, { password });
      setPassword('');
      setConfirmPassword('');
      //@TODO: SET USER HERE FOR AUTH CONTEXT
      displayToast('Password succesfully changed!', ToastType.SUCCESS);
    } catch (error: any) {
      displayToast(`${error}`, ToastType.ERROR);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Change Password
      </h2>

      <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <div>
          <span className="block text-sm font-medium leading-6 text-gray-900">
            New Password
          </span>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Reconfirm Password
          </label>
          <div className="mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <button
            className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={changePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
