// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import { AdminAuthWrapper } from '@acer-academy-learning/common-ui';
import { ToastProvider } from '@acer-academy-learning/common-ui';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import { CentreManagement } from '../pages/centre/CentreManagement';
import { CentreDetails } from '../pages/centre/CentreDetails';
import { FaqTopicManagement } from '../pages/faq/FaqManagement';
import { FaqTopicDetails } from '../pages/faq/FaqDetails';
import { PromotionManagement } from '../pages/promotion/PromotionManagement';

export default function App() {
  return (
    <div className="h-full">
      <AdminAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
            <Route path="centre-management" element={<CentreManagement />} />
            <Route
              path="centre-management/:centreId"
              element={<CentreDetails />}
            />
            <Route path="faq-management" element={<FaqTopicManagement />} />
            <Route
              path="faq-management/:faqTopicId"
              element={<FaqTopicDetails />}
            />
            <Route
              path="promotion-management"
              element={<PromotionManagement />}
            />
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
