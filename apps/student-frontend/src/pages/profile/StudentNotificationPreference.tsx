import { useAuth, useToast } from '@acer-academy-learning/common-ui';
import {
  LevelEnum,
  SubjectEnum,
  getStudentById,
  updateNotificationPreference,
} from '@acer-academy-learning/data-access';
import {
  Centre,
  NotificationPreferenceUpdateData,
  Student,
} from 'libs/data-access/src/lib/types/student';
import { useQuery } from 'react-query';
import { retrieveCentres } from '../../api/centre';
import { useEffect, useMemo, useState } from 'react';

export const StudentNotificationPreference: React.FC = () => {
  const { displayToast, ToastType } = useToast();
  const { user } = useAuth<Student>();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCentres, setSelectedCentres] = useState<string[]>([]);
  const [hasUnsubscribed, setHasUnsubscribed] = useState(false);
  const [centres, setCentres] = useState<Centre[]>([]);

  const { isLoading, isError, data, error } = useQuery(['student', user], () =>
    getStudentById(user?.id ?? '').then((res) => {
      const notif = res.data.student.notificationPreference;
      setSelectedCentres(notif.centrePref);
      setSelectedSubjects(notif.subjectsPref);
      setSelectedLevels(notif.levelsPref);
      setSelectedCentres(notif.centrePref);
      setHasUnsubscribed(notif.isUnsubscribed);
    }),
  );

  const subjects = useMemo(
    () =>
      Object.entries(SubjectEnum).map(([key, value]) => ({
        id: key.toLowerCase(),
        label: key.charAt(0).toUpperCase() + key.toLowerCase().slice(1),
        value: value,
      })),
    [],
  );

  const levels = useMemo(
    () =>
      Object.entries(LevelEnum).map(([key, value]) => ({
        id: key.toLowerCase(),
        label: value,
        value: value,
      })),
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // retrieve teachers
        const data = await retrieveCentres();
        setCentres(data);
      } catch (err) {
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((subj) => subj !== subject)
        : [...prevSubjects, subject],
    );
  };

  const handleLevelChange = (targetLevel: string) => {
    setSelectedLevels((prevLevels) =>
      prevLevels.includes(targetLevel)
        ? prevLevels.filter((level) => level !== targetLevel)
        : [...prevLevels, targetLevel],
    );
  };

  const handleCentreChange = (targetCentreId: string) => {
    setSelectedCentres((prevCentreIds) =>
      prevCentreIds.includes(targetCentreId)
        ? prevCentreIds.filter((centreId) => centreId !== targetCentreId)
        : [...prevCentreIds, targetCentreId],
    );
  };

  const handleSaveChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      displayToast('Missing student', ToastType.ERROR);
      return;
    }

    const subjectEnumArray: SubjectEnum[] = selectedSubjects
      .filter((subject) => subject in SubjectEnum)
      .map((subject) => SubjectEnum[subject as keyof typeof SubjectEnum]);

    const levelEnumArray: LevelEnum[] = selectedLevels
      .filter((level) => level in LevelEnum)
      .map((level) => LevelEnum[level as keyof typeof LevelEnum]);

    const input: NotificationPreferenceUpdateData = {
      isUnsubscribed: hasUnsubscribed,
      subjectsPref: subjectEnumArray,
      levelsPref: levelEnumArray,
      centrePref: selectedCentres,
    };

    console.log(input);
    try {
      await updateNotificationPreference(user.id, input);
      displayToast('Preferences updated!', ToastType.SUCCESS);
    } catch (err) {
      displayToast(`${error}`, ToastType.ERROR);
    }
  };
  return (
    <div className="p-16">
      <form onSubmit={handleSaveChange}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              You can pick your notification preferences for new class slots via
              Whatsapp Business.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  By Subjects
                </legend>
                <div className="mt-6 space-y-6">
                  {subjects.map((subject) => (
                    <div className="relative flex gap-x-3" key={subject.id}>
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          checked={selectedSubjects.includes(subject.value)}
                          onChange={() => handleSubjectChange(subject.value)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <p className="text-gray-500">{subject.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  By Levels
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    {levels.map((level) => (
                      <div key={level.id}>
                        <div className="flex h-6 items-center">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            checked={selectedLevels.includes(level.value)}
                            onChange={() => handleLevelChange(level.value)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="text-sm leading-6">
                          <p className="text-gray-500">{level.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  By Centres
                </legend>
                <div className="mt-6 space-y-6">
                  {centres.map((centre) => (
                    <div className="relative flex gap-x-3" key={centre.id}>
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          checked={selectedCentres.includes(centre.id)}
                          onChange={() => handleCentreChange(centre.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <p className="text-gray-500">{centre.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Push Notifications
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-everything"
                      name="push-notifications"
                      type="radio"
                      checked={!hasUnsubscribed}
                      onChange={() => setHasUnsubscribed(false)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-everything"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Subscribed
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-email"
                      name="push-notifications"
                      checked={hasUnsubscribed}
                      onChange={() => setHasUnsubscribed(true)}
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Unsubscribed
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
