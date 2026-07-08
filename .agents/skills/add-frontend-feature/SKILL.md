---
name: add-frontend-feature
description: Use when creating a new page or feature section in apps/web. Covers the MVP pattern (api module, presenter hook, view component), route registration, ErrorBoundary, and RBAC guards.
---

# Skill: add-frontend-feature

## When to Use

You need to create a new page or feature section in `apps/web/src/features/`.

## Steps

1. **Create the feature folder:**

   ```
   apps/web/src/features/<feature>/
     <feature>.api.js          ← Model: API client calls
     <feature>.presenter.js    ← Presenter: state, events, data fetching
     <feature>.view.jsx        ← View: JSX rendering only
   ```

2. **Write the API module first** (`<feature>.api.js`):
   - Import from `../../lib/api-client`
   - Define functions for each API endpoint this feature calls

   ```javascript
   // features/projects/project.api.js
   import { apiClient } from "../../lib/api-client";

   export const projectApi = {
     list: () => apiClient.get("/api/v1/projects"),
     create: (input) => apiClient.post("/api/v1/projects", input),
   };
   ```

3. **Write the presenter** (`<feature>.presenter.js`):
   - A React custom hook (named `use<Feature>Presenter`)
   - Manages all state with `useState`
   - Calls `<feature>.api.js` — never raw `fetch`
   - Contains all event handlers and business logic
   - Returns only what the view needs

   ```javascript
   // features/projects/project-list.presenter.js
   import { useState, useEffect } from "react";
   import { projectApi } from "./project.api";

   export function useProjectListPresenter() {
     const [projects, setProjects] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       projectApi
         .list()
         .then(setProjects)
         .catch((err) => setError(err.message))
         .finally(() => setIsLoading(false));
     }, []);

     return { projects, isLoading, error };
   }
   ```

4. **Write the view** (`<feature>.view.jsx`):
   - No logic — only JSX
   - All state from the presenter hook
   - Handle loading, error, empty states

   ```jsx
   // features/projects/project-list.view.jsx
   import { useProjectListPresenter } from "./project-list.presenter";

   export default function ProjectListView() {
     const { projects, isLoading, error } = useProjectListPresenter();

     if (isLoading) return <Spinner />;
     if (error) return <ErrorMessage message={error} />;
     if (projects.length === 0) return <EmptyState message="No projects found." />;

     return (
       <ul>
         {projects.map((p) => (
           <li key={p.id}>{p.name}</li>
         ))}
       </ul>
     );
   }
   ```

5. **Register the route** in `apps/web/src/index.jsx` (or the router file):
   - Wrap the feature in `<ErrorBoundary>`

   ```jsx
   <ErrorBoundary fallback={<PageErrorFallback />}>
     <ProjectListView />
   </ErrorBoundary>
   ```

6. **Apply RBAC guards** in the view:
   - Hide elements the current user's role cannot access
   - Use the auth context to read the role

   ```jsx
   const { role } = useAuth();

   {role === "admin" && <SensitiveField value={item.contract_value} />}
   ```

7. **Write tests** for the presenter logic:
   - See `apps/web/src/tests/examples/presenter.test.example.js`
   - Test pure logic functions extracted from the hook
   - Test API call arguments

## Checklist Before Done

- [ ] View file contains only JSX — no API calls or state logic
- [ ] All API calls go through `<feature>.api.js`, not raw `fetch`
- [ ] Feature page wrapped in `<ErrorBoundary>` in the router
- [ ] Loading state shown during async operations
- [ ] Error state displayed meaningfully
- [ ] Empty state handled (no blank sections)
- [ ] RBAC guards applied for sensitive fields (`contract_value`, etc.)
- [ ] One component per file
- [ ] Presenter tests cover state transitions
- [ ] `npm test` passes