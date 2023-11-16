// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  EnforceLoginStatePageWrapper,
  LayoutRole,
  PrimaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import TeacherLogin from '../pages/entry/TeacherLogin';
import TeacherSignUp from '../pages/entry/TeacherSignUp';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TeacherAuthWrapper } from '@acer-academy-learning/common-ui';
import TeacherAccount from '../pages/entry/TeacherAccount';
import TeacherProfile from '../pages/profile/TeacherProfile';
import ChangePassword from '../pages/profile/ChangePassword';
import TeacherForgotPassword from '../pages/entry/TeacherForgotPassword';
import TeacherResetPassword from '../pages/entry/TeacherResetPassword';
import { QuestionBank } from '../pages/question-bank/QuestionBank';
import {
  ACCOUNT_NAV,
  NAV_SECTIONS,
  ROUTES_WITHOUT_SIDEBAR,
} from '../libs/layout';
import {
  ACCOUNT,
  ANALYTICS,
  CHANGE_PASSWORD,
  DASHBOARD,
  LOGIN,
  PROFILE,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SIGN_UP,
  SUBJECTS,
  QUESTION_BANK,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  SUBJECT_MAIN,
  CREATE_QUIZ,
  QUIZZES,
  VIEW_CLASSES,
  UPDATE_QUIZ,
  VIEW_QUIZ_ANALYTICS,
  QUIZ_ANALYTICS_MGMT,
  ASSIGNMENT_ANALYTICS_MGMT,
  VIEW_ASSIGNMENT_ANALYTICS,
  ASSIGNMENTS,
  VIEW_ASSIGNMENT,
  CREATE_ASSIGNMENT,
  EDIT_ASSIGNMENT,
  VIEW_ASSIGNMENT_ATTEMPTS,
  SESSIONS_FOR_ATTENDANCE,
  MARK_ATTENDANCE,
} from '../libs/routes';
import { CreateQuestion } from '../pages/question-bank/CreateQuestion';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UpdateQuestion } from '../pages/question-bank/UpdateQuestion';
import { Subjects } from '../pages/subjects/Subjects';
import { Subject } from '../pages/subjects/Subject';
import CalendarPage from '../pages/calendar/CalendarPage';
import { CreateQuiz } from '../pages/quiz/CreateQuiz';
import { QuizManagement } from '../pages/quiz/QuizManagement';
import { ModifyQuizWrapper } from '../pages/quiz/ModifyQuizWrapper';
import { QuizStatistics } from '../pages/analytics/QuizStatistics';
import { QuizStatisticsManagement } from '../pages/analytics/QuizStatisticsManagement';
import { AssignmentStatisticsManagement } from '../pages/analytics/AssignmentStatisticsManagement';
import { AssignmentStatistics } from '../pages/analytics/AssignmentStatistics';
import { AssignmentManagement } from '../pages/assignments/AssignmentManagement';
import { ViewAssignment } from '../pages/assignments/ViewAssignment';
import { CreateAssignment } from '../pages/assignments/CreateAssignment';
import { EditAssignmentWrapper } from '../pages/assignments/EditAssignmentWrapper';
import { AssignmentAttemptManagement } from '../pages/assignments/AssignmentAttemptManagement';
import { AttendanceManagement } from '../pages/attendances/AttendanceManagement';
import { MarkAttendance } from '../pages/attendances/MarkAttendance';

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <TeacherAuthWrapper>
          <ToastProvider>
            <ToastContainer />
            <Routes>
              <Route
                element={
                  <EnforceLoginStatePageWrapper redirectTo={LOGIN}>
                    <PrimaryLayout
                      role={LayoutRole.Teacher}
                      navigationMenu={NAV_SECTIONS}
                      accountNavigation={ACCOUNT_NAV}
                      routesWithoutSidebar={ROUTES_WITHOUT_SIDEBAR}
                    />
                  </EnforceLoginStatePageWrapper>
                }
              >
                <Route
                  path={DASHBOARD}
                  element={<div>Welcome to AcerTech!</div>}
                />
                {/* Subject routes */}
                <Route path={SUBJECTS}>
                  <Route path={SUBJECTS} element={<Subjects />} />
                  <Route path={SUBJECT_MAIN} element={<Subject />} />
                  {/* Question Bank routes */}
                  <Route path={QUESTION_BANK}>
                    <Route path={QUESTION_BANK} element={<QuestionBank />} />
                    <Route
                      path={CREATE_QUESTION}
                      element={<CreateQuestion />}
                    />
                    <Route
                      path={UPDATE_QUESTION}
                      element={<UpdateQuestion />}
                    />
                  </Route>
                  {/* Quizzes routes */}
                  <Route path={QUIZZES}>
                    <Route path={QUIZZES} element={<QuizManagement />} />
                    <Route path={CREATE_QUIZ} element={<CreateQuiz />} />
                    <Route path={UPDATE_QUIZ} element={<ModifyQuizWrapper />} />
                  </Route>
                  {/* Assignments routes */}
                  <Route path={ASSIGNMENTS}>
                    <Route
                      path={ASSIGNMENTS}
                      element={<AssignmentManagement />}
                    />
                    <Route
                      path={CREATE_ASSIGNMENT}
                      element={<CreateAssignment />}
                    />
                    <Route
                      path={VIEW_ASSIGNMENT}
                      element={<ViewAssignment />}
                    />
                    <Route
                      path={EDIT_ASSIGNMENT}
                      element={<EditAssignmentWrapper />}
                    />
                    <Route
                      path={VIEW_ASSIGNMENT_ATTEMPTS}
                      element={<AssignmentAttemptManagement />}
                    />
                  </Route>
                </Route>
                {/* Analytics routes */}
                <Route path={ANALYTICS}>
                  <Route
                    path={QUIZ_ANALYTICS_MGMT}
                    element={<QuizStatisticsManagement />}
                  />
                  <Route
                    path={VIEW_QUIZ_ANALYTICS}
                    element={<QuizStatistics />}
                  />
                  <Route
                    path={ASSIGNMENT_ANALYTICS_MGMT}
                    element={<AssignmentStatisticsManagement />}
                  />
                  <Route
                    path={VIEW_ASSIGNMENT_ANALYTICS}
                    element={<AssignmentStatistics />}
                  />
                </Route>
                {/* Scheduling routes */}
                <Route path={SCHEDULING}>
                  <Route path={VIEW_CLASSES} element={<CalendarPage />} />
                  <Route
                    path={SESSIONS_FOR_ATTENDANCE}
                    element={<AttendanceManagement />}
                  />
                  <Route path={MARK_ATTENDANCE} element={<MarkAttendance />} />
                </Route>
                {/* Rewards routes */}
                <Route path={REWARDS} />
                <Route path={ACCOUNT}>
                  <Route path={PROFILE} element={<TeacherProfile />} />
                  <Route path={CHANGE_PASSWORD} element={<ChangePassword />} />
                  <Route path={SETTINGS} />
                </Route>
                <Route path={ACCOUNT} element={<TeacherAccount />} />
                <Route path={CHANGE_PASSWORD} element={<ChangePassword />} />
              </Route>
              <Route path={LOGIN} element={<TeacherLogin />} />
              <Route path={SIGN_UP} element={<TeacherSignUp />} />
              <Route
                path="/forgot-password"
                element={<TeacherForgotPassword />}
              />
              <Route
                path="/reset-password"
                element={<TeacherResetPassword />}
              />
            </Routes>
          </ToastProvider>
        </TeacherAuthWrapper>
      </div>
    </QueryClientProvider>
  );
}

export default App;
