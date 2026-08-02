import { useId } from "react";

export default function Checkbox({
    label,
    helperText,
    error,
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    required = false,
    fullWidth = true,
    className = "",
    containerClassName = "",
    ...props
}) {
    const id = useId();

    return (
        <div
            className={`
                ${fullWidth ? "w-full" : ""}
                ${containerClassName}
            `}
        >
            <label
                htmlFor={id}
                className={`
                    flex
                    items-start
                    gap-3
                    cursor-pointer
                    select-none

                    ${disabled ? "cursor-not-allowed opacity-60" : ""}
                `}
            >
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={
                        error
                            ? `${id}-error`
                            : helperText
                                ? `${id}-helper`
                                : undefined
                    }
                    className={`
                        mt-0.5
                        h-4
                        w-4
                        shrink-0

                        rounded
                        border-border

                        accent-primary-600

                        focus:ring-2
                        focus:ring-primary-300

                        ${className}
                    `}
                    {...props}
                />

                <div className="flex flex-col gap-1">
                    {label && (
                        <span className="text-sm text-secondary-900">
                            {label}

                            {required && (
                                <span className="ml-1 text-danger">
                                    *
                                </span>
                            )}
                        </span>
                    )}

                    {helperText && !error && (
                        <p
                            id={`${id}-helper`}
                            className="text-sm text-secondary-700"
                        >
                            {helperText}
                        </p>
                    )}

                    {error && (
                        <p
                            id={`${id}-error`}
                            className="text-sm text-danger"
                        >
                            {error}
                        </p>
                    )}
                </div>
            </label>
        </div>
    );
}