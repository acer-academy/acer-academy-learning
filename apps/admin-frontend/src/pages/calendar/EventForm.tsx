import { useState, useEffect } from 'react';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CentreData } from 'libs/data-access/src/lib/types/centre';
import { ClassroomData } from 'libs/data-access/src/lib/types/classroom';
import { Admin } from 'libs/data-access/src/lib/types/admin';
import { Teacher, TeacherData } from 'libs/data-access/src/lib/types/teacher';
import { useAuth } from '@acer-academy-learning/common-ui';
import {
  GenericBadge,
  GenericComboBox,
  useToast,
} from '@acer-academy-learning/common-ui';
import './CalendarView.css';
import { ClassFrequencyEnum } from '@prisma/client';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
  createRecurringClass,
  deleteRecurringClass,
  getAllCentres,
  getAllTeachers,
  getClassroomsByCentre,
  updateRecurringClass,
} from '@acer-academy-learning/data-access';
import {
  createSession,
  deleteSession,
  updateSession,
} from '@acer-academy-learning/data-access';
import { StudentData } from 'libs/data-access/src/lib/types/student';
import { getAllStudents as apiGetAllStudents } from '@acer-academy-learning/data-access';

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

  const areAllFieldsValidated = (errors: FormErrors) => {
    return Object.values(errors).every((value) => value === null);
  };

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

  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState(
    session.teacherId || '',
  );

  //remark
  const [allocatedStudents, setAllocatedStudents] = useState<string[]>(
    session.students ? session.students.map(student => student.id) : []
  );

  const { user } = useAuth<Admin>();

  const [sessionState, setSessionState] = useState({
    id: session.id,
    start: sessionData.start,
    levels: selectedLevels
      .filter((level) => level in LevelEnum)
      .map((level) => LevelEnum[level as keyof typeof LevelEnum]),
    subjects: selectedSubjects
      .filter((subject) => subject in SubjectEnum)
      .map((subject) => SubjectEnum[subject as keyof typeof SubjectEnum]),
    classroomId: selectedClassroom,
    end: sessionData.end,
    teacherId: selectedTeacher,
    classId: null,
    students: session.students
  });

  interface FormErrors {
    dateError: string | null;
    recurringEndDateError: string | null;
    selectedTeacher: string | null;
    selectedCentre: string | null;
    selectedClassroom: string | null;
    selectedLevels: string | null;
    selectedSubjects: string | null;
  }

  const [isRecurring, setIsRecurring] = useState(
    sessionData.class ? true : false,
  );
  const [recurringType, setRecurringType] = useState<ClassFrequencyEnum>(
    sessionData.class ? sessionData.class.frequency : ClassFrequencyEnum.DAILY,
  );
  const [recurringEndDate, setRecurringEndDate] = useState(
    sessionData.class
      ? new Date(sessionData.class?.endRecurringDate)
      : new Date(sessionData.end),
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [recurringState, setRecurringState] = useState({
    endRecurringDate: recurringEndDate,
    frequency: recurringType as ClassFrequencyEnum,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    dateError: null,
    recurringEndDateError: null,
    selectedTeacher: null,
    selectedCentre: null,
    selectedClassroom: null,
    selectedLevels: null,
    selectedSubjects: null,
  });

  const validateForm = () => {
    const newErrors = {
      ...formErrors, // retain any other previous errors not checked here
      dateError:
        sessionState.end <= sessionState.start
          ? 'Start date needs to be before end date'
          : null,
      recurringEndDateError:
        isRecurring && recurringState.endRecurringDate <= sessionState.end
          ? 'Recurring end date needs to be after end time date'
          : null,
      selectedTeacher: !selectedTeacher ? 'Teacher needs to be selected' : null,
      selectedCentre: !selectedCentre ? 'Centre needs to be selected' : null,
      selectedClassroom: !selectedClassroom
        ? 'Classroom needs to be selected'
        : null,
      selectedLevels:
        sessionState.levels.length === 0
          ? 'At least one level needs to be selected'
          : null,
      selectedSubjects:
        sessionState.subjects.length === 0
          ? 'At least one subject needs to be selected'
          : null,
    };

    return newErrors;
  };

  useEffect(() => {
    setRecurringState((prevState) => ({
      ...prevState,
      endRecurringDate: recurringEndDate,
      frequency: recurringType as ClassFrequencyEnum,
    }));
  }, [recurringEndDate, recurringType]);

  useEffect(() => {
    setSessionState((prevState) => ({
      ...prevState,
      start: sessionData.start,
      end: sessionData.end,
      levels: selectedLevels
        .filter((level) => level in LevelEnum)
        .map((level) => LevelEnum[level as keyof typeof LevelEnum]),
      subjects: selectedSubjects
        .filter((subject) => subject in SubjectEnum)
        .map((subject) => SubjectEnum[subject as keyof typeof SubjectEnum]),
      classroomId: selectedClassroom,
      teacherId: selectedTeacher,
      //students:allocatedStudents,
      // ... any other fields you want to watch
    }));
  }, [
    sessionData,
    selectedClassroom,
    selectedLevels,
    selectedSubjects,
    selectedTeacher,
    //allocatedStudents
  ]);

  const label = session?.id ? 'Update' : 'Create';

  useEffect(() => {
    setSessionData({ ...session });
  }, [session]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getAllTeachers();
        const teachers: TeacherData[] = response.data;
        setTeachers(teachers);
      } catch (err) {
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

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
      if (response.status === 200) {
        await fetchSessions();
        setShowDeleteModal(false);
        onClose();
        displayToast('Session deleted successfully!', ToastType.SUCCESS);
      }
    } catch (err) {
      // setError(err);
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteFutureSessions = async (classId: string) => {
    try {
      const response = await deleteRecurringClass(classId);
      if (response.status === 200) {
        await fetchSessions();
        setShowDeleteModal(false);
        onClose();
        displayToast(
          'Future sessions deleted successfully!',
          ToastType.SUCCESS,
        );
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
    setSelectedTeacher(session.teacherId || '');
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();

    setFormErrors(errors);

    //issue is that even tho it sets state in validateform function above for formErrors, it doesnt take the latest state why, do i need it to be async?

    areAllFieldsValidated(errors);

    if (!areAllFieldsValidated(errors)) {
      return;
    }

    if (!session.id) {
      if (!isRecurring) {
        try {
          const response = await createSession(sessionState, allocatedStudents);
          console.log(response)
          if (response) {
            onClose();
            await fetchSessions();
            displayToast('Session created successfully!', ToastType.SUCCESS);
          }
        } catch (err) {
          onClose();
          displayToast(`${err.response.data.error}`, ToastType.ERROR);
        }
      } else {
        try {
          const response = await createRecurringClass([
            recurringState,
            sessionState,
            allocatedStudents
          ]);
          if (response) {
            onClose();
            await fetchSessions();
            displayToast('Session created successfully!', ToastType.SUCCESS);
          }
        } catch (err) {
          onClose();
          displayToast(`${err.response.data.error}`, ToastType.ERROR);
        }
      }
    } else {
      if (!isRecurring) {
        await handleUpdateSession(session.id, sessionState);
      } else {
        setShowUpdateModal(true);
      }
    }
  };

  const handleUpdateSession = async (sessionId: string, sessionState: any) => {
    try {
      const initialStudents =  session.students ? session.students.map(student => student.id) : []
      const latestStudents = allocatedStudents
      const addStudentIdArr = latestStudents.filter(student => !initialStudents.includes(student));
      const removeStudentIdArr = initialStudents.filter(student => !latestStudents.includes(student));

      const {students, ...sessionStateWithoutStudents} = sessionState;

      const response = await updateSession(session.id, sessionStateWithoutStudents, addStudentIdArr, removeStudentIdArr);
      if (response) {
        onClose();
        await fetchSessions();
        displayToast('Session updated successfully!', ToastType.SUCCESS);
      }
    } catch (err) {
      console.log(err);
      onClose();
      displayToast(`${err.response.data.error}`, ToastType.ERROR);
    } finally {
      // setLoading(false);
    }
  };

  const handleUpdateFutureSessions = async (
    sessionId: string,
    classId: string,
  ) => {
    try {
      if (session.class) {

          // get original ids from session.students
      const initialStudents =  session.students ? session.students.map(student => student.id) : []
      // get latest student ids from allocatedStudents
      const latestStudents = allocatedStudents

      const addStudentIdArr = latestStudents.filter(student => !initialStudents.includes(student));
      const removeStudentIdArr = initialStudents.filter(student => !latestStudents.includes(student));
        //is recurring
        const response = await updateRecurringClass(sessionId, classId, [
          recurringState,
          sessionState,
          addStudentIdArr,
          removeStudentIdArr
        ]);
        if (response) {
          setShowUpdateModal(false);
          onClose();
          await fetchSessions();
          displayToast('Session updated successfully!', ToastType.SUCCESS);
        }
      }
    } catch (err) {
      onClose();
      displayToast(`${err.response.data.error}`, ToastType.ERROR);
    } finally {
      // setLoading(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const openUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const [allStudents, setAllStudents] = useState<StudentData[]>([]);

  const getAllStudents = async () => {
    try {
      const response = await apiGetAllStudents();
      const studentData = response.data;
      setAllStudents(studentData.students);
    } catch (error) {
      displayToast(
        'Students could not be retrieved from the server.',
        ToastType.ERROR,
      );
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <div className="modal">
      <div>
        <div className="p-10 rounded-xl bg-white w-full">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl mb-4">{label} a session</h2>
            </div>
            <div>
              <button onClick={onClose} className="ml-auto">
                <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
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

          {formErrors.dateError && (
            <div className="text-red-500">{formErrors.dateError}</div>
          )}

          <div className="mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="ml-2">Recurring Event</span>
            </label>

            {isRecurring && (
              <div className="mt-4">
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="recurringType"
                    className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
                  >
                    Recurring Type
                  </label>
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value)}
                    className="mt-2 block w-3/4 space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>
            )}

            {isRecurring && (
              <div className="mt-4">
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="recurringEndDate"
                    className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
                  >
                    Recurring End Date
                  </label>
                  <DatePicker
                    onChange={(date) => setRecurringEndDate(date)}
                    selected={recurringEndDate}
                    dateFormat="MMMM d, yyyy"
                    className="w-[450px] block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {formErrors.recurringEndDateError && (
                  <div className="text-red-500">
                    {formErrors.recurringEndDateError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="teacher"
                className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
              >
                Teacher
              </label>
              <select
                id="teacher"
                name="teacher"
                required
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="mt-2 block w-3/4 space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher, index) => (
                  <option key={index} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.selectedTeacher && (
              <div className="text-red-500">{formErrors.selectedTeacher}</div>
            )}
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
            {formErrors.selectedCentre && (
              <div className="text-red-500">{formErrors.selectedCentre}</div>
            )}
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
            {formErrors.selectedClassroom && (
              <div className="text-red-500">{formErrors.selectedClassroom}</div>
            )}
          </div>

          <div className="flex flex-wrap my-4 gap-4">
            {allocatedStudents.length > 0 ? (
              allStudents
                .filter((student) => allocatedStudents.includes(student.id))
                .map((student) => (
                  <div key={student.id}>
                    <GenericBadge
                      badge={`${student.firstName} ${student.lastName}`}
                      onRemove={() =>
                        setAllocatedStudents(
                          allocatedStudents.filter((id) => id !== student.id),
                        )
                      }
                    ></GenericBadge>
                  </div>
                ))
            ) : (
              <span className="text-gray-600 italic mx-2">
                No students have been allocated to this session yet.
              </span>
            )}
          </div>

          <GenericComboBox
            options={allStudents.map((student) => student.id)}
            onChange={(selectedIds) => setAllocatedStudents(selectedIds)}
            selected={allocatedStudents}
            displayValue={(id) => {
              const curr = allStudents.find((student) => student.id == id);
              return curr ? `${curr.firstName} ${curr.lastName}` : '';
            }}
          ></GenericComboBox>

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
            {formErrors.selectedLevels && (
              <div className="text-red-500">{formErrors.selectedLevels}</div>
            )}
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
            {formErrors.selectedSubjects && (
              <div className="text-red-500">{formErrors.selectedSubjects}</div>
            )}
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            {session.id && (
              <div>
                <button
                  className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                  onClick={openDeleteModal}
                >
                  Delete
                </button>
              </div>
            )}

            {showDeleteModal && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md w-1/3 flex flex-col items-center">
                  <button onClick={closeDeleteModal} className="ml-auto">
                    <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  </button>
                  {isRecurring ? (
                    <>
                      <p className="mb-4 text-center">
                        Do you want to delete the session or future sessions?
                      </p>
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                        >
                          Delete session
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFutureSessions(session.class?.id)
                          }
                          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                        >
                          Delete future sessions
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mb-4 text-center">
                        Confirm you want to delete session?
                      </p>
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                        >
                          Yes
                        </button>
                        <button
                          onClick={closeDeleteModal}
                          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                        >
                          No
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {showUpdateModal && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md w-1/3 flex flex-col items-center">
                  <button onClick={closeUpdateModal} className="ml-auto">
                    <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  </button>
                  <p className="mb-4 text-center">
                    Do you want to update the session or future sessions?
                  </p>
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateSession(session.id, sessionState)
                      }
                      className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                    >
                      Update session
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateFutureSessions(
                          session.id,
                          session.class?.id,
                        )
                      }
                      className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                    >
                      Update future sessions
                    </button>
                  </div>
                </div>
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
