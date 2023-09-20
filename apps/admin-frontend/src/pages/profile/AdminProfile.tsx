import { useAuth } from '@acer-academy-learning/common-ui';
import { useState, useEffect, useRef } from 'react';
import { updateAdmin } from '../../api/admin';
import { useToast } from '@acer-academy-learning/common-ui';

const AdminProfile: React.FC = () => {
  const { user } = useAuth<Admin>();
    //to test without linking to auth - auth need link to accounts page or login page
    // const user = {firstName: 'user1', lastName: 'Sample', email: 'user1@gmail.com', type: 'Standard'}
    const [firstName, setFirstName] = useState(user.firstName);
    const [isEditing, setIsEditing] = useState(false);
    const [lastName, setLastName] = useState(user.lastName);

    const { displayToast, ToastType } = useToast();

    const onSaveProfile = async () => {
      try {
        await updateAdmin(user.email, {firstName: firstName, lastName: lastName});
          displayToast('Profile updated!', ToastType.SUCCESS);
          setIsEditing(false);
      } catch(error) {
          displayToast('Update first name failed', ToastType.ERROR);
      }
    }

    const onEditProfile = () => {
      setIsEditing(true)
    }


  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Admin Profile
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[1000px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            { isEditing ? (
            <button
            onClick={onSaveProfile}
            className="justify-end rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save Profile
            </button>
            ):(
            <button
            onClick={onEditProfile}
            className="justify-end rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Edit Profile
            </button>
          )}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">First Name:</span>
                { isEditing ? (
                    <input
                    type="text"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setFirstName(e.target.value)}}
                    autoFocus
                    />
                ): 
                (
                <span className="text-gray-800">{firstName}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Last Name:</span>
                { isEditing ? (
                    <input
                    type="text"
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setLastName(e.target.value)}}
                    autoFocus
                    />
                ): 
                (
                <span className="ext-gray-800">{lastName}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Change Password:</span>
                <button
                className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
    </div>
  );
};

export default AdminProfile;
