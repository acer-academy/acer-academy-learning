// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import {
  AdminAuthWrapper,
  EnforceLoginStatePageWrapper,
} from '@acer-academy-learning/common-ui';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import AdminProfile from '../pages/profile/AdminProfile';
import ChangePassword from '../pages/profile/ChangePassword';
import { CentreManagement } from '../pages/centre/CentreManagement';
import { CentreDetails } from '../pages/centre/CentreDetails';
import { FaqTopicManagement } from '../pages/faq/FaqManagement';
import { FaqTopicDetails } from '../pages/faq/FaqDetails';
import { PromotionManagement } from '../pages/promotion/PromotionManagement';
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
  LOGIN,
  PROMOTION,
  SIGN_UP,
  STUDENTS,
  TEACHERS,
} from '../libs/routes';
import AdminForgotPassword from '../pages/entry/AdminForgotPassword';
import AdminResetPassword from '../pages/entry/AdminResetPassword';
import { TeacherHRManagementPage } from '../pages/hr/TeacherHRManagementPage';
import { StudentHRManagementPage } from '../pages/hr/StudentHRManagementPage';
import { AdminHRManagementPage } from '../pages/hr/AdminHRManagementPage';

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
              <Route path={CENTRE} element={<h1>Main</h1>} />
              <Route path={FAQ} element={<h1>Main</h1>} />
              <Route path={PROMOTION} element={<PromotionManagement />} />
              <Route
                path={HUMAN_RESOURCES}
                element={
                  <div>
                    <h1>Human Resource Management</h1>
                    <Outlet />
                  </div>
                }
              >
                <Route path={TEACHERS} element={<TeacherHRManagementPage />} />
                <Route path={STUDENTS} element={<StudentHRManagementPage />} />
                <Route path={ADMINS} element={<AdminHRManagementPage />} />
              </Route>
              <Route path={CENTRE} />
              <Route path={FAQ} />
            </Route>
            <Route path={LOGIN} element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/profile" element={<AdminProfile />} />
            <Route
              path="/account/changePassword"
              element={<ChangePassword />}
            />
            <Route path="sign-up" element={<AdminSignUp />} />
            <Route path="forgot-password" element={<AdminForgotPassword />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
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
            <Route path={LOGIN} element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path={SIGN_UP} element={<AdminSignUp />} />
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
            <Route
              path="promotion-management"
              element={<PromotionManagement />}
            />
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
