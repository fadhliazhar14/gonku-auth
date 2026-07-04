import { Outlet } from "react-router";
import { useAppLayoutPresenter } from "../../hooks/app-layout.presenter";
import Sidebar from "./sidebar.view";
import AppLayoutLoading from "./app-layout-loading.view";

export default function AppLayout() {
  const {
    user,
    isLoading,
    error,
    isAuthorized,
    logout
  } = useAppLayoutPresenter();

  const renderContent = () => {
    if (isLoading) {
      return (
        <AppLayoutLoading />
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center p-8 bg-white">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Error loading layout</h2>
            <p className="text-sm text-gray-500">
              {error instanceof Error ? error.message : "An unexpected error occurred."}
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return (
        <div className="flex flex-1 items-center justify-center p-8 bg-white">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center max-w-md shadow-sm">
            <div className="w-12 h-12 mx-auto mb-4 text-red-500 bg-red-100/50 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-700">Invalid Permission</h2>
            <p className="mt-2 text-sm text-red-600/80">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 p-8 bg-white overflow-auto">
        <Outlet context={{ user }} />
      </div>
    );
  };

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Sidebar user={user} onLogout={logout} />
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <main className="flex-1 flex flex-col">
          {renderContent()}
        </main>
        <footer className="py-4 px-8 border-t border-gray-100 flex justify-center items-center bg-gray-50/50">
          <p className="text-xs font-normal text-gray-500">
            Copyright © 2026
          </p>
        </footer>
      </div>
    </div>
  );
}