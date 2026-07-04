export default function ScreenLayout({
  titlePlaceholder,
  actionPlaceholder,
  children
}) {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {(titlePlaceholder || actionPlaceholder) && (
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          {titlePlaceholder && (
            <div>
              {titlePlaceholder}
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
