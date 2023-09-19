import { useAuth } from '../../auth/AuthContext';
import { AcerAcademyLogo } from '@acer-academy-learning/common-ui';

const Account: React.FC = () => {
  const { user } = useAuth();

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
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">First Name:</span>
                <span className="text-gray-800">{user.firstName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Last Name:</span>
                <span className="text-gray-800">{user.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                  Teacher Subjects:
                </span>
                <span className="text-gray-800 capitalize">
                  {user.subjects.join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                  Teacher Levels:
                </span>
                <span className="text-gray-800 capitalize">
                  {user.levels.join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Centre:</span>
                <span className="text-gray-800">{user.centre?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
