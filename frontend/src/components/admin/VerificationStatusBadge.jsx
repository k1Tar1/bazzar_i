export default function VerificationStatusBadge({
    status,
}) {
    const styles = {
        pending:
            "bg-yellow-100 text-yellow-800",

        rejected:
            "bg-red-100 text-red-800",

        verified:
            "bg-green-100 text-green-800",

        unsubmitted:
            "bg-secondary-100 text-secondary-700",
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ||
                "bg-secondary-100 text-secondary-700"
                }`}
        >
            {status}
        </span>
    );
}