import { useAuth } from '@acer-academy-learning/common-ui';
import { useState, useEffect } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { updateTeacher } from '../../api/teacher';

const TeacherProfile: React.FC = () => {
    // const { user } = useAuth<Teacher>();
    const user = {firstName: 'user1', lastName: 'user2', email: 'email@gmail.com', subjects: ['English', 'Math'], levels: ['P1', 'P2']}

    const [updateUser, setUpdateUser] = useState({
        firstName: user.firstName, 
        lastName: user.lastName, 
        subjects: user.subjects, 
        levels: user.levels
    }) 

    const [isEditing, setIsEditing] = useState(false)

    const subjects = [
        { id: 'english', label: 'English' },
        { id: 'science', label: 'Science' },
        { id: 'math', label: 'Math' },
        // add more subjects as needed
      ];
    
      const levels = [
        ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
        ['S1', 'S2', 'S3', 'S4', 'S5'],
        ['J1', 'J2'],
        // add more rows as needed
      ];

    const handleChange = (field: string, data: string) => {
        if(field==='subject') {
            setUpdateUser((prevUser) => {
                const updatedUser = {
                  ...prevUser,
                  subjects: prevUser.subjects.includes(data)
                    ? prevUser.subjects.filter((subj) => subj !== data)
                    : [...prevUser.subjects, data],
                };
                return updatedUser;
            });     
        } else if(field==='level') {
            setUpdateUser((prevUser) => {
                const updatedUser = {
                  ...prevUser,
                  levels: prevUser.levels.includes(data)
                    ? prevUser.levels.filter((level) => level !== data)
                    : [...prevUser.levels, data],
                };
                return updatedUser;
            });     
        }
    };


    const { displayToast, ToastType } = useToast();

    const editProfile = () => {
      setIsEditing(true)
    }

    const saveProfile = async () => {
      try {
        console.log(updateUser)
        // await updateTeacher(user.email, {...updateUser})
        //see if need refresh auth after update 
        setIsEditing(false)
        displayToast(`Profile updated!`, ToastType.SUCCESS)
      } catch(error) {
        displayToast('Profile update failed', ToastType.ERROR);
      }
    }


  return (
    <div className="h-full bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Profile
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[1000px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            { isEditing ? (
            <button
            onClick={saveProfile}
            className="justify-end rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save Profile
            </button>
            ):(
            <button
            onClick={editProfile}
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
                    value={updateUser.firstName}
                    onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setUpdateUser({...updateUser, firstName:e.target.value})}
                    autoFocus
                    />
                ): 
                (
                <span className="text-gray-800">{updateUser.firstName}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Last Name:</span>
                { isEditing ? (
                    <input
                    type="text"
                    value={updateUser.lastName}
                    onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setUpdateUser({...updateUser, lastName:e.target.value})}
                    autoFocus
                    />
                ): 
                (
                <span className="ext-gray-800">{updateUser.lastName}</span>
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
              <div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Levels:</span>
                    { isEditing ? (
                    <div className="w-3/4 mt-2 flex flex-col space-y-4 pl-3 py-5">
                      {levels.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex space-x-4 justify-start">
                          {row.map((level) => (
                            <label key={level} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={updateUser.levels.includes(level)}
                                onChange={() => handleChange('level', level)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <span className="ml-2 text-gray-700">{level}</span>
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                      ) : (
                      <span className="ext-gray-800">{updateUser.levels.join(', ')}</span>
                      )
                    } 
                </div>
                <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Subjects:</span>
                {isEditing ? (
                    <div className="w-3/4 mt-2 flex justify-between space-y-4 pl-3">
                      {subjects.map((subject) => (
                        <label key={subject.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={updateUser.subjects.includes(subject.label)}
                            onChange={() => handleChange('subject', subject.label)}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          <span className="ml-2 text-gray-700">{subject.label}</span>
                        </label>
                      ))}
                    </div>
                ) : (
                <span className="text-gray-800">{updateUser.subjects.join(', ')}</span>
                )}
                </div>

            </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Email:</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};


export default TeacherProfile;
