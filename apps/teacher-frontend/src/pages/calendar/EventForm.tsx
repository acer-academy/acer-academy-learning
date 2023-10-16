import { useState, useEffect } from 'react';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getAllCentres,
  getClassroomsByCentre,
} from '@acer-academy-learning/data-access';
import { CentreData } from 'libs/data-access/src/lib/types/centre';
import { ClassroomData } from 'libs/data-access/src/lib/types/classroom';
import { Teacher } from 'libs/data-access/src/lib/types/teacher';
import { useAuth } from '@acer-academy-learning/common-ui';
import { useToast } from '@acer-academy-learning/common-ui';

import {
  createSession,
  deleteSession,
  updateSession,
} from '@acer-academy-learning/data-access';

import './CalendarView.css';

interface EventFormProps {
  session: SessionData;
  fetchSessions: () => Promise<void>;
  onClose: () => void;
}

export default function EventForm({
  session,
  fetchSessions,
  onClose,
}: EventFormProps) {
  const [sessionData, setSessionData] = useState({
    ...session,
  });
  //   console.log(session);

  enum LevelEnum {
    P1 = 'P1',
    P2 = 'P2',
    P3 = 'P3',
    P4 = 'P4',
    P5 = 'P5',
    P6 = 'P6',
    S1 = 'S1',
    S2 = 'S2',
    S3 = 'S3',
    S4 = 'S4',
    S5 = 'S5',
    J1 = 'J1',
    J2 = 'J2',
  }

  enum SubjectEnum {
    MATHEMATICS = 'MATHEMATICS',
    ENGLISH = 'ENGLISH',
    SCIENCE = 'SCIENCE',
  }

  const subjects = [
    { id: 'english', label: 'English', value: 'ENGLISH' },
    { id: 'science', label: 'Science', value: 'SCIENCE' },
    { id: 'math', label: 'Math', value: 'MATHEMATICS' },
    // add more subjects as needed
  ];

  const levels = [
    ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    ['S1', 'S2', 'S3', 'S4', 'S5'],
    ['J1', 'J2'],
    // add more rows as needed
  ];

  const { displayToast, ToastType } = useToast();
  const [centres, setCentres] = useState<CentreData[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [selectedCentre, setSelectedCentre] = useState(
    session.classroom?.centreId || '',
  );
  const [selectedClassroom, setSelectedClassroom] = useState(
    session.classroomId || '',
  );

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    session.subjects || [],
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    session.levels || [],
  );

  const { user } = useAuth<Teacher>();

  const label = session?.id ? 'Update' : 'Create';

  useEffect(() => {
    setSessionData({ ...session });
  }, [session]);

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const response = await getAllCentres();
        const allCentres: CentreData[] = response.data;
        setCentres(allCentres);
      } catch (err) {
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchCentres();
  }, []);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await getClassroomsByCentre(selectedCentre);
        const allClassrooms: ClassroomData[] = response.data;
        setClassrooms(allClassrooms);
      } catch (err) {
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchClassrooms();
  }, [selectedCentre]);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((subj) => subj !== subject)
        : [...prevSubjects, subject],
    );
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prevLevels) =>
      prevLevels.includes(level)
        ? prevLevels.filter((lvl) => lvl !== level)
        : [...prevLevels, level],
    );
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await deleteSession(sessionId);

      console.log(response);
      if (response.status === 200) {
        console.log('deleted successfully');
        await fetchSessions();
        onClose();
      }
    } catch (err) {
      // setError(err);
    } finally {
      // setLoading(false);
    }
  };

  // Update selectedSubjects and selectedLevels when session changes
  useEffect(() => {
    setSelectedSubjects(session.subjects || []);
    setSelectedLevels(session.levels || []);
    setSelectedCentre(session.classroom?.centreId || '');
    setSelectedClassroom(session.classroomId || '');
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const levelEnumArray: LevelEnum[] = selectedLevels
      .filter((level) => level in LevelEnum)
      .map((level) => LevelEnum[level as keyof typeof LevelEnum]);

    const subjectEnumArray: SubjectEnum[] = selectedSubjects
      .filter((subject) => subject in SubjectEnum)
      .map((subject) => SubjectEnum[subject as keyof typeof SubjectEnum]);

    const createSessionData = {
      id: session.id,
      start: sessionData.start,
      levels: levelEnumArray,
      subjects: subjectEnumArray,
      classroomId: selectedClassroom,
      end: sessionData.end,
      teacherId: user.id,
      classId: null,
    };

    console.log('createSessionData');
    console.log(createSessionData);

    if (!session.id) {
      const response = await createSession(createSessionData);
      if (response) {
        console.log('created obj');
      }
      await fetchSessions();
      displayToast('Session created successfully!', ToastType.SUCCESS);
    } else {
      const response = await updateSession(session.id, createSessionData);
      if (response) {
        console.log('updated data');
      }
      await fetchSessions();
      displayToast('Session updated successfully!', ToastType.SUCCESS);
    }
  };

  return (
    <div className="modal">
      <div>
        <div className="p-10 rounded-xl bg-white w-full">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl mb-4">{label} a session</h2>
            </div>
            <div>
              <button
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                onClick={onClose}
                aria-label="close"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block w-1/4 text-sm font-medium leading-6 text-gray-900">
                Start Time
              </label>
              <DatePicker
                onChange={(date) =>
                  setSessionData({ ...sessionData, start: date })
                }
                selected={new Date(sessionData.start)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-[300px] block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-1/2">
              <label className="block w-1/4 text-sm font-medium leading-6 text-gray-900">
                End Time
              </label>
              <DatePicker
                onChange={(date) =>
                  setSessionData({ ...sessionData, end: date })
                }
                selected={new Date(sessionData.end)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-[300px] block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="location"
                className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
              >
                Location
              </label>
              <select
                id="location"
                name="location"
                required
                value={selectedCentre}
                onChange={(e) => setSelectedCentre(e.target.value)}
                className="mt-2 block w-3/4 space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  Select a centre
                </option>
                {centres.map((centre, index) => (
                  <option key={index} value={centre.id}>
                    {centre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="classroom"
                className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
              >
                Classroom
              </label>
              <select
                id="classroom"
                name="classroom"
                required
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="mt-2 block w-3/4 space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  Select a classroom
                </option>
                {classrooms.map((classroom, index) => (
                  <option key={index} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <label
              htmlFor="levels"
              className="block w-1/4 mt-2 text-sm font-medium leading-6 text-gray-900"
            >
              Levels
            </label>
            <div className="w-3/4 mt-2 flex flex-col space-y-4 pl-3">
              {levels.map((row, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4 justify-start">
                  {row.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => handleLevelChange(level)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="ml-2 text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center mt-6">
            <label
              htmlFor="subjects"
              className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
            >
              Subjects
            </label>
            <div className="w-3/4 flex flex-col space-y-2 pl-3">
              <div className="flex space-x-4">
                {subjects.map((subject) => (
                  <label key={subject.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.value)}
                      onChange={() => handleSubjectChange(subject.value)}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="ml-2 text-gray-700">{subject.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            {session.id && (
              <div>
                <button
                  className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  Delete
                </button>
              </div>
            )}

            <button
              type="button"
              className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
              onClick={handleSubmit}
            >
              {label}
            </button>
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
