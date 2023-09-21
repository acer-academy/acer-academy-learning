// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import AdminForgotPassword from '../pages/entry/AdminForgetPassword';
import { AdminAuthWrapper } from '@acer-academy-learning/common-ui';
import { ToastProvider } from '@acer-academy-learning/common-ui';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import { CentreManagement } from '../pages/centre/CentreManagement';
import { CentreDetails } from '../pages/centre/CentreDetails';
import AdminResetPassword from '../pages/entry/AdminResetPassword';

export default function App() {
  return (
    <div className="h-full">
      <AdminAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
            <Route path="forgot-password" element={<AdminForgotPassword />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
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
