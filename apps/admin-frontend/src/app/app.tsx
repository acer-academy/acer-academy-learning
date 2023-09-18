// app.jsx

import 'antd/dist/reset.css';
import { AuthWrapper } from '../auth/AuthContext';
import LayoutComponent from '../components/structure/Layout';

function App() {
  return (
    <AuthWrapper>
      <LayoutComponent />
    </AuthWrapper>
  );
}

export default App;
