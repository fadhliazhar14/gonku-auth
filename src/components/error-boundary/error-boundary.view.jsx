import { useRouteError } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="w-full h-16 mb-4 text-red-500 bg-red-50 rounded-full flex items-center justify-center">
        <svg
          width="32"
          height="32"
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
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        The application encountered an unexpected error. We've been notified and are working on
        it.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-[#0040C1] text-white font-medium rounded-lg hover:bg-[#0035A1] transition-colors shadow-sm"
      >
        Refresh Page
      </button>

      <details className="mt-8 text-left w-full max-w-2xl bg-white p-4 rounded border border-red-100 text-xs overflow-auto">
        <summary className="cursor-pointer font-semibold text-red-700 mb-2">
          Error Details (Development Only)
        </summary>
        <pre className="text-red-600 whitespace-pre-wrap">{error?.stack || error?.message || String(error)}</pre>
      </details>
    </div>
  );
}