import {
  QuizQuestionTopicEnum,
  getOverallSpiderChartForStudent,
} from '@acer-academy-learning/data-access';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import SpiderChart from '../quizResults/SpiderChart';
import {
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
    <div className="bg-white p-4 rounded flex flex-col h-full">
      <div className="px-2 pb-8">
        <div className="flex justify-between py-4">
          <span className="text-base font-semibold">Filter Topics:</span>
          <GenericButton text="Reset" onClick={() => setSelectedTopics([])} />
        </div>
        <GenericBadges
          badges={selectedTopics}
          onChange={(topics) => setSelectedTopics(topics)}
          allowRemove
          getDisplayValue={(topic) => screamingSnakeToTitleCase(topic)}
        />
        <GenericComboBox
          options={topics}
          displayValue={(topic) => topic}
          selected={selectedTopics}
          onChange={(topics) => setSelectedTopics(topics)}
        />
      </div>
      <div className="flex-1">
        {data && (
          <SpiderChart
            subjectArr={data.labelsArr}
            averageScoreArr={data.dataArr}
          />
        )}
      </div>
    </div>
  );
};
