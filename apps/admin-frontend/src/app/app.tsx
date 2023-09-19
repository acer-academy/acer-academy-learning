// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import { AuthWrapper } from '../auth/AuthContext';
import {
  SecondaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import { NAV_SECTIONS } from '../libs/layout';
import { ADMINS, HUMAN_RESOURCES, STUDENTS, TEACHERS } from '../libs/routes';

export default function App() {
  return (
    <div className="h-full">
      <AuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route
              element={<SecondaryLayout navigationSections={NAV_SECTIONS} />}
            >
              {/* Nest all routes that has a SecondaryLayout here */}
              <Route path="/" element={<h1>Main</h1>} />
              <Route
                path={HUMAN_RESOURCES}
                element={
                  <h1>
                    Common HR stuff
                    <Outlet />
                  </h1>
                }
              >
                <Route path={TEACHERS} element={<h1>Teacher</h1>} />
                <Route path={STUDENTS} element={<h1>Student</h1>} />
                <Route path={ADMINS} element={<h1>Admin</h1>} />
              </Route>
            </Route>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
          </Routes>
        </ToastProvider>
      </AuthWrapper>
    </div>
  );
}
