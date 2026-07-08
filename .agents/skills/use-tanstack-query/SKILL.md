---
name: use-tanstack-query
description: Use when writing or modifying a presenter hook that needs to fetch data (GET), mutate data (POST/PUT/DELETE), or invalidate cached queries. Covers useQuery, useMutation, useQueryClient, queryKey conventions, and cache invalidation patterns specific to this codebase.
---

# Skill: use-tanstack-query

## When to Use

You are writing or modifying a **presenter hook** (`<feature>.presenter.js`) that needs to:

- Fetch data from the API (GET) — use `useQuery`
- Submit/create/update/delete data (POST/PUT/DELETE) — use `useMutation`
- Refresh stale cached data after a mutation succeeds — use `useQueryClient` + `invalidateQueries`

Do **not** use raw `useEffect` + `useState` for data fetching — TanStack Query is the project standard.

---

## Core Concepts

### `useQuery` — Fetching (GET)

Declarative data fetching with automatic caching, loading state, and error state.

```javascript
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./users.api";

const usersQuery = useQuery({
  queryKey: ["users", queryParams],   // cache key — must include all variables that affect the fetch
  queryFn: async ({ signal }) => {    // signal enables request cancellation on unmount
    const data = await getUsers(queryParams, signal);
    // Validate response structure here (Zod) before returning
    return data;
  },
  enabled: isEditMode,  // optional — set false to skip the query conditionally
});
```

**Key states to expose from the presenter:**

| State | What it means |
|---|---|
| `usersQuery.isLoading` | First fetch in progress, no cached data yet |
| `usersQuery.data` | Resolved data (undefined while loading) |
| `usersQuery.error` | Error object if fetch failed |

---

### `useMutation` — Mutating (POST / PUT / DELETE)

For any write operation. Use `onSuccess` / `onError` callbacks for side effects.

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserById } from "./users.api";

const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: (userId) => deleteUserById(userId),
  onSuccess: () => {
    // Invalidate related queries so UI re-fetches fresh data
    queryClient.invalidateQueries({ queryKey: ["users"] });
    showToast.success("User deactivated successfully");
  },
  onError: (error) => {
    setErrorMessage(error.message);
  },
});

// Trigger it:
deleteMutation.mutate(userId);
```

**Key states to expose from the presenter:**

| State | What it means |
|---|---|
| `deleteMutation.isPending` | Mutation in flight — disable buttons |
| `deleteMutation.error` | Error from the mutation |

---

### `useQueryClient` + `invalidateQueries` — Cache Invalidation

After a successful mutation, mark related queries as stale so TanStack Query re-fetches them automatically.

```javascript
const queryClient = useQueryClient();

// Invalidate the whole "users" key family (any queryKey starting with "users")
queryClient.invalidateQueries({ queryKey: ["users"] });

// Invalidate a specific record
queryClient.invalidateQueries({ queryKey: ["user", id] });
```

> **Rule**: Always invalidate the smallest key scope needed. Invalidating `["users"]` also invalidates `["users", queryParams]`.

---

## queryKey Conventions

| Data | queryKey |
|---|---|
| All users (with params) | `["users", queryParams]` |
| Single user | `["user", id]` |

**Pattern**: the first element is the resource name (plural for lists, singular for detail), followed by any variables that change the query result.

---

## Steps

1. **Import the needed hooks** at the top of the presenter:

   ```javascript
   import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
   ```

2. **For data fetching** — define `useQuery` inside the presenter hook:
   - Set `queryKey` including all variables that affect the result.
   - Always pass `signal` from `queryFn` to the API call for cancellation support.
   - Validate the response structure with Zod inside `queryFn` before returning.
   - Set `enabled: false` if the query should only run under certain conditions.

3. **For mutations** — define `useMutation` inside the presenter hook:
   - Put the API call in `mutationFn`.
   - Handle side-effects in `onSuccess` (invalidate cache, show toast, navigate).
   - Handle errors in `onError` (set `errorMessage` state).
   - Expose `isPending` as `isLoading` to the view so buttons can be disabled.

4. **Invalidate cache after mutation success:**
   - Call `queryClient.invalidateQueries` inside `onSuccess`.
   - Invalidate only the affected query keys (list + detail if both exist).

5. **Return from the presenter** only the fields the view needs:

   ```javascript
   return {
     users: usersQuery.data?.users ?? null,
     isLoading: usersQuery.isLoading || deleteMutation.isPending,
     errorMessage: usersQuery.error?.message || deleteMutation.error?.message || null,
     pagination: usersQuery.data?.pagination ?? { ... },
     handleDelete,
   };
   ```

---

## Real Codebase Examples

| File | Hook used | Purpose |
|---|---|---|
| [`login.presenter.js`](../../features/auth/login.presenter.js) | `useMutation` | Login user → store session → redirect |
| [`users.presenter.js`](../../features/users/users.presenter.js) | `useQuery` + `useMutation` × 2 + `invalidateQueries` | Paginated user list + deactivate/reactivate |
| [`user-details.presenter.js`](../../features/user-details/user-details.presenter.js) | `useQuery` + `useMutation` + `invalidateQueries` | Fetch single user + save edits |

---

## Checklist Before Done

- [ ] `useQuery` has a `queryKey` that includes **all** variables that affect the result
- [ ] `queryFn` passes `signal` to the API call
- [ ] Response is validated with Zod inside `queryFn`
- [ ] `useMutation` `onSuccess` calls `queryClient.invalidateQueries` for all affected keys
- [ ] `isPending` is exposed as `isLoading` so the view can disable interactive elements
- [ ] Error from both `useQuery` and `useMutation` is surfaced via `errorMessage` returned from the presenter
- [ ] No raw `useEffect` + `fetch` used for data fetching
- [ ] `QueryClientProvider` is already set up in `main.jsx` — do not add another one
