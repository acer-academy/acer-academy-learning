import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/subjects',
        element: <h1>Subject</h1>,
      },
      {
        path: '/dashboard',
        element: <h1>Dashboard</h1>,
      },
      {
        path: '/rewards',
        element: <h1>Rewards</h1>,
      },
      {
        path: '/booking',
        element: <h1>Booking</h1>,
      },
    ],
  },
]);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
