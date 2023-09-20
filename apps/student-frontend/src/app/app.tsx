// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  LayoutRole,
  PrimaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import styles from './app.module.css';
import StudentLogin from '../pages/entry/StudentLogin';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //
import { NAV_SECTIONS } from '../libs/layout';
import { useEffect } from 'react';

export function App() {
  return (
    <div className="h-full">
      <ToastProvider>
        <ToastContainer />
        <Routes>
          {/* <Route path="/" element={<StudentLogin />} /> */}
          <Route
            path="/*"
            element={
              <PrimaryLayout
                navigationMenu={NAV_SECTIONS}
                role={LayoutRole.Student}
              />
            }
          />
        </Routes>
      </ToastProvider>
    </div>
  );
}

export default App;
