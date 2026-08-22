import Spinner from "../ui/Spinner";

export default function PageLoader({
    message = "Loading...",
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">

            <Spinner size="lg" />

            <p className="text-secondary-700">
                {message}
            </p>

        </div>
    );
}