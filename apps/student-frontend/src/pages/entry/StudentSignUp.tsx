/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useMemo } from 'react';
import {
  AcerAcademyLogo,
  PublicPageWrapper,
} from '@acer-academy-learning/common-ui';
import { getAllCentres } from '@acer-academy-learning/data-access';
import { createStudent } from '@acer-academy-learning/data-access';
import { useToast } from '@acer-academy-learning/common-ui';
import { LevelEnum, SubjectEnum } from '@acer-academy-learning/data-access';
import { LOGIN } from '../../libs/routes';
import { useNavigate } from 'react-router-dom';
import { CentreData } from 'libs/data-access/src/lib/types/centre';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  additionalClasses?: string;
}

//Input field component
const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  additionalClasses,
}) => (
  <div className={`flex items-center space-x-4 ${additionalClasses}`}>
    <label
      htmlFor={id}
      className="w-1/4 text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      className={`w-3/4 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
    />
  </div>
);

interface ParentFieldsProps {
  label: string;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}

//Parent fields component
export const ParentFields: React.FC<ParentFieldsProps> = ({
  label,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
}) => (
  <>
    <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">
      {label}
    </h2>
    <InputField
      label="First Name"
      id={`${label}-firstName`}
      name="firstName"
      type="text"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      additionalClasses="mb-7"
    />
    <InputField
      label="Last Name"
      id={`${label}-lastName`}
      name="lastName"
      type="text"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      additionalClasses="mb-7"
    />
    <InputField
      label="Phone Number"
      id={`${label}-phoneNumber`}
      name="phoneNumber"
      type="number"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      additionalClasses="mb-7"
    />
  </>
);

export default function StudentSignUp() {
  const navigate = useNavigate();
  //used for displaying notification
  const { displayToast, ToastType } = useToast();

  //map it to subject json to display the subjects on the page
  const subjects = useMemo(
    () =>
      Object.entries(SubjectEnum).map(([key, value]) => ({
        id: key.toLowerCase(),
        label: key.charAt(0).toUpperCase() + key.toLowerCase().slice(1),
        value: value,
      })),
    [],
  );

  //student particulars
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [centres, setCentres] = useState<CentreData[]>([]);
  const [selectedCentre, setSelectedCentre] = useState('');

  //parent particualrs
  const [parent1FirstName, setParent1FirstName] = useState('');
  const [parent1LastName, setParent1LastName] = useState('');
  const [parent1PhoneNumber, setParent1PhoneNumber] = useState('');
  const [parent2FirstName, setParent2FirstName] = useState('');
  const [parent2LastName, setParent2LastName] = useState('');
  const [parent2PhoneNumber, setParent2PhoneNumber] = useState('');
  const [showParent2, setShowParent2] = useState(false);

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

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((subj) => subj !== subject)
        : [...prevSubjects, subject],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //map the selected subjects to SubjectEnum[]
    const subjectEnumArray: SubjectEnum[] = selectedSubjects
      .filter((subject) => subject in SubjectEnum)
      .map((subject) => SubjectEnum[subject as keyof typeof SubjectEnum]);

    //map the level to LevelEnum
    let selectedLevelEnum;
    if (selectedLevel! in LevelEnum) {
      selectedLevelEnum = LevelEnum[selectedLevel as keyof typeof LevelEnum];
    }

    //map the parents according to format of "parents": { "create":[{}, {}]} to create parents along withs tudent
    const parents = {
      create: [
        {
          firstName: parent1FirstName,
          lastName: parent1LastName,
          phoneNumber: parent1PhoneNumber,
        },
      ],
    };

    if (showParent2) {
      parents.create.push({
        firstName: parent2FirstName,
        lastName: parent2LastName,
        phoneNumber: parent2PhoneNumber,
      });
    }

    const payload = {
      email,
      firstName,
      lastName,
      phoneNumber,
      school,
      password,
      level: selectedLevelEnum!,
      subjects: subjectEnumArray,
      centreId: selectedCentre,
      parents: parents,
    };

    if (payload.subjects.length === 0) {
      displayToast('You need to select at least 1 subject', ToastType.ERROR);
      return;
    }

    if (password !== confirmPassword) {
      displayToast('Password do not match', ToastType.ERROR);
      return;
    }

    if (selectedCentre === '') {
      displayToast('You need to select a centre', ToastType.ERROR);
      return;
    }

    try {
      await createStudent(payload);
      displayToast('Account created!', ToastType.SUCCESS);
      navigate(LOGIN);
    } catch (error) {
      console.log(error);
      displayToast(`${error}`, ToastType.ERROR);
    }

    // Here, send the `payload` object to your server using fetch or axios
  };

  const resetParent2Fields = () => {
    setParent2FirstName('');
    setParent2LastName('');
    setParent2PhoneNumber('');
    setShowParent2(false);
  };

  return (
    <PublicPageWrapper strict>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <AcerAcademyLogo className="mx-auto h-20 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register a student account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">
            Student Particulars
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="firstName"
              label="First Name"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <InputField
              id="lastName"
              label="Last Name"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <InputField
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              id="password"
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              name="password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

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
                      <span className="ml-2 text-gray-700">
                        {subject.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="level"
                className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
              >
                Level
              </label>
              <select
                id="level"
                name="level"
                required
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="mt-2 block w-3/4 space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  Select a level
                </option>
                {Object.values(LevelEnum).map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              id="school"
              label="School"
              name="school"
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />

            <InputField
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                Parent Particulars
              </h2>

              {/* Parent 1 Fields */}
              {ParentFields({
                label: showParent2 ? 'Parent 1' : 'Parent',
                firstName: parent1FirstName,
                setFirstName: setParent1FirstName,
                lastName: parent1LastName,
                setLastName: setParent1LastName,
                phoneNumber: parent1PhoneNumber,
                setPhoneNumber: setParent1PhoneNumber,
              })}

              {/* Parent 2 Fields */}
              {showParent2 &&
                ParentFields({
                  label: 'Parent 2',
                  firstName: parent2FirstName,
                  setFirstName: setParent2FirstName,
                  lastName: parent2LastName,
                  setLastName: setParent2LastName,
                  phoneNumber: parent2PhoneNumber,
                  setPhoneNumber: setParent2PhoneNumber,
                })}

              {/* Button to add Parent 2 Fields */}
              <div className="mt-4">
                {!showParent2 ? (
                  <button
                    type="button"
                    onClick={() => setShowParent2(true)}
                    className="text-indigo-600"
                  >
                    + Add Another Parent
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetParent2Fields}
                    className="text-red-600"
                  >
                    - Remove Parent 2
                  </button>
                )}
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
    </PublicPageWrapper>
  );
}
