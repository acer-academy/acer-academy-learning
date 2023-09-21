// import { useAuth } from '../../auth/AuthContext';
import { AcerAcademyLogo } from '@acer-academy-learning/common-ui';
import { useAuth } from '@acer-academy-learning/common-ui';
import { Student } from 'libs/data-access/src/lib/types/student';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const { user, logout } = useAuth<Student>();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally, redirect the user to the login page or show a logout success message
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally, show a logout failure message
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AcerAcademyLogo className="mx-auto h-20 w-auto" />

          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Student System
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {user ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    First Name:
                  </span>
                  <span className="text-gray-800">{user.firstName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    Last Name:
                  </span>
                  <span className="text-gray-800">{user.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">Email:</span>
                  <span className="text-gray-800">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    Student Subjects:
                  </span>
                  <span className="text-gray-800 capitalize">
                    {user.subjects.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    Student Levels:
                  </span>
                  <span className="text-gray-800 capitalize">{user.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">School:</span>
                  <span className="text-gray-800">{user.school}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">
                    Phone Number:
                  </span>
                  <span className="text-gray-800">{user.phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">Centre:</span>
                  <span className="text-gray-800">{user.centre?.name}</span>
                </div>
                <br></br>
                {user.parents.map((parent, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">
                        Parent {index + 1} First Name:
                      </span>
                      <span className="text-gray-800">{parent.firstName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">
                        Parent {index + 1} Last Name:
                      </span>
                      <span className="text-gray-800">{parent.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">
                        Parent {index + 1} Phone Number:
                      </span>
                      <span className="text-gray-800">
                        {parent.phoneNumber}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-gray-800">
                Please{' '}
                <a href="/" className="text-blue-800 font-bold">
                  log in
                </a>{' '}
                to see user details.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
