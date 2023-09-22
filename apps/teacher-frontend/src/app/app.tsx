// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  LayoutRole,
  PrimaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import styles from './app.module.css';
import TeacherLogin from '../pages/entry/TeacherLogin';
import TeacherSignUp from '../pages/entry/TeacherSignUp';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TeacherAuthWrapper } from '@acer-academy-learning/common-ui';
import TeacherAccount from '../pages/entry/TeacherAccount';
import TeacherForgotPassword from '../pages/entry/TeacherForgotPassword';
import TeacherResetPassword from '../pages/entry/TeacherResetPassword';
import { ACCOUNT_NAV, NAV_SECTIONS } from '../libs/layout';
import {
  ACCOUNT,
  ANALYTICS,
  DASHBOARD,
  PROFILE,
  REWARDS,
  SCHEDULING,
  SETTINGS,
  SUBJECTS,
} from '../libs/routes';

export function App() {
  return (
    <div className="h-full">
      <TeacherAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route
              element={
                <PrimaryLayout
                  role={LayoutRole.Teacher}
                  navigationMenu={NAV_SECTIONS}
                  accountNavigation={ACCOUNT_NAV}
                />
              }
            >
              <Route path="/" />
              <Route path={DASHBOARD} />
              <Route path={SUBJECTS} />
              <Route path={ANALYTICS} />
              <Route path={SCHEDULING} />
              <Route path={REWARDS} />
              <Route path={ACCOUNT}>
                <Route path={PROFILE} />
                <Route path={SETTINGS} />
              </Route>
            </Route>
            <Route path="/login" element={<TeacherLogin />} />
            <Route path="/sign-up" element={<TeacherSignUp />} />
            <Route
              path="/forgot-password"
              element={<TeacherForgotPassword />}
            />
            <Route path="/reset-password" element={<TeacherResetPassword />} />
            <Route path="/account" element={<TeacherAccount />} />
          </Routes>
        </ToastProvider>
      </TeacherAuthWrapper>
    </div>
  );
}

export default App;
