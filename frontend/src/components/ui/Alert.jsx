import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

export default function Alert({
    variant = "info",
    title,
    children,
    dismissible = false,
    onClose,
    className = "",
}) {
    const variants = {
        success: {
            icon: CheckCircle2,
            container:
                "bg-success/10 border-success/30 text-success",
        },

        error: {
            icon: AlertCircle,
            container:
                "bg-danger/10 border-danger/30 text-danger",
        },

        warning: {
            icon: AlertTriangle,
            container:
                "bg-warning-50 border-warning-300 text-warning-700"
        },

        info: {
            icon: Info,
            container:
                "bg-primary-50 border-primary-300 text-primary-700",
        },
    };

    const { icon: Icon, container } = variants[variant];

    return (
        <div
            role="alert"
            className={`
                flex
                items-start
                gap-3

                rounded-xl
                border

                p-4

                ${container}

                ${className}
            `}
        >
            <Icon
                size={20}
                className="mt-0.5 shrink-0"
            />

            <div className="min-w-0 flex-1">

                {title && (
                    <h3 className="font-semibold">
                        {title}
                    </h3>
                )}

                {children && (
                    <div
                        className={`
                            ${title ? "mt-1" : ""}
                            text-sm
                        `}
                    >
                        {children}
                    </div>
                )}

            </div>

            {dismissible && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close alert"
                    className="
                        self-center
                        shrink-0
                        rounded-lg
                        p-1

                        transition-colors

                        hover:bg-black/5
                    "
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}