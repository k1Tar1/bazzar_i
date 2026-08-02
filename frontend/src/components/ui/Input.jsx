import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    type = "text",
    showPasswordToggle = true,
    fullWidth = true,
    required = false,
    className = "",
    containerClassName = "",
    ...props
}) {
    const id = useId();

    const isPassword = type === "password";

    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        isPassword && showPassword
            ? "text"
            : type;

    const inputRightIcon =
        isPassword && showPasswordToggle ? (
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                    flex
                    items-center
                    justify-center
                    text-secondary-700
                    hover:text-primary-600
                    transition-colors
                "
                aria-label={
                    showPassword
                        ? "Hide password"
                        : "Show password"
                }
            >
                {showPassword ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
            </button>
        ) : (
            rightIcon
        );

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
                        <span className="ml-1 text-danger">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="relative">

                {leftIcon && (
                    <div
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
                    </div>
                )}

                <input
                    id={id}
                    type={inputType}
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

                        rounded-xl
                        border
                        border-border
                        bg-white

                        py-2.5

                        ${leftIcon ? "pl-11" : "pl-4"}
                        ${inputRightIcon ? "pr-11" : "pr-4"}

                        text-secondary-900
                        placeholder:text-secondary-700

                        outline-none

                        transition-all
                        duration-200

                        focus:border-primary-600
                        focus:ring-4
                        focus:ring-primary-300

                        disabled:bg-gray-100
                        disabled:text-secondary-700
                        disabled:cursor-not-allowed

                        read-only:bg-gray-50

                        ${error
                            ? "border-danger focus:border-danger focus:ring-red-200"
                            : ""
                        }

                        ${className}
                    `}
                    {...props}
                />

                {inputRightIcon && (
                    <div
                        className="
                            absolute
                            inset-y-0
                            right-0
                            flex
                            w-10
                            items-center
                            justify-center
                        "
                    >
                        {inputRightIcon}
                    </div>
                )}

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