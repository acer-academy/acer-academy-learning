import { useState } from 'react';
import { AcerAcademyLogo } from '@acer-academy-learning/common-ui';
import { useToast } from '@acer-academy-learning/common-ui';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { resetTeacherPassword } from '@acer-academy-learning/data-access';

const TeacherResetPassword: React.FC = () => {
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { displayToast, ToastType } = useToast();

  // Extract the token from the URL
  const token = new URLSearchParams(location.search).get('token');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      displayToast('Password do not match', ToastType.ERROR);
      return;
    }

    if (token) {
      try {
        const response = await resetTeacherPassword(token, password);
        const responseData = await response.data;

        if (response.status === 200) {
          // Handle successful password reset, maybe redirect to login page
          displayToast(
            `${responseData.message}. Redirecting you over to login.`,
            ToastType.SUCCESS,
          );

          setTimeout(() => {
            navigate('/');
          }, 3000); // redirect after 3 seconds
        } else {
          displayToast(responseData.error, ToastType.ERROR);
        }
      } catch (error) {
        displayToast('An unexpected error occurred', ToastType.ERROR);
      }
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AcerAcademyLogo className="mx-auto h-20 w-auto" />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Teacher System
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-xl sm:px-12">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Set new password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 mb-6">
              Enter the new password
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
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
                  Confirm Password
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
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Continue
                </button>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                <a
                  href="/"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Return to sign in
                </a>
              </p>
            </form>
          </div>
          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a
              href="/sign-up"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherResetPassword;
