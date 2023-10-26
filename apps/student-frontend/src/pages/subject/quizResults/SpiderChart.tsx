import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

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
};

const SpiderChart = ({ subjectArr, averageScoreArr }: SpiderChartType) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      ticks: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const data = {
    labels: Object.values(subjectArr).map((subj) => subj.split('_').join(' ')),
    datasets: [
      {
        label: 'Mastery of Topics',
        data: averageScoreArr,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={data} options={options} />;
};

export default SpiderChart;
