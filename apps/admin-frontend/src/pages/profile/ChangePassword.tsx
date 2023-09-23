import { useAuth } from '@acer-academy-learning/common-ui';
import { useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { updateAdmin } from '../../api/admin';
import { Admin } from 'libs/data-access/src/lib/types/admin';

const ChangePassword: React.FC = () => {
  const { user, updateUser } = useAuth<Admin>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { displayToast, ToastType } = useToast();

  const changePassword = async () => {
    if (password !== confirmPassword) {
      displayToast('Password do not match', ToastType.ERROR);
      return;
    }
    if (password === '') {
      displayToast('Please enter a new password', ToastType.ERROR);
      return;
    }
    try {
      const updatedAdmin = await updateAdmin(user.id, {
        password: password,
      });
      setPassword('');
      setConfirmPassword('');
      //@TODO: SET USER HERE FOR AUTH CONTEXT
      updateUser(updatedAdmin);
      displayToast('Password succesfully changed!', ToastType.SUCCESS);
    } catch (error: any) {
      displayToast(`${error}`, ToastType.ERROR);
    }
  };

  return (
    <div className="lex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 mx-8 sm:mx-auto sm:w-full sm:max-w-[1000px]">
      <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Change Password
      </h2>

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
          className="block text-sm font-medium leading-6 text-gray-900 mt-4"
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
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
          onClick={changePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
