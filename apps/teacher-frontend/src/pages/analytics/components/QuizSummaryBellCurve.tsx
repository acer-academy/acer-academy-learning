import React from 'react';
import { ConsolidatedQuizStatistics } from '@acer-academy-learning/data-access';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import bellcurve from 'highcharts/modules/histogram-bellcurve';

bellcurve(Highcharts);

export const QuizSummaryBellCurve: React.FC<{
  quizStats: ConsolidatedQuizStatistics;
}> = (props) => {
  const data = props.quizStats.totalMarksArr;
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const stdDeviation = Math.sqrt(
    data.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      (data.length - 1),
  );

  const stdDeviationLines = [-2, -1, 0, 1, 2];
  const deviationLineSeries = stdDeviationLines.map((numDeviations) => ({
    name: `${numDeviations}σ`,
    type: 'line',
    data: [
      [mean + numDeviations * stdDeviation, 0],
      [mean + numDeviations * stdDeviation, 0.2],
    ],
    marker: {
      enabled: false,
    },
    enableMouseTracking: false,
    states: {
      hover: {
        lineWidthPlus: 0,
      },
    },
  }));

  const options = {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    title: {
      text: ' ',
    },
    xAxis: {
      title: {
        text: 'Scores',
      },
    },
    yAxis: {
      title: {
        text: 'Probability',
      },
      min: 0,
      max: 0.2,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: 'Bell curve',
        type: 'bellcurve',
        baseSeries: 1,
        zIndex: -1,
        showInLegend: false,
      },
      {
        name: 'Data',
        data: data,
        showInLegend: false,
      },
      ...deviationLineSeries,
    ],
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="ml-10 text-gray-700 text-base font-light">
        Bell Curve
      </span>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
