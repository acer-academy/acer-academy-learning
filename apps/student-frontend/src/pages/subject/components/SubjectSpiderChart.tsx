import {
  QuizQuestionTopicEnum,
  getOverallSpiderChartForStudent,
} from '@acer-academy-learning/data-access';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import SpiderChart from '../quizResults/SpiderChart';
import {
  GenericAccordion,
  GenericBadges,
  GenericButton,
  GenericComboBox,
  screamingSnakeToTitleCase,
  useDebounceValue,
} from '@acer-academy-learning/common-ui';

const topics = Object.values(QuizQuestionTopicEnum);

export const SubjectSpiderChart = () => {
  const { subject } = useParams();
  const [selectedTopics, setSelectedTopics] = useState<QuizQuestionTopicEnum[]>(
    [],
  );
  const debouncedSelectedTopics = useDebounceValue<QuizQuestionTopicEnum[]>(
    selectedTopics,
    300,
  );
  const { data } = useQuery(
    ['spider-chart', subject, debouncedSelectedTopics],
    async () => {
      if (subject) {
        const res = await getOverallSpiderChartForStudent({
          topics: debouncedSelectedTopics,
        });
        return res.data;
      }
    },
  );

  return (
    <GenericAccordion
      title="Spider Chart Analysis"
      titleClassName="bg-student-primary-900 hover:bg-student-secondary-700 text-white"
      contentClassName="h-full"
      arrowClassName="text-white"
      content={
        <div className="bg-white p-4 rounded-b flex flex-col h-full shadow-md border-gray-200 border-[1px]">
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
          <div className="flex-1">
            {data && (
              <SpiderChart
                backgroundColor="rgba(14, 165, 233, 0.2)"
                borderColor="rgba(14, 165, 233, 1)"
                subjectArr={data.labelsArr}
                averageScoreArr={data.dataArr}
              />
            )}
          </div>
        </div>
      }
    />
  );
};
