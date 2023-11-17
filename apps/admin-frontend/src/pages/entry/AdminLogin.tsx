import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AcerAcademyLogo,
  PublicPageWrapper,
} from '@acer-academy-learning/common-ui';
import { useAuth } from '@acer-academy-learning/common-ui';
import { useToast } from '@acer-academy-learning/common-ui';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { displayToast, ToastType } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      displayToast(`${error}`, ToastType.ERROR);
    }
  };

  return (
    <PublicPageWrapper strict>
      <div className="h-full bg-gray-50">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <AcerAcademyLogo className="mx-auto h-20 w-auto" />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Admin System
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900 mb-7">
                Sign in to your account
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-admin-primary-700 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-admin-primary-700 sm:text-sm sm:leading-6"
                    />
                    <button
                      onClick={() => setShowPassword((prev) => !prev)}
                      type="button"
                      className="absolute top-0 bottom-0 my-auto right-0 mr-1 md:h-6 md:w-6 text-teacher-primary-600"
                    >
                      {(showPassword && (
                        <EyeSlashIcon className="hover:text-teacher-primary-900" />
                      )) || (
                        <EyeIcon className="hover:text-teacher-primary-900" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-900"
                    >
                      Remember me
                    </label> */}
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="forgot-password"
                      className="font-semibold text-admin-primary-700 hover:text-admin-primary-900 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-admin-primary-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-admin-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a
                href="/sign-up"
                className="font-semibold leading-6 text-admin-primary-700 hover:text-admin-primary-900 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicPageWrapper>
  );
};

export default AdminLogin;
