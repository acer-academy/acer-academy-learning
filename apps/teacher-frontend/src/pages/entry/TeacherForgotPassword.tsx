import { useState } from 'react';
import { AcerAcademyLogo } from '@acer-academy-learning/common-ui';
import { useToast } from '@acer-academy-learning/common-ui';
import { forgotTeacherPassword } from '@acer-academy-learning/data-access';
import axios from 'axios';

const TeacherForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const { displayToast, ToastType } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await forgotTeacherPassword(email);

      // Directly accessing the response data using response.data
      const responseData = response.data;

      if (response.status === 200) {
        displayToast(responseData.message, ToastType.SUCCESS);
      } else {
        displayToast(responseData.error, ToastType.ERROR);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // The error is an Axios error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          displayToast(error.response.data.error, ToastType.ERROR);
        } else {
          // The request was made but no response was received or
          // An error occurred while setting up the request
          displayToast('An unexpected error occurred', ToastType.ERROR);
        }
      } else {
        // The error is not an Axios error
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
              Reset your password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 mb-6">
              Enter the email associated with your account, a link to reset your
              password will be sent.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-student-secondary-700 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-student-primary-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-student-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-primary-600"
                >
                  Continue
                </button>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                <a
                  href="/"
                  className="font-semibold leading-6 text-student-secondary-700 hover:text-student-secondary-900 hover:underline"
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
              className="font-semibold leading-6 text-student-secondary-700 hover:text-student-secondary-900 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherForgotPassword;
