import {
  GenericBadge,
  GenericComboBox,
  useToast,
} from '@acer-academy-learning/common-ui';
import { getAllStudents as apiGetAllStudents } from '@acer-academy-learning/data-access';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { StudentData } from 'libs/data-access/src/lib/types/student';
import { useEffect, useState } from 'react';

export const SearchStudentsSection: React.FC<{
  allocatedTo: string[];
  setAllocatedTo: Function;
  setIsPublic: Function;
}> = (props) => {
  const { allocatedTo, setAllocatedTo, setIsPublic } = props;
  const { displayToast, ToastType } = useToast();
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);

  const getAllStudents = async () => {
    try {
      const response = await apiGetAllStudents();
      const studentData = response.data;
      setAllStudents(studentData.students);
    } catch (error) {
      displayToast(
        'Quizzes could not be retrieved from the server.',
        ToastType.ERROR,
      );
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <div className="mt-10 mb-5 flex flex-col">
      <div className="flex gap-2">
        <button
          className="text-black"
          onClick={() => {
            setIsPublic(true);
            setAllocatedTo([]);
          }}
        >
          <ArrowLeftIcon className="h-5 w-5 stroke-2 hover:stroke-indigo-600" />
        </button>
        <span className="text-2xl font-semibold leading-6 text-gray-900">
          Select allocated students
        </span>
      </div>
      <div className="flex flex-wrap my-4 gap-4">
        {allStudents
          .filter((student) => allocatedTo.includes(student.id))
          .map((student) => (
            <div key={student.id}>
              <GenericBadge
                badge={`${student.firstName} ${student.lastName}`}
                onRemove={() =>
                  setAllocatedTo(allocatedTo.filter((id) => id != student.id))
                }
              ></GenericBadge>
            </div>
          ))}
      </div>
      <GenericComboBox
        options={allStudents.map((student) => student.id)}
        onChange={(selectedIds) => setAllocatedTo(selectedIds)}
        selected={allocatedTo}
        displayValue={(id) => {
          const curr = allStudents.find((student) => student.id == id);
          return curr ? `${curr.firstName} ${curr.lastName}` : '';
        }}
      ></GenericComboBox>
    </div>
  );
};
