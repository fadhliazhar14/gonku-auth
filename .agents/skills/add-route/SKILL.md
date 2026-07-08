---
name: add-route
description: Use when registering a new page/route into the React Router Data Router config in src/main.jsx. Covers adding a ROUTES constant, wiring the route under the correct layout layer (public vs protected), and applying a scoped ErrorBoundary.
---

# Skill: add-route

## When to Use

You need to register a new page into the application router — whether it is a **public page** (accessible without login) or a **protected page** (requires authentication).

This skill does NOT cover creating the view/presenter/api files — see `add-frontend-feature` for that.

---

## Architecture Overview

The router lives in [`src/main.jsx`](../../../src/main.jsx) and follows the **React Router v6.4+ Data Router** pattern (`createBrowserRouter` + `RouterProvider`). It uses **Layout Routes** (pathless routes) to layer concerns:

```
RootLayout                         ← session hydration, global outlet
  ├── /login  →  LoginView         ← public, no auth required
  └── RequireAuth  (pathless)      ← auth guard: redirects to /login if not authenticated
        └── /  →  AppLayout        ← shell (sidebar, topbar)
              └── ErrorBoundary    ← scoped error boundary for all feature pages
                    ├── /dashboard  →  DashboardView
                    ├── /users      →  UsersView
                    └── /users/:id  →  UserDetails
```

### Key files

| File | Role |
|---|---|
| [`src/main.jsx`](../../../src/main.jsx) | Router definition — the only place routes are registered |
| [`src/constants/routes.js`](../../../src/constants/routes.js) | `ROUTES` constant — single source of truth for all path strings |
| [`src/components/layout/root-layout.jsx`](../../../src/components/layout/root-layout.jsx) | Top-level layout: hydrates auth session, renders `<Outlet />` |
| [`src/components/layout/require-auth.jsx`](../../../src/components/layout/require-auth.jsx) | Pathless auth guard: shows spinner → redirects → renders `<Outlet />` |
| [`src/components/layout/app-layout.view.jsx`](../../../src/components/layout/app-layout.view.jsx) | App shell (sidebar + content area) |

---

## Steps

### 1. Add the path constant to `src/constants/routes.js`

Always use `ROUTES` — never hardcode path strings in `main.jsx` or in `<Link>` / `useNavigate` calls.

```javascript
// src/constants/routes.js
export const ROUTES = Object.freeze({
  ROOT: '/',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USER_DETAILS: '/user-details/:id',
  LOGIN: '/login',
  // Add your new route here:
  MY_FEATURE: '/my-feature',
  // For dynamic segments use the :param syntax:
  MY_FEATURE_DETAIL: '/my-feature/:id',
});
```

### 2. Import the view component in `src/main.jsx`

Add the import at the top of the file alongside the other view imports.

```javascript
import MyFeatureView from './features/my-feature/my-feature.view.jsx'
```

### 3. Register the route in the correct layer

#### Protected route (requires login) — most feature pages

Insert the new route object inside the scoped `ErrorBoundary` children array (the innermost `children` under `AppLayout`):

```javascript
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginView /> },
      {
        element: <RequireAuth />,          // ← auth guard (pathless)
        children: [
          {
            path: ROUTES.ROOT,
            element: <AppLayout />,
            children: [
              {
                errorElement: <ErrorBoundary />,   // ← scoped error boundary
                children: [
                  { path: ROUTES.DASHBOARD, element: <DashboardView /> },
                  { path: ROUTES.USERS,     element: <UsersView /> },
                  { path: ROUTES.USER_DETAILS, element: <UserDetails /> },
                  // ✅ Add your protected route HERE:
                  { path: ROUTES.MY_FEATURE, element: <MyFeatureView /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])
```

#### Public route (no login required)

Insert at the same level as the `ROUTES.LOGIN` entry, **outside** the `RequireAuth` block:

```javascript
{ path: ROUTES.LOGIN,      element: <LoginView /> },
// ✅ Add your public route HERE:
{ path: ROUTES.MY_PUBLIC,  element: <MyPublicView /> },
```

### 4. Navigate to the route from other components

Use `ROUTES` — never hardcode paths:

```javascript
import { Link, useNavigate } from 'react-router'
import { ROUTES } from '../../constants/routes'

// As a Link
<Link to={ROUTES.MY_FEATURE}>Go to My Feature</Link>

// Programmatic navigation
const navigate = useNavigate()
navigate(ROUTES.MY_FEATURE)

// Dynamic segment
navigate(`/my-feature/${item.id}`)
// or with generatePath:
import { generatePath } from 'react-router'
navigate(generatePath(ROUTES.MY_FEATURE_DETAIL, { id: item.id }))
```

### 5. Read route params in the view/presenter

```javascript
import { useParams } from 'react-router'

export default function MyFeatureDetailView() {
  const { id } = useParams()
  // pass id to the presenter
}
```

---

## Checklist Before Done

- [ ] New path string added to `src/constants/routes.js` inside `ROUTES`
- [ ] Import added to `src/main.jsx`
- [ ] Route placed in the correct layer (protected inside `RequireAuth` + `ErrorBoundary`, public alongside `/login`)
- [ ] No hardcoded path strings — `ROUTES.*` used everywhere
- [ ] Dynamic segments use `:param` syntax in `ROUTES` constant
- [ ] Navigation uses `ROUTES.*` with `<Link>` or `useNavigate`
- [ ] `npm run build:web` passes with no errors

---

## Anti-patterns to Avoid

| ❌ Don't | ✅ Do instead |
|---|---|
| `path: '/my-feature'` in main.jsx | `path: ROUTES.MY_FEATURE` |
| Register route outside the scoped `ErrorBoundary` children | Place inside the `errorElement: <ErrorBoundary />` wrapper |
| Create a separate `<Routes>` block inside a view | All routes go in `main.jsx` — one router definition |
| Use `<BrowserRouter>` from `react-router-dom` | Use `createBrowserRouter` + `<RouterProvider>` |
| Use `react-router-dom` | Import from `react-router` (v7 unified package) |
