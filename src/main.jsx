import { createRoot } from 'react-dom/client'
import './index.css'
import LoginView from './features/auth/login.view.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import DashboardView from './features/dashboard/dashboard.view.jsx'
import RequireAuth from './components/layout/require-auth.jsx'
import { ROUTES } from './constants/routes.js'
import AppLayout from './components/layout/app-layout.view.jsx'
import ErrorBoundary from './components/error-boundary/error-boundary.view.jsx'
import RootLayout from './components/layout/root-layout.jsx'
import UsersView from './features/users/users.view.jsx'
import UserDetails from './features/user-details/user-details.view.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
                errorElement: <ErrorBoundary />,
                children: [
                  {
                    path: ROUTES.DASHBOARD,
                    element: <DashboardView />
                  },
                  {
                    path: ROUTES.USERS,
                    element: <UsersView />
                  },
                  {
                    path: ROUTES.USER_DETAILS,
                    element: <UserDetails />
                  }
                ]
              }
            ],
          }
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer />
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
)

