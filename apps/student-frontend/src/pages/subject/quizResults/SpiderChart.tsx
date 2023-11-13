import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useRef } from 'react';
import { Radar, getElementAtEvent } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export type SpiderChartType = {
  subjectArr: string[];
  averageScoreArr: number[];
  backgroundColor?: string;
  borderColor?: string;
  onClickHandler?: (elements: ReturnType<typeof getElementAtEvent>) => void;
};

const SpiderChart = ({
  subjectArr,
  averageScoreArr,
  backgroundColor,
  borderColor,
  onClickHandler,
}: SpiderChartType) => {
  const chartRef = useRef();
  const options: React.ComponentProps<typeof Radar>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        min: 0,
      },
    },
    hover: {
      mode: 'nearest',
    },
    onHover: (event, chartElements) => {
      if (event.native) {
        const canvasElement = event.native.target as HTMLCanvasElement;
        canvasElement.style.cursor = chartElements[0] ? 'pointer' : 'default';
      }
    },
  };

  const data = {
    labels: Object.values(subjectArr).map((subj) => subj.split('_').join(' ')),
    datasets: [
      {
        label: 'Mastery of Topics',
        data: averageScoreArr,
        backgroundColor: backgroundColor ?? 'rgba(255, 99, 132, 0.2)',
        borderColor: borderColor ?? 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const onClick: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (chartRef.current) {
      const elems = getElementAtEvent(chartRef.current, event);
      onClickHandler?.(elems);
    }
  };

  return (
    <Radar ref={chartRef} onClick={onClick} data={data} options={options} />
  );
};

export default SpiderChart;
