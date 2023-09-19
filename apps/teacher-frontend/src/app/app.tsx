// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ToastProvider } from '@acer-academy-learning/common-ui';
import styles from './app.module.css';
import TeacherLogin from '../pages/entry/TeacherLogin';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <div className="h-full">
      <ToastProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<TeacherLogin />} />
        </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;
