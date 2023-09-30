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
  CHANGE_PASSWORD,
  FAQ,
  HUMAN_RESOURCES,
  LOGIN,
  PROMOTION,
  SETTINGS,
  SIGN_UP,
  STUDENTS,
  TEACHERS,
  CREDIT_RESOURCES,
  CREDIT_BUNDLE,
  TRANSACTION,
} from '../libs/routes';
import AdminForgotPassword from '../pages/entry/AdminForgotPassword';
import AdminResetPassword from '../pages/entry/AdminResetPassword';
import { TeacherHRManagementPage } from '../pages/hr/TeacherHRManagementPage';
import { StudentHRManagementPage } from '../pages/hr/StudentHRManagementPage';
import { AdminHRManagementPage } from '../pages/hr/AdminHRManagementPage';
import TransactionsComponent from '../pages/transaction/TransactionManagement';
import { CreditBundleManagement } from '../pages/creditBundle/CreditBundleManagement';

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
              <Route path="/" element={<h1>Welcome to AcerTech!</h1>} />
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
              <Route path={CREDIT_RESOURCES} element={<Outlet />}>
                <Route
                  path={CREDIT_BUNDLE}
                  element={<CreditBundleManagement />}
                />
                <Route path={TRANSACTION} element={<TransactionsComponent />} />
                <Route path={PROMOTION} element={<PromotionManagement />} />
              </Route>

              <Route path={`${CENTRE}`} element={<CentreManagement />} />
              <Route path={`${CENTRE}/:centreId`} element={<CentreDetails />} />
              <Route path={`${FAQ}`} element={<FaqTopicManagement />} />
              <Route
                path={`${FAQ}/:faqTopicId`}
                element={<FaqTopicDetails />}
              />
              <Route path={SETTINGS} element={<AdminProfile />} />
              <Route path={CHANGE_PASSWORD} element={<ChangePassword />} />
            </Route>
            <Route path={LOGIN} element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path={SIGN_UP} element={<AdminSignUp />} />
            <Route path="forgot-password" element={<AdminForgotPassword />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
