export default function Button({
    enabled = true,
    isFormDefault = false,
    visible = true,
    styleClasses = "",
    attributes = {},
    handlerOnClick,
    children,
    // Fallback props for flexibility
    disabled,
    type,
    onClick,
    className = "",
    ...props
}) {
    if (!visible) {
        return null;
    }

    const isDisabled = disabled !== undefined ? disabled : !enabled;
    const buttonType = isFormDefault ? "submit" : (type || attributes?.type || "button");
    const handleClick = handlerOnClick || onClick || attributes?.onClick;

    const baseStyle = "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-150";
    const customClasses = styleClasses || className || attributes?.className || "";
    const combinedClasses = customClasses ? `${baseStyle} ${customClasses}` : baseStyle;

    return (
        <button
            type={buttonType}
            disabled={isDisabled}
            onClick={handleClick}
            className={combinedClasses}
            {...attributes}
            {...props}
        >
            {children}
        </button>
    );
}
