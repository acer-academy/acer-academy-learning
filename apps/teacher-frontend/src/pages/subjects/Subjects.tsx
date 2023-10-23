import {
  SubjectImage,
  getSubjectPathFrom,
  useAuth,
} from '@acer-academy-learning/common-ui';
import { Teacher } from '@acer-academy-learning/data-access';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export const Subjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth<Teacher>();
  const subjects = useMemo(
    () => user?.subjects?.map((subject) => getSubjectPathFrom(subject)),
    [user],
  );
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {subjects?.map((subject) => (
        <li
          key={subject.subject}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow hover:shadow-lg"
        >
          <button type="button" onClick={() => navigate(subject.path)}>
            <div className="flex flex-1 flex-col">
              <SubjectImage subject={subject.subject} />
            </div>
            <div>
              <div className="-mt-px font-semibold p-4">{subject.title}</div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};
