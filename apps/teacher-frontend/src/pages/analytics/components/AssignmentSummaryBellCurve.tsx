import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import bellcurve from 'highcharts/modules/histogram-bellcurve';
import React from 'react';

bellcurve(Highcharts);

export const AssignmentSummaryBellCurve: React.FC<{
  totalMarksArr: number[];
  assignmentTotalMarks: number;
}> = (props) => {
  const data = props.totalMarksArr;
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const stdDeviation = Math.sqrt(
    data.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      (data.length - 1),
  );
  const max = props.assignmentTotalMarks;

  const stdDeviationLines = [-2, -1, 0, 1, 2];
  const deviationLineSeries = stdDeviationLines.map((numDeviations) => ({
    name:
      numDeviations == 0
        ? 'Mean (μ)'
        : `μ${numDeviations > 0 ? '+' : ''}${numDeviations}σ`,
    type: 'line',
    data: [
      [mean + numDeviations * stdDeviation, 0],
      [mean + numDeviations * stdDeviation, 1],
    ],
    color:
      numDeviations === 0
        ? 'rgba(0,0,0,1)'
        : `rgba(0,0, 0, ${1 - Math.abs(numDeviations) * 0.35})`,
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

  function estimateMaxProbabilityDensity(numbers: number[]): number {
    if (numbers.length === 0) {
      return 0;
    }
    const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    const squaredDifferencesSum = numbers.reduce(
      (acc, val) => acc + (val - mean) ** 2,
      0,
    );
    const stdDev = Math.sqrt(squaredDifferencesSum / numbers.length);
    const maxProbabilityDensity = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    return maxProbabilityDensity;
  }

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
      min: mean - 3 * stdDeviation,
      max: mean + 3 * stdDeviation,
    },
    yAxis: {
      title: {
        text: 'Probability',
      },
      min: 0,
      max: estimateMaxProbabilityDensity(data),
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
