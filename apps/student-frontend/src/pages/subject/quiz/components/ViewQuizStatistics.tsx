import {
  GenericHighChart,
  Spinner,
  classNames,
  useAuth,
} from '@acer-academy-learning/common-ui';
import { getQuizStatisticsForStudent } from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { useParams } from 'react-router-dom';

enum Duration {
  PAST_FOURTEEN_DAYS = 'Past 2 Weeks',
  PAST_THREE_MONTHS = 'Past 3 Months',
  PAST_YEAR = 'Past Year',
  ALL = 'All',
}

const getExactDateDaysBefore = (data: {
  days: number;
  date: Date;
  toMidnight?: boolean;
}) => {
  const pastDate = new Date(
    data.date.getTime() - data.days * 24 * 60 * 60 * 1000,
  );
  if (data.toMidnight) {
    pastDate.setHours(0, 0, 0, 0);
  }

  return pastDate;
};

// Helper function to check for a leap year
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const ViewQuizStatistics = () => {
  const { user } = useAuth<Student>();
  const { quizId } = useParams();
  const [currentDuration, setCurrenDuration] = useState<Duration>(Duration.ALL);
  const startDate = useMemo(() => {
    // Get current date
    const currentDate = new Date();
    switch (currentDuration) {
      case Duration.PAST_FOURTEEN_DAYS: {
        return getExactDateDaysBefore({
          days: 14,
          date: currentDate,
          toMidnight: true,
        }).toISOString();
      }
      case Duration.PAST_THREE_MONTHS: {
        return getExactDateDaysBefore({
          days: 90,
          date: currentDate,
          toMidnight: true,
        }).toISOString();
      }
      case Duration.PAST_YEAR: {
        const oneYearAgo = new Date(currentDate);
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
        // Check for leap year edge case. If currentDate is Feb 29 and the previous year is not a leap year, this will adjust to Feb 28.
        if (
          currentDate.getMonth() === 1 &&
          currentDate.getDate() === 29 &&
          !isLeapYear(oneYearAgo.getFullYear())
        ) {
          oneYearAgo.setDate(28);
        }
        return oneYearAgo.toISOString();
      }
      default:
        break;
    }
  }, [currentDuration]);
  const { data: quizStats, isLoading } = useQuery(
    ['student-quiz', user, quizId, startDate],
    async () => {
      if (user && quizId) {
        const res = await getQuizStatisticsForStudent({
          quizId: quizId,
          studentId: user.id,
          startDate: startDate,
        });
        return res.data;
      }
    },
  );

  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Quiz Performance',
      },
      xAxis: {
        type: 'datetime',
        min: startDate ? new Date(startDate).getTime() : null,
      },
      yAxis: {
        title: {
          text: 'Score',
        },
      },
      series: [
        {
          name: 'Quiz Performance',
          type: 'spline',
          data: quizStats?.takes.map(({ attemptedAt, marks }) => [
            new Date(attemptedAt).getTime(),
            marks,
          ]),
        },
      ],
      lang: {
        noData: 'No data to display',
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#666666',
        },
      },
    }),
    [quizStats, startDate],
  );

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="w-full bg-white rounded flex flex-col">
      <Menu as="div" className="relative inline-block text-left self-end p-4">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {currentDuration}
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {Object.values(Duration).map((duration) => (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setCurrenDuration(duration)}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm w-full text-left',
                      )}
                    >
                      {duration}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <GenericHighChart options={options} />
    </div>
  );
};
