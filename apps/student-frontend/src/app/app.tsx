// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ToastProvider } from '@acer-academy-learning/common-ui';
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
import { StudentNotificationPreference } from '../pages/profile/StudentNotificationPreference';
import { QueryClient, QueryClientProvider } from 'react-query';

export function App() {
  const queryClient = new QueryClient();
  return (
    <div className="h-full">
      <QueryClientProvider client={queryClient}>
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
              <Route
                path="/reset-password"
                element={<StudentResetPassword />}
              />
              <Route path="/account" element={<StudentAccount />} />
              <Route
                path="/account/preferences"
                element={<StudentNotificationPreference />}
              />
            </Routes>
          </ToastProvider>
        </StudentAuthWrapper>
      </QueryClientProvider>
    </div>
  );
}

export default App;
