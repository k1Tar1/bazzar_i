export default function AuthFooter({
    children,
}) {
    return (
        <div
            className="
                mt-6

                text-center

                text-sm
                text-secondary-700
            "
        >
            {children}
        </div>
    );
}