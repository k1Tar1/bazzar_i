export default function Spinner({
    size = "md",
    className = "",
}) {
    const sizes = {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    return (
        <span
            className={`
                inline-block
                shrink-0
                box-border
                animate-spin
                rounded-full
                border-2
                border-current
                border-t-transparent
                ${sizes[size]}
                ${className}
            `}
        />
    );
}