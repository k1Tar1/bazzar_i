import Spinner from "./Spinner";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    loadingText = null,
    leftIcon = null,
    rightIcon = null,
    className = "",
    onClick,
}) {
    const variants = {
        primary:
            "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300",

        secondary:
            "bg-secondary-800 text-white hover:bg-secondary-900 focus:ring-secondary-300",

        outline:
            "border border-border bg-white text-secondary-800 hover:bg-gray-50",

        danger:
            "bg-danger text-white hover:brightness-95 focus:ring-primary-300",

        success:
            "bg-success text-white hover:brightness-95 focus:ring-primary-300",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
    };

    // const spinnerSizes = {
    //     sm: 14,
    //     md: 16,
    //     lg: 20,
    // };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                flex
                items-center
                justify-center
                gap-2

                rounded-xl

                font-medium

                transition-all
                duration-200

                focus:outline-none
                focus:ring-4

                disabled:opacity-60
                disabled:cursor-not-allowed

                active:scale-[0.98]

                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
        >
            {loading ? (
                <>
                    <Spinner size={size} />
                    <span>{loadingText ?? children}</span>
                </>
            ) : (
                <>
                    {leftIcon && (
                        <span className="flex items-center">
                            {leftIcon}
                        </span>
                    )}

                    <span>{children}</span>

                    {rightIcon && (
                        <span className="flex items-center">
                            {rightIcon}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}