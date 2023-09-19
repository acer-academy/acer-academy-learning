// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ToastProvider } from '@acer-academy-learning/common-ui';
import styles from './app.module.css';
import StudentLogin from '../pages/entry/StudentLogin';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <div className="h-full">
      <ToastProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<StudentLogin />} />
        </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;
