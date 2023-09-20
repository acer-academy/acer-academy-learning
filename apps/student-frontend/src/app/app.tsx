// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  LayoutRole,
  PrimaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import StudentLogin from '../pages/entry/StudentLogin';
import StudentSignUp from '../pages/entry/StudentSignUp';
import { Route, Routes, Link } from 'react-router-dom';
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
  NOTIFICATIONS,
  PAST_TRANSACTIONS,
  PROFILE,
  QUIZZES,
  RECORDINGS,
  REWARDS,
  SETTINGS,
  SUBJECTS,
  VIEW_CLASSES,
  ZOOM_LINK,
} from '../libs/routes';

export function App() {
  return (
    <div className="h-full">
      <StudentAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<StudentLogin />} />
            <Route path="/sign-up" element={<StudentSignUp />} />
            <Route
              path="/forgot-password"
              element={<StudentForgotPassword />}
            />
            <Route path="/reset-password" element={<StudentResetPassword />} />
            <Route path="/account" element={<StudentAccount />} />
          </Routes>
        </ToastProvider>
      </StudentAuthWrapper>
      <ToastProvider>
        <ToastContainer />
        <Routes>
          <Route
            element={
              <PrimaryLayout
                navigationMenu={NAV_SECTIONS}
                accountNavigation={ACCOUNT_NAV}
                role={LayoutRole.Student}
              />
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
            <Route path={ACCOUNT} element={<div>Home</div>}>
              <Route path={PROFILE} element={<div>Home</div>} />
              <Route path={NOTIFICATIONS} element={<div>Home</div>} />
              <Route path={SETTINGS} element={<div>Home</div>} />
            </Route>
          </Route>
          <Route path="/login" element={<StudentLogin />} />
        </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;
