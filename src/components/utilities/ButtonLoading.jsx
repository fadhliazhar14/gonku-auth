export default function ButtonLoading({
    children,
    isLoading = false,
    isShowLabelOnLoading = false,
    style = "",
    onClick
}) {
    const baseStyles = "cursor-pointer bg-indigo-500 px-3 py-2 hover:bg-indigo-600 flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-white/70";

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`${baseStyles} ${style}`}
            >
            {isLoading && (
                 <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            <span className="text-white">{isLoading ? (isShowLabelOnLoading ? children : '') : children}</span>
        </button>
    )
}