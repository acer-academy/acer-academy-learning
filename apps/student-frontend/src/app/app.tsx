import {
  CommonSider,
  PrimaryLayout,
  PrimaryLayoutTypeEnum,
} from '@acer-academy-learning/common-ui';
import { Outlet, Route, Routes } from 'react-router-dom';
import {
  ACCOUNT,
  BOOKING,
  REWARDS,
  SUBJECTS,
  StudentMenuTree,
  VIEW_CLASSES,
} from '../constants/routes';

export function App() {
  return (
    <PrimaryLayout
      menuTree={StudentMenuTree}
      type={PrimaryLayoutTypeEnum.Student}
      sider={
        <Routes>
          <Route element={<CommonSider menuTree={StudentMenuTree} />}>
            <Route path={`${SUBJECTS}/:subject`} />
            <Route path={`${BOOKING}/*`} />
            <Route path={`${ACCOUNT}`} />
          </Route>
        </Routes>
      }
    >
      <Routes>
        <Route path="/" element={<h1>Dashboard</h1>} />
        <Route path={SUBJECTS} element={<h1>Subject</h1>} />
        {/* Nest routes like so */}
        <Route
          path={BOOKING}
          element={
            <h1>
              Bookings
              <Outlet />
            </h1>
          }
        >
          <Route path={`${BOOKING}${VIEW_CLASSES}`} element={<p>Nested</p>} />
        </Route>
        <Route path={REWARDS} />
      </Routes>
    </PrimaryLayout>
  );
}

export default App;
