export default function Divider({
    children,
    orientation = "horizontal",
    className = "",
}) {
    if (orientation === "vertical") {
        return (
            <div
                className={`
                    inline-flex
                    items-center
                    justify-center
                    self-stretch

                    ${className}
                `}
            >
                <div className="w-px h-full bg-border" />
            </div>
        );
    }

    return (
        <div
            className={`
                flex
                items-center
                w-full

                ${className}
            `}
        >
            <div className="flex-1 border-t border-border" />

            {children && (
                <span
                    className="
                        mx-4
                        shrink-0

                        text-sm
                        text-secondary-700
                    "
                >
                    {children}
                </span>
            )}

            <div className="flex-1 border-t border-border" />
        </div>
    );
}