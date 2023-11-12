import {
  GenericHighChart,
  useDurationStartDate,
} from '@acer-academy-learning/common-ui';
import { getQuizStatisticsForStudent } from '@acer-academy-learning/data-access';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { DurationDropdown } from '../../components/DurationDropdown';

export const ViewQuizStatistics = () => {
  const { quizId } = useParams();
  const { startDate, currentDuration, setCurrenDuration, Duration } =
    useDurationStartDate();
  const { data: quizStats } = useQuery(
    ['student-quiz', quizId, startDate],
    async () => {
      if (quizId) {
        const res = await getQuizStatisticsForStudent({
          quizId: quizId,
          startDate: startDate,
        });
        const stats = res.data;
        stats.takes.sort((take, anotherTake) =>
          take.attemptedAt.localeCompare(anotherTake.attemptedAt),
        );
        return stats;
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
          data:
            quizStats?.takes.map(({ attemptedAt, marks }) => [
              new Date(attemptedAt).getTime(),
              marks,
            ]) ?? [],
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
    [quizStats, startDate],
  );

  return (
    <div className="w-full bg-white rounded flex flex-col">
      <DurationDropdown
        currentDuration={currentDuration}
        Duration={Duration}
        setCurrenDuration={setCurrenDuration}
      />
      <GenericHighChart options={options} />
    </div>
  );
};
