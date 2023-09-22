// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import { AdminAuthWrapper } from '@acer-academy-learning/common-ui';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { CentreManagement } from '../pages/centre/CentreManagement';
import { CentreDetails } from '../pages/centre/CentreDetails';
import {
  LayoutRole,
  SecondaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import { NAV_SECTIONS } from '../libs/layout';
import {
  ADMINS,
  CENTRE,
  FAQ,
  HUMAN_RESOURCES,
  STUDENTS,
  TEACHERS,
} from '../libs/routes';

export default function App() {
  return (
    <div className="h-full">
      <AdminAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route
              element={
                <SecondaryLayout
                  navigationMenu={NAV_SECTIONS}
                  role={LayoutRole.Admin}
                />
              }
            >
              {/* Nest all routes that has a SecondaryLayout here */}
              <Route path="/" element={<h1>Main</h1>} />
              <Route path={CENTRE} element={<h1>Main</h1>} />
              <Route path={FAQ} element={<h1>Main</h1>} />
              <Route
                path={HUMAN_RESOURCES}
                element={
                  <div>
                    Common HR stuff
                    <Outlet />
                  </div>
                }
              >
                <Route path={TEACHERS} element={<h2>Teacher</h2>} />
                <Route path={STUDENTS} element={<h2>Student</h2>} />
                <Route path={ADMINS} element={<h2>Admin</h2>} />
              </Route>
              <Route path={CENTRE} />
              <Route path={FAQ} />
            </Route>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
            <Route path="centre-management" element={<CentreManagement />} />
            <Route
              path="centre-management/:centreId"
              element={<CentreDetails />}
            />
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
