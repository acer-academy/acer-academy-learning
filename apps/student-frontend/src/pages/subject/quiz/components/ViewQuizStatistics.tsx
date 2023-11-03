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
  TODAY = 'Today',
  THIS_WEEK = 'This Week',
  THIS_MONTH = 'This Month',
  THIS_YEAR = 'This Year',
  ALL = 'All',
}

export const ViewQuizStatistics = () => {
  const { user } = useAuth<Student>();
  const { quizId } = useParams();
  const [currentDuration, setCurrenDuration] = useState<Duration>(Duration.ALL);
  const datesToShow = useMemo(() => {
    // Get current date
    const currentDate = new Date();
    const newStartDate = new Date(currentDate);
    const newEndDate = new Date(currentDate);
    switch (currentDuration) {
      case Duration.TODAY: {
        newStartDate.setHours(0, 0, 0, 0);
        newEndDate.setHours(23, 59, 59, 999);
        return {
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        };
      }
      case Duration.THIS_WEEK: {
        const dayOfWeek = newStartDate.getDay();
        const startOfWeek = new Date(
          newStartDate.setDate(newStartDate.getDate() - dayOfWeek),
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const daysToAdd = 6 - dayOfWeek;
        const endOfWeek = new Date(
          newEndDate.getFullYear(),
          newEndDate.getMonth(),
          newEndDate.getDate() + daysToAdd,
          23,
          59,
          59,
          999,
        );

        return {
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString(),
        };
      }
      case Duration.THIS_MONTH: {
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        startOfMonth.setHours(0, 0, 0, 0);
        const startOfNextMonth = new Date(
          newEndDate.getFullYear(),
          newEndDate.getMonth() + 1,
          1,
        );
        const endOfMonth = new Date(startOfNextMonth.getTime() - 1);
        return {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString(),
        };
      }
      case Duration.THIS_YEAR: {
        const currentYear = currentDate.getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        const startOfNextYear = new Date(currentYear + 1, 0, 1);
        const endOfYear = new Date(startOfNextYear.getTime() - 1);
        return {
          startDate: startOfYear.toISOString(),
          endDate: endOfYear.toISOString(),
        };
      }
      default:
        break;
    }
  }, [currentDuration]);
  const { data: quizStats, isLoading } = useQuery(
    ['student-quiz', user, quizId, datesToShow],
    async () => {
      if (user && quizId) {
        const res = await getQuizStatisticsForStudent({
          quizId: quizId,
          studentId: user.id,
          startDate: datesToShow?.startDate,
          endDate: datesToShow?.endDate,
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
        min: datesToShow ? new Date(datesToShow.startDate).getTime() : null,
        max: datesToShow ? new Date(datesToShow.endDate).getTime() : null,
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
    [quizStats, datesToShow],
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
