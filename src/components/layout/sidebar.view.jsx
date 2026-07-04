import { NavLink } from "react-router";
import { ROUTES } from "../../libs/routes";
import { Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/outline";
import Button from "../forms/button";

const getNavLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
    : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
  }`;

export default function Sidebar({ user, onLogout }) {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="sticky top-0 w-64 bg-gray-900 text-gray-100 flex flex-col h-screen border-r border-gray-800">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
          G
        </div>
        <span className="font-semibold text-lg bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Gonku Auth
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        <NavLink to={ROUTES.DASHBOARD} className={getNavLinkClass}>
          <Squares2X2Icon aria-hidden="true" className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to={ROUTES.USERS} className={getNavLinkClass}>
          <UserGroupIcon aria-hidden="true" className="w-5 h-5" />
          Users
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-semibold text-white shadow-sm">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <Button
          handlerOnClick={onLogout}
          isFormDefault={false}
          styleClasses="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </Button>
      </div>
    </aside>
  );
}
