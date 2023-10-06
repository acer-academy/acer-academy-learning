import { useAuth } from '@acer-academy-learning/common-ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@acer-academy-learning/common-ui';
import { updateTeacher } from '@acer-academy-learning/data-access';
import { CHANGE_PASSWORD } from '../../libs/routes';
import { Teacher, TeacherData } from 'libs/data-access/src/lib/types/teacher';
import { LevelEnum, SubjectEnum } from '@acer-academy-learning/data-access';

const TeacherProfile: React.FC = () => {
  const { user, updateUser } = useAuth<Teacher>();

  const [updUser, setUpdUser] = useState<Partial<Teacher>>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    subjects: user?.subjects ?? [],
    levels: user?.levels ?? [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const subjects = [
    { id: 'english', value: SubjectEnum.ENGLISH },
    { id: 'science', value: SubjectEnum.SCIENCE },
    { id: 'math', value: SubjectEnum.MATHEMATICS },
    // add more subjects as needed
  ];

  const levels = [
    [
      LevelEnum.P1,
      LevelEnum.P2,
      LevelEnum.P3,
      LevelEnum.P4,
      LevelEnum.P5,
      LevelEnum.P6,
    ],
    [LevelEnum.S1, LevelEnum.S2, LevelEnum.S3, LevelEnum.S4, LevelEnum.S5],
    [LevelEnum.J1, LevelEnum.J2],
  ];

  const handleSubjectChange = (data: SubjectEnum) => {
    setUpdUser((prevUser) => {
      const subjects = prevUser.subjects ?? [];

      const updatedUser = {
        ...prevUser,
        subjects: subjects.includes(data)
          ? subjects.filter((subj: string) => subj !== data)
          : [...subjects, data],
      };
      return updatedUser;
    });
  };

  const handleLevelChange = (data: LevelEnum) => {
    setUpdUser((prevUser) => {
      const level = prevUser.levels ?? [];
      const updatedUser = {
        ...prevUser,
        levels: level.includes(data)
          ? level.filter((level: LevelEnum) => level !== data)
          : [...level, data],
      };
      return updatedUser;
    });
  };

  const convertTeacherDatatoTeacher = (teacherData: TeacherData): Teacher => {
    return {
      id: teacherData.id,
      email: teacherData.email,
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      levels: teacherData.levels,
      subjects: teacherData.subjects,
      centre: user?.centre,
      isAuthenticated: true,
    };
  };

  const { displayToast, ToastType } = useToast();

  const editProfile = () => {
    setIsEditing(true);
  };

  const saveProfile = async () => {
    try {
      if (
        (updUser.subjects && updUser.subjects.length === 0) ||
        (updUser.levels && updUser.levels.length === 0)
      ) {
        displayToast(
          `You need to choose at least a Subject and Level`,
          ToastType.ERROR,
        );
      } else if (
        updUser?.firstName?.length === 0 ||
        updUser?.lastName?.length === 0
      ) {
        displayToast(
          `Please fill in your First and Last name`,
          ToastType.ERROR,
        );
      } else {
        const subj = updUser.subjects ?? [];
        const subjectEnumArray: SubjectEnum[] = subj
          .filter((subject: string) => subject in SubjectEnum)
          .map(
            (subject: string) =>
              SubjectEnum[subject as keyof typeof SubjectEnum],
          );
        const id = user?.id ?? '';
        const updated = await updateTeacher(id, {
          ...updUser,
          subjects: subjectEnumArray,
        });
        //Refresh Auth
        updateUser(convertTeacherDatatoTeacher(updated.data));
        setIsEditing(false);
        displayToast(`Profile updated!`, ToastType.SUCCESS);
      }
    } catch (error) {
      displayToast('Profile update failed', ToastType.ERROR);
    }
  };

  return (
    <div className="h-full">
      <div className="mx-8 sm:mx-auto sm:w-full sm:max-w-[1000px]">
        <div className="flex justify-between items-center">
          <h1 className="mt-6 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Teacher Profile
          </h1>
          <div className="mt-4 sm:mt-0">
            {isEditing ? (
              <button
                onClick={saveProfile}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-6"
              >
                Save Profile
              </button>
            ) : (
              <button
                onClick={editProfile}
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
                  className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  type="text"
                  value={updUser.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUpdUser({
                      ...updUser,
                      firstName: e.target.value,
                    })
                  }
                  autoFocus
                />
              ) : (
                <span className="text-gray-800">{updUser.firstName}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Last Name:</span>
              {isEditing ? (
                <input
                  className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  type="text"
                  value={updUser.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUpdUser({ ...updUser, lastName: e.target.value })
                  }
                  autoFocus
                />
              ) : (
                <span className="ext-gray-800">{updUser.lastName}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">
                Change Password:
              </span>
              <button
                onClick={() => {
                  navigate(CHANGE_PASSWORD);
                }}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change Password
              </button>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Levels:</span>
                {isEditing ? (
                  <div className="w-3/4 mt-2 flex flex-col space-y-4 pl-3 py-5">
                    {levels.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex space-x-4 justify-start"
                      >
                        {row.map((level) => (
                          <label key={level} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={updUser.levels?.includes(level)}
                              onChange={() => handleLevelChange(level)}
                              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">{level}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="ext-gray-800">
                    {updUser?.levels?.join(', ')}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-600">Subjects:</span>
                {isEditing ? (
                  <div className="w-3/4 mt-2 flex justify-between space-y-4 pl-3">
                    {subjects.map((subject) => (
                      <label key={subject.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={updUser.subjects?.includes(subject.value)}
                          onChange={() => handleSubjectChange(subject.value)}
                          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span className="ml-2 text-gray-700">
                          {subject.value}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-800">
                    {updUser?.subjects?.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-gray-600">Centre:</span>
            <span className="text-gray-800">{user?.centre?.name}</span>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default TeacherProfile;
