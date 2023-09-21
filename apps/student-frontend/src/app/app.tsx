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
import { FaqPage } from '../pages/faq/FaqPage';

export function App() {
  return (
    <div className="h-full">
      <StudentAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<StudentLogin />} />
            <Route path="/sign-up" element={<StudentSignUp />} />
            <Route path="/account" element={<StudentAccount />} />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </ToastProvider>
      </StudentAuthWrapper>
    </div>
  );
}

export default App;
