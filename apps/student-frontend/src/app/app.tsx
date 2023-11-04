// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  EnforceLoginStatePageWrapper,
  LayoutRole,
  PrimaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import StudentLogin from '../pages/entry/StudentLogin';
import StudentSignUp from '../pages/entry/StudentSignUp';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
// import { AuthWrapper } from '../auth/AuthContext';
import StudentAccount from '../pages/entry/StudentAccount';
import { StudentAuthWrapper } from '@acer-academy-learning/common-ui';
import StudentForgotPassword from '../pages/entry/StudentForgotPassword';
import StudentResetPassword from '../pages/entry/StudentResetPassword';
import 'react-toastify/dist/ReactToastify.css'; //
import {
  ACCOUNT,
  ASSIGNMENTS,
  BOOKING,
  BOOK_CLASSES,
  BUY_CREDITS,
  DASHBOARD,
  FORGOT_PASSWORD,
  LOGIN,
  NOTIFICATIONS,
  PAST_TRANSACTIONS,
  PROFILE,
  QUIZZES,
  RECORDINGS,
  RESET_PASSWORD,
  REWARDS,
  SETTINGS,
  SIGN_UP,
  SUBJECTS,
  VIEW_CLASSES,
  ZOOM_LINK,
  FAQ,
  TAKES,
  SUBJECT_MAIN,
  VIEW_QUIZ,
  ATTEMPT_QUIZ,
  QUIZ_RESULT,
  ATTEMPT_ADAPTIVE_QUIZ,
  VIEW_ADAPTIVE_QUIZ,
} from '../libs/routes';
import { ToastContainer } from 'react-toastify';
import { StudentNotificationPreference } from '../pages/profile/StudentNotificationPreference';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FaqPage } from '../pages/faq/FaqPage';
import { StudentProfile } from '../pages/profile/StudentProfile';
import TransactionManagement from '../pages/transaction/TransactionManagement';
import { CreditBundleManagement } from '../pages/creditBundle/CreditBundleManagement';
import { TakeViewAll } from '../pages/take/TakeViewAll';
import { Subjects } from '../pages/subject/Subjects';
import { Subject } from '../pages/subject/Subject';
import { ViewAllQuizzes } from '../pages/subject/quiz/ViewAllQuizzes';
import { ViewQuiz } from '../pages/subject/quiz/ViewQuiz';
import { AttemptQuiz } from '../pages/subject/quiz/AttemptQuiz';
import { QuizResult } from '../pages/subject/quizResults/QuizResult';
import {
  ACCOUNT_NAV,
  NAV_SECTIONS,
  ROUTES_WITHOUT_SIDEBAR,
} from '../libs/layout';
import { ViewAdaptiveQuiz } from '../pages/subject/quiz/ViewAdaptiveQuiz';
import { AttemptAdaptiveQuiz } from '../pages/subject/quiz/AttemptAdaptiveQuiz';
import CalendarPage from '../pages/calendar/CalendarPage';

export function App() {
  const queryClient = new QueryClient();
  return (
    <div className="h-full">
      <QueryClientProvider client={queryClient}>
        <StudentAuthWrapper>
          <ToastProvider>
            <ToastContainer />
            <Routes>
              <Route path={LOGIN} element={<StudentLogin />} />
              <Route path={SIGN_UP} element={<StudentSignUp />} />
              <Route
                path={FORGOT_PASSWORD}
                element={<StudentForgotPassword />}
              />
              <Route path={RESET_PASSWORD} element={<StudentResetPassword />} />
              <Route
                element={
                  <EnforceLoginStatePageWrapper redirectTo={LOGIN}>
                    <PrimaryLayout
                      navigationMenu={NAV_SECTIONS}
                      accountNavigation={ACCOUNT_NAV}
                      role={LayoutRole.Student}
                      routesWithoutSidebar={ROUTES_WITHOUT_SIDEBAR}
                    />
                  </EnforceLoginStatePageWrapper>
                }
              >
                <Route
                  path={DASHBOARD}
                  element={<div>Welcome to AcerTech!</div>}
                />
                <Route path={SUBJECTS}>
                  <Route path={SUBJECTS} element={<Subjects />} />
                  <Route path={SUBJECT_MAIN} element={<Subject />} />
                  <Route path={ASSIGNMENTS} element={<div>Home</div>} />
                  <Route path={TAKES} element={<TakeViewAll />} />
                  <Route path={QUIZZES}>
                    <Route path={QUIZZES} element={<ViewAllQuizzes />} />
                    <Route path={VIEW_QUIZ} element={<ViewQuiz />} />
                    <Route path={QUIZ_RESULT} element={<QuizResult />} />
                    <Route path={ATTEMPT_QUIZ} element={<AttemptQuiz />} />
                    <Route
                      path={VIEW_ADAPTIVE_QUIZ}
                      element={<ViewAdaptiveQuiz />}
                    />
                    <Route
                      path={ATTEMPT_ADAPTIVE_QUIZ}
                      element={<AttemptAdaptiveQuiz />}
                    />
                  </Route>
                  <Route path={RECORDINGS} element={<div>Home</div>} />
                  <Route path={ZOOM_LINK} element={<div>Home</div>} />
                </Route>
                <Route path={BOOKING}>
                  <Route path={VIEW_CLASSES} element={<CalendarPage />} />
                  <Route path={BOOK_CLASSES} element={<div>Home</div>} />
                  <Route
                    path={BUY_CREDITS}
                    element={<CreditBundleManagement />}
                  />
                  <Route
                    path={PAST_TRANSACTIONS}
                    element={<TransactionManagement />}
                  />
                </Route>
                <Route path={REWARDS} element={<div>Home</div>} />
                <Route path={ACCOUNT}>
                  <Route path={PROFILE} element={<StudentProfile />} />
                  <Route
                    path={NOTIFICATIONS}
                    element={<StudentNotificationPreference />}
                  />
                  <Route path={SETTINGS} element={<div>Home</div>} />
                  <Route path={FAQ} element={<FaqPage />} />
                </Route>
              </Route>
            </Routes>
          </ToastProvider>
        </StudentAuthWrapper>
        {/* <ToastProvider>
        <ToastContainer />
        <Routes>
        </Routes>
      </ToastProvider> */}
      </QueryClientProvider>
    </div>
  );
}

export default App;
