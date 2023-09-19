import { useAuth } from '../../auth/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { updateAdmin } from '../../api/admin';
import { useToast } from '@acer-academy-learning/common-ui';

const Profile: React.FC = () => {
    // const { user } = useAuth();
    //to test without linking to auth - auth need link to accounts page or login page
    const user = {firstName: 'user1', lastName: 'Sample', email: 'user1@gmail.com', type: 'Standard'}
    const [firstName, setFirstName] = useState(user.firstName);
    const [firstNameEdit, setFirstNameEdit] = useState(false);
    const [lastName, setLastName] = useState(user.lastName);
    const [lastNameEdit, setLastNameEdit] = useState(false);
    const inputFirstNameRef = useRef<HTMLInputElement | null>(null);
    const inputLastNameRef = useRef<HTMLInputElement | null>(null);

    const { displayToast, ToastType } = useToast();

    const handleFirstNameInputBlur = async () => {
        try {
            await updateAdmin(user.email, {firstName: firstName});
            displayToast('First name updated!', ToastType.SUCCESS);
            setFirstNameEdit(false);
        } catch(error) {
            displayToast('Update first name failed', ToastType.ERROR);
        }
    }

    const handleLastNameInputBlur = async () => {
        try {
            await updateAdmin(user.email, {lastName: lastName});
            displayToast('Last name updated!', ToastType.SUCCESS);
            setLastNameEdit(false);
        } catch(error) {
            displayToast('Update last name failed', ToastType.ERROR);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (
            (inputFirstNameRef.current && !inputFirstNameRef.current.contains(e.target as Node)) ||
            (inputLastNameRef.current && !inputLastNameRef.current.contains(e.target as Node))
        ) {
            if(firstNameEdit) {
                handleFirstNameInputBlur()
            } 
            if(lastNameEdit) {
                handleLastNameInputBlur()
            }
        }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
        document.removeEventListener('click', handleClickOutside);
        };
    }, []);


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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">First Name:</span>
                { firstNameEdit ? (
                    <input
                    ref={inputFirstNameRef}
                    type="text"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setFirstName(e.target.value)}}
                    onBlur={handleFirstNameInputBlur}
                    autoFocus
                    />
                ): 
                (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-800">{firstName}</span>
                        <span>
                            <span onClick={() => setFirstNameEdit(true)} className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">name</span>
                                </span>
                        </span>
                    </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Last Name:</span>
                { lastNameEdit ? (
                    <input
                    ref={inputLastNameRef}
                    type="text"
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setLastName(e.target.value)}}
                    onBlur={handleLastNameInputBlur}
                    autoFocus
                    />
                ): 
                (
                    <div>
                        <span className="ext-gray-800">{lastName}</span>
                        <span>
                            <span onClick={() => setLastNameEdit(true)} className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">name</span>
                                </span>
                        </span>
                    </div>
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

export default Profile;
