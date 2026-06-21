import { ROUTES } from "./routes";
import { USER_ROLES } from "./user_roles";

export const roleRoutePermissions = Object.freeze({
  [USER_ROLES.ADMIN]: [
    ROUTES.ROOT,
    ROUTES.DASHBOARD,
    ROUTES.USERS,
    ROUTES.ROLES
  ]
});

export function hasPermission(role, pathname) {
  const normalized = pathname.replace(/\/+$/, "") || ROUTES.ROOT;

  return roleRoutePermissions[role]?.some((route) => isRouteMatch(route, normalized)) ?? false;
}

function isRouteMatch(routePattern, pathname) {
  const normalizedPattern = routePattern.replace(/\/+$/, "") || ROUTES.ROOT;

  if (!normalizedPattern.includes(":")) {
    return normalizedPattern === pathname;
  }

  const patternSegments = normalizedPattern.split("/");
  const pathSegments = pathname.split("/");

  if (patternSegments.length !== pathSegments.length) {
    return false;
  }

  return patternSegments.every((segment, index) => {
    if (segment.startsWith(":")) {
      return pathSegments[index] !== "";
    }

    return segment === pathSegments[index];
  });
}