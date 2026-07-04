const DEFAULT_INPUT_STYLE = "block w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 disabled:border-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500 disabled:shadow-none";

export default function Input({
    id,
    label,
    type = "text",
    placeholder,
    enabled = true,
    disabled,
    mandatory = false,
    register,
    error,
    value,
    onChange,
    styleClasses = DEFAULT_INPUT_STYLE,
    className = "",
    containerClassName = "",
    labelClassName,
    errorClassName,
    ...props
}) {
    const isDisabled = disabled !== undefined ? disabled : !enabled;
    const errorMessage = typeof error === "string" ? error : error?.message;

    const baseStyle = styleClasses !== undefined ? styleClasses : DEFAULT_INPUT_STYLE;
    const normalOutlineStyle = "outline-gray-300 focus:outline-indigo-600";
    const errorOutlineStyle = "outline-red-600 focus:outline-red-600";

    const computedClass = `${baseStyle} ${errorMessage ? errorOutlineStyle : normalOutlineStyle}`;
    const inputClasses = className ? `${computedClass} ${className}` : computedClass;

    const defaultLabelClass = "block text-sm/6 font-medium text-gray-900";
    const defaultErrorClass = "mt-1 text-xs text-red-600";

    return (
        <div className={containerClassName}>
            {label && (
                <label htmlFor={id} className={labelClassName || defaultLabelClass}>
                    {label}
                    {mandatory && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className={label ? "mt-2" : ""}>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    required={mandatory}
                    {...(value !== undefined ? { value } : {})}
                    {...(onChange ? { onChange } : {})}
                    {...(register || {})}
                    className={inputClasses}
                    {...props}
                />
            </div>
            {errorMessage && (
                <p className={errorClassName || defaultErrorClass}>
                    {errorMessage}
                </p>
            )}
        </div>
    );
}

