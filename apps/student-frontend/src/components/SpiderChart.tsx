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
import { QuizQuestionTopicEnum } from '@acer-academy-learning/data-access';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const data = {
  labels: Object.values(QuizQuestionTopicEnum).map((a) =>
    a.split('_').join(' '),
  ),
  datasets: [
    {
      label: 'Mastery of Topics',
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

export default function SpiderChart() {
  return <Radar data={data} />;
}
