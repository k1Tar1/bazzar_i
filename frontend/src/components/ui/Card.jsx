export default function Card({
    title,
    subtitle,
    header,
    footer,
    children,
    padding = "md",
    hover = false,
    className = "",
}) {
    const paddings = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={`
                overflow-hidden

                rounded-2xl
                border
                border-border

                bg-white

                shadow-sm

                ${hover
                    ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    : ""
                }

                ${className}
            `}
        >
            {(header || title || subtitle) && (
                <div className="border-b border-border p-6">

                    {header ? (
                        header
                    ) : (
                        <>
                            {title && (
                                <h2 className="text-lg font-semibold text-secondary-900">
                                    {title}
                                </h2>
                            )}

                            {subtitle && (
                                <p className="mt-1 text-sm text-secondary-700">
                                    {subtitle}
                                </p>
                            )}
                        </>
                    )}

                </div>
            )}

            <div className={paddings[padding]}>
                {children}
            </div>

            {footer && (
                <div className="border-t border-border p-6">
                    {footer}
                </div>
            )}
        </div>
    );
}