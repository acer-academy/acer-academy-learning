// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import AdminForgotPassword from '../pages/entry/AdminForgotPassword';
import { AdminAuthWrapper } from '@acer-academy-learning/common-ui';
import { ToastProvider } from '@acer-academy-learning/common-ui';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import AdminProfile from '../pages/profile/AdminProfile';
import ChangePassword from '../pages/profile/ChangePassword';
import { CentreManagement } from '../pages/centre/CentreManagement';
import { CentreDetails } from '../pages/centre/CentreDetails';
import AdminResetPassword from '../pages/entry/AdminResetPassword';
import { FaqTopicManagement } from '../pages/faq/FaqManagement';
import { FaqTopicDetails } from '../pages/faq/FaqDetails';

export default function App() {
  return (
    <div className="h-full">
      <AdminAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route
              element={
                <EnforceLoginStatePageWrapper redirectTo={LOGIN}>
                  <SecondaryLayout
                    navigationMenu={NAV_SECTIONS}
                    role={LayoutRole.Admin}
                  />
                </EnforceLoginStatePageWrapper>
              }
            >
              {/* Nest all routes that has a SecondaryLayout here */}
              <Route path="/" element={<h1>Main</h1>} />
              <Route
                path={HUMAN_RESOURCES}
                element={
                  <div>
                    Common H stuff
                    <Outlet />
                  </div>
                }
              >
                <Route path={TEACHERS} element={<h2>Teacher</h2>} />
                <Route path={STUDENTS} element={<h2>Student</h2>} />
                <Route path={ADMINS} element={<h2>Admin</h2>} />
              </Route>
              <Route path={CENTRE} element={<CentreManagement />} />
              <Route path={`${CENTRE}/:centreId`} element={<CentreDetails />} />
              <Route path={FAQ} />
            </Route>
            <Route path={LOGIN} element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
            <Route path="forgot-password" element={<AdminForgotPassword />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
            <Route path="centre-management" element={<CentreManagement />} />
            <Route
              path="centre-management/:centreId"
              element={<CentreDetails />}
            />
            <Route path="faq-management" element={<FaqTopicManagement />} />
            <Route
              path="faq-management/:faqTopicId"
              element={<FaqTopicDetails />}
            />
            <Route path={SIGN_UP} element={<AdminSignUp />} />
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
