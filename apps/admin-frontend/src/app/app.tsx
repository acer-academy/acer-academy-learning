// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import { AuthWrapper } from '../auth/AuthContext';
import { ToastProvider } from '@acer-academy-learning/common-ui';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';

function App() {
  return (
    <AuthWrapper>
      <ToastProvider>
        <ToastContainer />
        <div className="h-full bg-gray-50">
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
          </Routes>
        </div>
      </ToastProvider>
    </AuthWrapper>
  );
}

export default App;
