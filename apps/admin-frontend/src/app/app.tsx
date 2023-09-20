// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import AdminForgotPassword from '../pages/entry/AdminForgotPassword';
import { AdminAuthWrapper } from '@acer-academy-learning/common-ui';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { CentreManagement } from '../pages/centre/CentreManagement';
import { CentreDetails } from '../pages/centre/CentreDetails';
import AdminResetPassword from '../pages/entry/AdminResetPassword';
import { FaqTopicManagement } from '../pages/faq/FaqManagement';
import { FaqTopicDetails } from '../pages/faq/FaqDetails';
import {
  NavigationMenuItem,
  NavigationSection,
} from 'libs/common-ui/src/lib/layout/components/type';
import {
  BuildingStorefrontIcon,
  // CalendarDaysIcon,
  // CircleStackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { AuthWrapper } from '../auth/AuthContext';
import {
  SecondaryLayout,
  ToastProvider,
} from '@acer-academy-learning/common-ui';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import { NAV_SECTIONS } from '../libs/layout';
import { ADMINS, HUMAN_RESOURCES, STUDENTS, TEACHERS } from '../libs/routes';
const navigation: NavigationSection[] = [
  {
    name: 'MANAGEMENT',
    menu: [
      {
        name: 'Human Resources',
        href: '/human-resources',
        icon: UsersIcon,
        children: [
          { name: 'Teachers', href: '/human-resources/teachers' },
          { name: 'Students', href: '/human-resources/students' },
          { name: 'Admins', href: '/human-resources/admins' },
        ],
      },
      // { name: 'Scheduling', href: '/scheduling', icon: CalendarDaysIcon },
      { name: 'Centre', href: '/centre', icon: BuildingStorefrontIcon },
      // { name: 'Class Credits', href: '/class-credits', icon: CircleStackIcon },
      { name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
    ],
  },
  {
    name: 'OTHERS',
    menu: [{ name: 'Settings', href: '/settings', icon: Cog6ToothIcon }],
  },
];

export default function App() {
  return (
    <div className="h-full">
      <AdminAuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="account" element={<Account />} />
            <Route
              element={<SecondaryLayout navigationSections={NAV_SECTIONS} />}
            >
              {/* Nest all routes that has a SecondaryLayout here */}
              <Route path="/" element={<h1>Main</h1>} />
              <Route
                path={HUMAN_RESOURCES}
                element={
                  <div>
                    Common HR stuff
                    <Outlet />
                  </div>
                }
              >
                <Route path={TEACHERS} element={<h2>Teacher</h2>} />
                <Route path={STUDENTS} element={<h2>Student</h2>} />
                <Route path={ADMINS} element={<h2>Admin</h2>} />
              </Route>
              <Route path={CENTRE} />
              <Route path={FAQ} />
            </Route>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
            <Route path="forgot-password" element={<AdminForgotPassword />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
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
          </Routes>
        </ToastProvider>
      </AdminAuthWrapper>
    </div>
  );
}
