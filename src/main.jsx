import { createRoot } from 'react-dom/client'
import './index.css'
import LoginView from './features/auth/login.view.jsx'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router'
import DashboardView from './features/dashboard/dashboard.view.jsx'
import RequireAuth from './components/layout/require-auth.jsx'
import { ROUTES } from './libs/routes.js'
import AppLayout from './components/layout/app-layout.view.jsx'
import ErrorBoundary from './components/error-boundary/error-boundary.view.jsx'
import { AuthProvider } from './components/layout/AuthContext.jsx'

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginView />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: ROUTES.ROOT,
            element: <AppLayout />,
            children: [
              {
                path: ROUTES.DASHBOARD,
                element: <DashboardView />,
              },
            ],
          },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
