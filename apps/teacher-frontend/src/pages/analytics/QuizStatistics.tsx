import {
  BackButton,
  GenericButton,
  useToast,
} from '@acer-academy-learning/common-ui';
import {
  ConsolidatedQuizStatistics,
  getQuizStatisticsByQuizId,
} from '@acer-academy-learning/data-access';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StatisticsSummaryRow } from './components/StatisticsSummaryRow';
import { BellcurveChart } from './components/BellcurveChart';
import { BoxWhiskerChart } from './components/BoxWhiskerChart';
import {
  ChartPieIcon,
  PresentationChartBarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { QuizQuestionStatistics } from './components/QuizQuestionStatistics';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  VIEW_QUIZ_ANALYTICS_ITEMS_HASH,
  VIEW_QUIZ_ANALYTICS_STUDENTS_HASH,
} from '../../libs/routes';
import { QuizStudentMasquerade } from './components/QuizStudentMasquerade';

export const QuizStatistics: React.FC = () => {
  const { quizId } = useParams();
  const { displayToast, ToastType } = useToast();
  const [quizStats, setQuizStats] = useState<ConsolidatedQuizStatistics>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (quizId) {
      getQuizStatisticsByQuizId(quizId)
        .then((res) => {
          setQuizStats(res.data);
        })
        .catch((error: any) => {
          displayToast(
            'Quiz statistics could not be retrieved from the server: ' +
              error.message,
            ToastType.ERROR,
          );
        });
    }
  }, [quizId]);

  const currentTabComponent = useMemo(() => {
    if (!quizStats || quizStats.totalMarksArr.length == 0)
      return (
        <div className="flex justify-center my-auto text-gray-700 italic text-center">
          No statistics to show - this quiz has not been attempted yet.
        </div>
      );
    switch (location.hash.slice(1)) {
      case VIEW_QUIZ_ANALYTICS_STUDENTS_HASH:
        return <QuizStudentMasquerade quizStats={quizStats} />;
      case VIEW_QUIZ_ANALYTICS_ITEMS_HASH:
        return (
          <div className="flex flex-col gap-4">
            {quizStats.quizQuestions.map((question) => (
              <div id={question.quizQuestionId}>
                <QuizQuestionStatistics quizQuestion={question} />
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div>
            <StatisticsSummaryRow
              quizStats={quizStats}
              totalMarksArr={quizStats.totalMarksArr}
              totalMarksPossible={quizStats.quizDetails.totalMarks}
            />
            {quizStats.totalMarksArr.length > 1 ? (
              <>
                <BoxWhiskerChart
                  totalMarksArr={quizStats.totalMarksArr}
                  totalMarksPossible={quizStats.quizDetails.totalMarks ?? 0}
                />
                <BellcurveChart
                  totalMarksArr={quizStats.totalMarksArr}
                  totalMarksPossible={quizStats.quizDetails.totalMarks ?? 0}
                />
              </>
            ) : (
              <div className="flex justify-center mt-40 text-gray-700 italic text-center">
                {`Boxplot and Bellcurve can only be shown for quizzes with 2 or more attempts.`}
              </div>
            )}
          </div>
        );
    }
  }, [location, quizStats]);

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div>
        <BackButton />
      </div>
      <div className="flex gap-2 text-2xl py-1 mb-5 font-bold tracking-tight items-center">
        {quizStats?.quizDetails.title}
        <GenericButton
          className="ml-auto"
          text="Overview"
          icon={<PresentationChartBarIcon className="h-5" />}
          onClick={() => {
            navigate('', { replace: true });
          }}
        ></GenericButton>
        <GenericButton
          text="Item Analysis"
          icon={<ChartPieIcon className="h-5" />}
          onClick={() => {
            navigate('#items', { replace: true });
          }}
        ></GenericButton>
        <GenericButton
          text="Student Analysis"
          icon={<UsersIcon className="h-5" />}
          onClick={() => {
            navigate('#students', { replace: true });
          }}
        ></GenericButton>
      </div>
      {currentTabComponent}
    </div>
  );
};
