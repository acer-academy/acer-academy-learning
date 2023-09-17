// import { BrowserRouter } from 'react-router-dom';
import { AuthWrapper } from '../auth/AuthWrapper';

export function App() {
  return (
    <div className="App">
      {/* <BrowserRouter> */}
      <AuthWrapper />
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
