import { useId } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
    label,
    options = [],
    placeholder = "Select an option",
    error,
    helperText,
    leftIcon,
    fullWidth = true,
    required = false,
    className = "",
    containerClassName = "",
    ...props
}) {
    const id = useId();

    return (
        <div
            className={`
                flex flex-col gap-1.5
                ${fullWidth ? "w-full" : ""}
                ${containerClassName}
            `}
        >
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-secondary-800"
                >
                    {label}

                    {required && (
                        <span className="ml-1 text-danger">*</span>
                    )}
                </label>
            )}

            <div className="relative">

                {leftIcon && (
                    <span
                        className="
                            absolute
                            inset-y-0
                            left-0
                            flex
                            w-10
                            items-center
                            justify-center
                            text-secondary-700
                            pointer-events-none
                        "
                    >
                        {leftIcon}
                    </span>
                )}

                <select
                    id={id}
                    aria-invalid={!!error}
                    aria-describedby={
                        error
                            ? `${id}-error`
                            : helperText
                                ? `${id}-helper`
                                : undefined
                    }
                    className={`
                        w-full

                        appearance-none

                        rounded-xl
                        border
                        border-border

                        bg-white

                        py-2.5

                        ${leftIcon ? "pl-11" : "pl-4"}

                        pr-10

                        text-secondary-900

                        outline-none

                        transition-all
                        duration-200

                        focus:border-primary-600
                        focus:ring-4
                        focus:ring-primary-300

                        disabled:bg-gray-100
                        disabled:text-secondary-700
                        disabled:cursor-not-allowed

                        ${error
                            ? "border-danger focus:border-danger focus:ring-red-200"
                            : ""
                        }

                        ${className}
                    `}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={18}
                    className="
                        pointer-events-none

                        absolute
                        right-3
                        top-1/2

                        -translate-y-1/2

                        text-secondary-700
                    "
                />

            </div>

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
    );
}