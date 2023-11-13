/* eslint-disable @typescript-eslint/no-this-alias */
import {
  Divider,
  GenericAccordion,
  GenericBadges,
  GenericButton,
  GenericComboBox,
  GenericHighChart,
  getSubjectEnumFromPathParam,
  screamingSnakeToTitleCase,
  useDebounceValue,
  useDurationStartDate,
  useToast,
} from '@acer-academy-learning/common-ui';
import {
  CustomHighChartsPoint,
  CustomSeriesOptionsType,
  QuizQuestionTopicEnum,
  SubjectEnum,
  getSubjectWiseStatistics,
} from '@acer-academy-learning/data-access';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { DurationDropdown } from './DurationDropdown';
import { QuestionsAnalysisForTopic } from './QuestionsAnalysisForTopic';

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
  const [selectedDataPoint, setSelectedDataPoint] =
    useState<CustomHighChartsPoint>();
  const debouncedSelectedTopics = useDebounceValue<QuizQuestionTopicEnum[]>(
    selectedTopics,
    300,
  );
  const { data } = useQuery([subject, debouncedSelectedTopics], async () => {
    const subjectEnum = getSubjectEnumFromPathParam(subject ?? '');
    if (subjectEnum) {
      const res = await getSubjectWiseStatistics({
        topics: debouncedSelectedTopics,
        subject: subjectEnum,
      });
      const chartData: Array<CustomSeriesOptionsType> = Object.keys(
        res.data,
      ).map((key) => ({
        name: `${
          Object.values(SubjectEnum).includes(key as SubjectEnum)
            ? `Overall ${screamingSnakeToTitleCase(key)}`
            : screamingSnakeToTitleCase(key)
        }`,
        type: 'spline',
        data: res.data[key],
        marker: {
          enabled: true,
        },
        point: {
          events: {
            click: function () {
              const currentPoint = this as CustomHighChartsPoint;
              if (
                currentPoint.metaData &&
                !Object.values(SubjectEnum).includes(key as SubjectEnum)
              ) {
                setSelectedDataPoint(currentPoint);
              }
            },
            mouseOver: function () {
              if (
                this.graphic &&
                !Object.values(SubjectEnum).includes(key as SubjectEnum)
              ) {
                this.graphic.element.style.cursor = 'pointer';
              }
            },
            mouseOut: function () {
              if (this.graphic) {
                this.graphic.element.style.cursor = 'default';
              }
            },
          },
        },
      }));
      return chartData;
    }
  });

  const { startDate, currentDuration, setCurrenDuration, Duration } =
    useDurationStartDate();
  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: 'spline',
      },
      plotOptions: {
        spline: {
          clip: false,
        },
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
        max: 100,
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
        <div className="border-gray-200 border-[1px] rounded-b p-4 flex flex-col">
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
          {selectedTopics.length > 0 && (
            <>
              <Divider
                containerClassName="my-4"
                lineClassName="border-gray-900"
              />
              <QuestionsAnalysisForTopic
                metaData={selectedDataPoint?.metaData}
              />
            </>
          )}
        </div>
      }
    />
  );
};
