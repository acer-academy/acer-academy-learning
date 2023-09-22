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
import { ACCOUNT_NAV, NAV_SECTIONS } from '../libs/layout';
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
} from '../libs/routes';
import { ToastContainer } from 'react-toastify';
import { StudentNotificationPreference } from '../pages/profile/StudentNotificationPreference';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FaqPage } from '../pages/faq/FaqPage';
import { StudentProfile } from '../pages/profile/StudentProfile';

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
                    />
                  </EnforceLoginStatePageWrapper>
                }
              >
                <Route path={DASHBOARD} element={<div>Home</div>} />
                <Route path={SUBJECTS} element={<div>Home</div>}>
                  <Route path={ASSIGNMENTS} element={<div>Home</div>} />
                  <Route path={QUIZZES} element={<div>Home</div>} />
                  <Route path={RECORDINGS} element={<div>Home</div>} />
                  <Route path={ZOOM_LINK} element={<div>Home</div>} />
                </Route>
                <Route path={BOOKING} element={<div>Home</div>}>
                  <Route path={VIEW_CLASSES} element={<div>Home</div>} />
                  <Route path={BOOK_CLASSES} element={<div>Home</div>} />
                  <Route path={BUY_CREDITS} element={<div>Home</div>} />
                  <Route path={PAST_TRANSACTIONS} element={<div>Home</div>} />
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
