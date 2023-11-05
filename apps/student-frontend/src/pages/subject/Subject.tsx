import { useAuth } from '@acer-academy-learning/common-ui';
import { getOverallSpiderChartForStudent } from '@acer-academy-learning/data-access';
import { Student } from 'libs/data-access/src/lib/types/student';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import SpiderChart from './quizResults/SpiderChart';

export const Subject = () => {
  const { subject } = useParams();
  const { data } = useQuery(['spider-chart', subject], async () => {
    if (subject) {
      const res = await getOverallSpiderChartForStudent();
      return res.data;
    }
  });
  return (
    <div className="h-full">
      {data && (
        <SpiderChart
          subjectArr={data.labelsArr}
          averageScoreArr={data.dataArr}
        />
      )}
    </div>
  );
};
