// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ToastProvider } from '@acer-academy-learning/common-ui';
import styles from './app.module.css';
import TeacherLogin from '../pages/entry/TeacherLogin';
import TeacherSignUp from '../pages/entry/TeacherSignUp';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TeacherAuthWrapper } from '@acer-academy-learning/common-ui';
import TeacherAccount from '../pages/entry/TeacherAccount';
import Profile from '../pages/profile/TeacherProfile';

export function App() {
  return (
    <div className="h-full">
      <TeacherAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<TeacherLogin />} />
            <Route path="/sign-up" element={<TeacherSignUp />} />
            <Route path="/account" element={<TeacherAccount />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </ToastProvider>
      </TeacherAuthWrapper>
    </div>
  );
}

export default App;
