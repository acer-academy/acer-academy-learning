import { useAuth } from '@acer-academy-learning/common-ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateAdmin } from '../../api/admin';
import { useToast } from '@acer-academy-learning/common-ui';
import { CHANGE_PASSWORD } from '../../libs/routes';

const AdminProfile: React.FC = () => {
  const { user, updateUser } = useAuth<Admin>();
  const [firstName, setFirstName] = useState(user.firstName);
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState(user.lastName);

  const navigate = useNavigate();

  const { displayToast, ToastType } = useToast();

  const onSaveProfile = async () => {
    try {
      if (firstName.length === 0 || lastName.length === 0) {
        displayToast(
          `Please fill in your First and Last name`,
          ToastType.ERROR,
        );
        return;
      } else {
        let updatedAdmin = await updateAdmin(user.id, {
          firstName: firstName,
          lastName: lastName,
        });
        //
        //UPDATE AUTH CONTEXT
        updateUser(updatedAdmin);
        displayToast('Profile updated!', ToastType.SUCCESS);
        setIsEditing(false);
      }
    } catch (error) {
      displayToast('Profile update failed', ToastType.ERROR);
    }
  };

  const onEditProfile = () => {
    setIsEditing(true);
  };

  return (
    <div className="h-full bg-gray">
      <div className="mx-8 sm:mx-auto sm:w-full sm:max-w-[1000px]">
        <div className="flex justify-between items-center">
          <h1 className="mt-6 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Admin Profile
          </h1>
          <div className="mt-4 sm:mt-0">
            {isEditing ? (
              <button
                onClick={onSaveProfile}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
              >
                Save Profile
              </button>
            ) : (
              <button
                onClick={onEditProfile}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[1000px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">First Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstName(e.target.value);
                  }}
                  autoFocus
                />
              ) : (
                <span className="text-gray-800">{firstName}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Last Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLastName(e.target.value);
                  }}
                  autoFocus
                />
              ) : (
                <span className="text-gray-800">{lastName}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">
                Change Password:
              </span>
              <button
                className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => navigate(`${CHANGE_PASSWORD}`)}
              >
                Change Password
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Admin Type:</span>
              <span className="text-gray-800 capitalize">{user.type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
