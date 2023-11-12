import {
  GenericAccordion,
  GenericBadges,
  GenericButton,
  GenericComboBox,
  GenericHighChart,
  screamingSnakeToTitleCase,
  useDebounceValue,
  useDurationStartDate,
} from '@acer-academy-learning/common-ui';
import {
  QuizQuestionTopicEnum,
  getSubjectWiseStatistics,
} from '@acer-academy-learning/data-access';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { DurationDropdown } from './DurationDropdown';
import { SeriesOptionsType } from 'highcharts';

const topics = Object.values(QuizQuestionTopicEnum);

export const SubjectMasteryOverTime = () => {
  const { subject } = useParams();
  const formattedSubject = useMemo(
    () =>
      `${subject?.charAt(0).toLocaleUpperCase()}${subject
        ?.slice(1)
        .toLocaleLowerCase()}`,
    [subject],
  );
  const [selectedTopics, setSelectedTopics] = useState<QuizQuestionTopicEnum[]>(
    [],
  );
  const debouncedSelectedTopics = useDebounceValue<QuizQuestionTopicEnum[]>(
    selectedTopics,
    300,
  );
  const { data } = useQuery([subject, debouncedSelectedTopics], async () => {
    const res = await getSubjectWiseStatistics({
      topics: debouncedSelectedTopics,
    });
    console.log(res);
    const chartData: Array<SeriesOptionsType> = Object.keys(res.data).map(
      (key) => ({
        name: `${
          key === 'subject'
            ? `Overall ${formattedSubject}`
            : screamingSnakeToTitleCase(key)
        }`,
        type: 'spline',
        data: res.data[key],
      }),
    );
    return chartData;
  });

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
        text: `${formattedSubject} Mastery`,
      },
      xAxis: {
        type: 'datetime',
        min: startDate ? new Date(startDate).getTime() : null,
      },
      yAxis: {
        title: {
          text: 'Performance (in %)',
        },
        max: 110,
        min: 0,
      },
      series: data,
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
    [data, startDate, formattedSubject],
  );

  return (
    <GenericAccordion
      title="Mastery Over Time"
      titleClassName="bg-student-primary-900 hover:bg-student-secondary-700 text-white"
      arrowClassName="text-white"
      contentClassName="rounded-b"
      content={
        <div className="border-gray-200 border-[1px] rounded-b">
          <div className="px-2 pb-8">
            <div className="flex justify-between py-4">
              <span className="text-base font-semibold">Filter Topics:</span>
              <GenericButton
                className="bg-student-primary-900 hover:bg-student-secondary-700"
                text="Reset"
                onClick={() => setSelectedTopics([])}
              />
            </div>
            <GenericBadges
              badges={selectedTopics}
              onChange={(topics) => setSelectedTopics(topics)}
              allowRemove
              getDisplayValue={(topic) => screamingSnakeToTitleCase(topic)}
            />
            <GenericComboBox
              inputStyle="focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-student-primary-900"
              optionActiveStyle="bg-student-primary-900 text-white"
              options={topics}
              displayValue={(topic) => screamingSnakeToTitleCase(topic)}
              selected={selectedTopics}
              onChange={(topics) => setSelectedTopics(topics)}
            />
          </div>
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
