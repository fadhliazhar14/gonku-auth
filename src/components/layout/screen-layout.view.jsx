export default function ScreenLayout({
  title,
  description,
  actionPlaceholder,
  children
}) {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {(title || description || actionPlaceholder) && (
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          {(title || description) && (
            <div>
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
          )}
          {actionPlaceholder && (
            <div className="mt-4 sm:mt-0">
              {actionPlaceholder}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
