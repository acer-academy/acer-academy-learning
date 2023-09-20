// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  LayoutRole,
  PrimaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import styles from './app.module.css';
import StudentLogin from '../pages/entry/StudentLogin';
import StudentSignUp from '../pages/entry/StudentSignUp';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { AuthWrapper } from '../auth/AuthContext';
import StudentAccount from '../pages/entry/StudentAccount';
import { StudentAuthWrapper } from '@acer-academy-learning/common-ui';
import StudentForgotPassword from '../pages/entry/StudentForgotPassword';
import StudentResetPassword from '../pages/entry/StudentResetPassword';
import 'react-toastify/dist/ReactToastify.css'; //
import { NAV_SECTIONS } from '../libs/layout';
import { useEffect } from 'react';

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
          {/* <Route path="/" element={<StudentLogin />} /> */}
          <Route
            path="/*"
            element={
              <PrimaryLayout
                navigationMenu={NAV_SECTIONS}
                role={LayoutRole.Student}
              />
            }
          />
        </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;
