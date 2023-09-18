// app.jsx
import AdminLogin from '../pages/entry/AdminLogin';
import AdminSignUp from '../pages/entry/AdminSignUp';
import { AuthWrapper } from '../auth/AuthContext';
import { ToastProvider } from '@acer-academy-learning/common-ui';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Account from '../pages/entry/Account';
import {
  NavigationMenuItem,
  NavigationSection,
} from 'libs/common-ui/src/lib/layout/components/type';
import { AuthWrapper } from '../auth/AuthContext';
import { SecondaryLayout } from '@acer-academy-learning/common-ui';
import {
  BuildingStorefrontIcon,
  // CalendarDaysIcon,
  // CircleStackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
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
      <AuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="sign-up" element={<AdminSignUp />} />
          </Routes>
        </ToastProvider>
      </AuthWrapper>
    </div>
  );
}
