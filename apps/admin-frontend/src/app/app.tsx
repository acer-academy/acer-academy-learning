// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import { AdminAuthWrapper } from '@acer-academy-learning/common-ui';
import { ToastProvider } from '@acer-academy-learning/common-ui';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import AdminProfile from '../pages/profile/AdminProfile';

export default function App() {
  return (
    <div className="h-full">
      <AdminAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="sign-up" element={<AdminSignUp />} />
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
