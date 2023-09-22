// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  EnforceLoginStatePageWrapper,
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
import TeacherProfile from '../pages/profile/TeacherProfile';
import ChangePassword from '../pages/profile/ChangePassword';
import TeacherForgotPassword from '../pages/entry/TeacherForgotPassword';
import TeacherResetPassword from '../pages/entry/TeacherResetPassword';
import { ACCOUNT_NAV, NAV_SECTIONS } from '../libs/layout';
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
                <EnforceLoginStatePageWrapper redirectTo={LOGIN}>
                  <PrimaryLayout
                    role={LayoutRole.Teacher}
                    navigationMenu={NAV_SECTIONS}
                    accountNavigation={ACCOUNT_NAV}
                  />
                </EnforceLoginStatePageWrapper>
              }
            >
              <Route path={DASHBOARD} />
              <Route path={SUBJECTS} />
              <Route path={ANALYTICS} />
              <Route path={SCHEDULING} />
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
            <Route path="/reset-password" element={<TeacherResetPassword />} />
          </Routes>
        </ToastProvider>
      </TeacherAuthWrapper>
    </div>
  );
}

export default App;
