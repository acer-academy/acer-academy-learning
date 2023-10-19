import { useEffect, useState } from 'react';
import { TestCalendar } from './TestCalendar';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import EventForm from './EventForm';
import {
  getAllCentres,
  getAllSessions,
  getAllTeachers,
  getClassroomsByCentre,
} from '@acer-academy-learning/data-access';
import { CentreData } from 'libs/data-access/src/lib/types/centre';
import { ClassroomData } from 'libs/data-access/src/lib/types/classroom';
import { TeacherData } from 'libs/data-access/src/lib/types/teacher';

export default function CalendarView() {
  const [session, setSession] = useState<SessionData>();
  const [sessions, setSessions] = useState<SessionData[]>([]); // Moved state here

  const [centres, setCentres] = useState<CentreData[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);

  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null,
  );
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

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
      if (selectedCentre === null) return;

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

  const fetchSessions = async () => {
    try {
      const response = await getAllSessions();
      let allSessions: SessionData[] = response.data;

      if (selectedCentre) {
        allSessions = allSessions.filter(
          (session) => session.classroom.centreId === selectedCentre,
        );
      }

      if (selectedClassroom) {
        allSessions = allSessions.filter(
          (session) => session.classroom.id === selectedClassroom,
        );
      }

      if (selectedTeacher) {
        allSessions = allSessions.filter(
          (session) => session.teacher.id === selectedTeacher,
        );
      }

      setSessions(allSessions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedCentre, selectedClassroom, selectedTeacher]);

  const sessionsData = sessions?.map((session) => ({
    start: new Date(session.start),
    end: new Date(session.end),
    data: { session },
  }));

  return (
    <div className="flex space-x-2 h-full">
      {/* Calendar */}

      <div className="bg-white p-2">
        <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
          Filters
        </h3>
        <div className="mt-4" role="combobox">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Centre:
          </label>
          <select
            id="location"
            name="location"
            required
            value={selectedCentre}
            onChange={(e) => {
              setSelectedCentre(e.target.value);
              setSelectedClassroom(null);
            }}
            className="mt-2 block space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">Select a centre</option>
            {centres.map((centre, index) => (
              <option key={index} value={centre.id}>
                {centre.name}
              </option>
            ))}
          </select>
        </div>
        {/* Classroom Filter */}
        <div className="mt-4" role="combobox">
          <label
            htmlFor="classroom"
            className="block text-sm font-medium text-gray-700"
          >
            Classroom:
          </label>
          <select
            id="classroom"
            name="classroom"
            required
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="mt-2 block space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">All</option>
            {classrooms.map((classroom, index) => (
              <option key={index} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>
        {/* Teacher Filter */}
        <div className="mt-4" role="combobox">
          <label
            htmlFor="teacher"
            className="block text-sm font-medium text-gray-700"
          >
            Teacher:
          </label>
          <select
            id="teacher"
            name="teacher"
            required
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="mt-2 block  space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="">All</option>
            {teachers.map((teacher, index) => (
              <option key={index} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-grow flex-basis-1/2 overflow-auto">
        {/* CentreFilter */}

        <TestCalendar
          onShowSessionView={(session) => setSession(session)}
          sessionsData={sessionsData}
        />
      </div>

      {/* EventForm */}
      <div className="flex-grow flex-basis-1/2">
        {session && (
          <EventForm
            session={session}
            fetchSessions={fetchSessions}
            onClose={() => setSession(null)} // Close the modal by setting session to null
          />
        )}
      </div>
    </div>
  );
}
