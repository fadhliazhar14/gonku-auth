---
name: use-auth-store
description: Use when reading or writing authentication state (current user, login status, session bootstrap, logout). Covers useAuthStore selector pattern, setLoginSession after login, fetchUserSession on app boot, logout action, and the usePermissions RBAC hook.
license: MIT
compatibility: opencode
metadata:
  author: Gonku Auth Team
  tags:
    - auth
    - zustand
    - state-management
    - rbac
---

# Skill: use-auth-store

## When to Use

You are writing or modifying code that needs to:

- Read the current authenticated user (`user`, `isAuthenticated`, `isLoading`)
- Trigger a login session update after a successful login mutation
- Bootstrap the user session on app load
- Log out the current user
- Check RBAC permissions for a route or UI element

Do **not** use `useState` + `useEffect` to manage auth state locally — `useAuthStore` is the single source of truth.

---

## Store Shape

Defined in `src/hooks/useAuthStore.js`:

| Key | Type | Description |
|---|---|---|
| `isAuthenticated` | `boolean` | Whether a valid session exists |
| `user` | `object \| null` | Zod-parsed user object (see `userSchema`) |
| `isLoading` | `boolean` | `true` on app boot until session is verified |
| `fetchUserSession()` | `async () => void` | Hits `GET /auth/me`, populates store from server |
| `setLoginSession(userData)` | `(user) => void` | Sets state directly after login — no extra network call |
| `logout()` | `async () => void` | Hits `POST /auth/signout`, then resets store in `finally` |

---

## Selector Pattern (REQUIRED)

Always subscribe to individual slices — never destructure the whole store:

```javascript
// GOOD — re-renders only when `user` changes
const user = useAuthStore((state) => state.user);
const isLoading = useAuthStore((state) => state.isLoading);

// BAD — re-renders on every store update
const { user, isLoading } = useAuthStore();
```

---

## Steps

### Reading auth state in a presenter or component

```javascript
import { useAuthStore } from "../../hooks/useAuthStore";

const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const isLoading = useAuthStore((state) => state.isLoading);
```

---

### After a successful login mutation

Call `setLoginSession` inside `onSuccess` of the `useMutation`. Do **not** call `fetchUserSession` again — the login response already carries user data.

```javascript
import { useAuthStore } from "../../hooks/useAuthStore";
import { userSchema } from "../../schemas/user.schema";

const setLoginSession = useAuthStore((state) => state.setLoginSession);

// inside useMutation onSuccess:
onSuccess: (loginResponse) => {
  const rawUser = loginResponse?.data?.userData || loginResponse?.data || loginResponse;
  const parsed = userSchema.safeParse(rawUser);

  if (parsed.success) {
    setLoginSession(parsed.data);
    navigate("/dashboard");
  } else {
    setErrorMessage("Struktur data user dari server tidak valid.");
  }
}
```

---

### Bootstrapping the session on app load

Done inside `RootLayout` — **do not replicate this pattern elsewhere**:

```javascript
// src/components/layout/root-layout.jsx
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const fetchUserSession = useAuthStore((state) => state.fetchUserSession);

useEffect(() => {
  if (!location.pathname.includes("/login")) {
    if (!isAuthenticated) {
      fetchUserSession();
    }
  }
}, [fetchUserSession, location.pathname, isAuthenticated]);
```

`fetchUserSession` is already called globally — components should only *read* auth state, not re-fetch it.

---

### Logging out

```javascript
const logout = useAuthStore((state) => state.logout);

// call on user action:
await logout(); // always resets store via `finally`, even if signout API fails
```

---

### Checking permissions (`usePermissions`)

For route-level or UI-element-level RBAC checks, use the derived hook:

```javascript
import { usePermissions } from "../../hooks/usePermissions";

const { isAuthorized, checkPermission } = usePermissions();

// isAuthorized — checks current pathname automatically
// checkPermission(pathname) — checks an arbitrary pathname
```

`usePermissions` reads `user.roles` from `useAuthStore` internally — you do not need to read the store separately.

---

## Route Guard: `RequireAuth`

`RequireAuth` is the layout-level guard wrapping all protected routes. It handles three states:

| Store state | Rendered output |
|---|---|
| `isLoading: true` | Spinner (waiting for `fetchUserSession` to resolve) |
| `isLoading: false` + `!isAuthenticated` | `<Navigate to="/login" replace />` |
| `isLoading: false` + `isAuthenticated` | `<Outlet />` (render children) |

**Do not add auth redirect logic in individual pages** — `RequireAuth` already handles it at the router level.

---

## Checklist Before Done

- [ ] Each selector subscribes to one slice (`(state) => state.x`) — not the whole store
- [ ] `setLoginSession` is used after login — not `fetchUserSession`
- [ ] `fetchUserSession` is only called in `RootLayout` — not in feature components
- [ ] `logout()` is awaited and called via an action handler — not inside `useEffect`
- [ ] RBAC checks use `usePermissions` — not manual `user.roles` array inspection inline
- [ ] No local `useState` managing a copy of auth data
