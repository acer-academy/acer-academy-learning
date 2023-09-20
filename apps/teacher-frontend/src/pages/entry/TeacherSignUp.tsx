import { AcerAcademyLogo } from '@acer-academy-learning/common-ui';
import { retrieveCentres } from '../../api/centre';
import { useState, useEffect } from 'react';
import { registerTeacher } from '../../api/teacher';
import { useToast } from '@acer-academy-learning/common-ui';

export default function TeacherSignUp() {
  const { displayToast, ToastType } = useToast();

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

  interface Centre {
    id: string;
    name: string;
    address: string;
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [selectedCentre, setSelectedCentre] = useState('');

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const data = await retrieveCentres();
        setCentres(data);
      } catch (err) {
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchCentres();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const levelEnumArray: LevelEnum[] = selectedLevels
      .filter((level) => level in LevelEnum)
      .map((level) => LevelEnum[level as keyof typeof LevelEnum]);

    const subjectEnumArray: SubjectEnum[] = selectedSubjects
      .filter((subject) => subject in SubjectEnum)
      .map((subject) => SubjectEnum[subject as keyof typeof SubjectEnum]);

    const payload = {
      firstName,
      lastName,
      email,
      password,
      levels: levelEnumArray,
      subjects: subjectEnumArray,
      centreId: selectedCentre,
    };

    if (password !== confirmPassword) {
      displayToast('Password do not match', ToastType.ERROR);
      return;
    }

    if (selectedCentre === '') {
      displayToast('You need to select a centre', ToastType.ERROR);
      return;
    }

    try {
      await registerTeacher(payload);
      displayToast('Account created!', ToastType.SUCCESS);
    } catch (error: any) {
      displayToast(`${error}`, ToastType.ERROR);
    }

    // Here, send the `payload` object to your server using fetch or axios
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <AcerAcademyLogo className="mx-auto h-20 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register a teacher account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="firstName"
              className="w-1/4 text-sm font-medium leading-6 text-gray-900"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="lastName"
              className="w-1/4 text-sm font-medium leading-6 text-gray-900"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="email"
              className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="password"
              className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="confirmPassword"
              className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
            >
              Reconfirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

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

          <div className="flex items-center">
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

          <div className="flex items-center">
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

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Have an account?{' '}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
