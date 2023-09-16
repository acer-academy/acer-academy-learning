import {
  PrimaryLayout,
  PrimaryLayoutTypeEnum,
} from '@acer-academy-learning/common-ui';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <PrimaryLayout type={PrimaryLayoutTypeEnum.Student}>
      <Outlet />
    </PrimaryLayout>
  );
}

export default App;
