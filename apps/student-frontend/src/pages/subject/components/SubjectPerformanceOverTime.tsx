import {
  GenericAccordion,
  GenericHighChart,
  useDebounceValue,
  useDurationStartDate,
} from '@acer-academy-learning/common-ui';
import { getSubjectWiseStatistics } from '@acer-academy-learning/data-access';
import { QuizQuestionTopicEnum } from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { DurationDropdown } from './DurationDropdown';

export const SubjectPerformanceOverTime = () => {
  const { subject } = useParams();
  const { data } = useQuery([subject], async () => {
    const res = await getSubjectWiseStatistics();
    console.log(res);
    return res.data;
  });
  const [selectedTopics, setSelectedTopics] = useState<QuizQuestionTopicEnum[]>(
    [],
  );

  useEffect(() => {
    console.log(data);
  }, [data]);
  const { startDate, currentDuration, setCurrenDuration, Duration } =
    useDurationStartDate();
  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: 'spline',
      },
      title: {
        text: `${subject?.charAt(0).toLocaleUpperCase()}${subject
          ?.slice(1)
          .toLocaleLowerCase()} Performance`,
      },
      xAxis: {
        type: 'datetime',
        min: startDate ? new Date(startDate).getTime() : null,
      },
      yAxis: {
        title: {
          text: 'Performance (in %)',
        },
        max: 100,
      },
      series: [
        {
          name: 'Quiz Performance',
          type: 'spline',
          // events: {
          //   click: function (event) {
          //     console.log('Clicked');
          //     console.log(event.point.meta);
          //   },
          // },
          data: data ?? [],
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
        position: {
          align: 'center',
        },
      },
    }),
    [data, startDate],
  );

  const debouncedSelectedTopics = useDebounceValue<QuizQuestionTopicEnum[]>(
    selectedTopics,
    300,
  );
  return (
    <GenericAccordion
      title="Performance Over Time"
      titleClassName="bg-student-primary-900 hover:bg-student-secondary-700 text-white"
      arrowClassName="text-white"
      content={
        <div className="border-gray-200 border-[1px] rounded-b">
          <div className="flex justify-end">
            <DurationDropdown
              Duration={Duration}
              currentDuration={currentDuration}
              setCurrenDuration={setCurrenDuration}
            />
          </div>

          <GenericHighChart options={options} />
        </div>
      }
    />
  );
};
