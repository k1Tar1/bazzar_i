export default function AuthHeader({
    logo,
    title,
    subtitle,
}) {
    return (
        <div className="mb-8 text-center">

            {logo && (
                <div className="mb-6 flex justify-center">
                    {logo}
                </div>
            )}

            <h1
                className="
                    text-3xl
                    font-bold
                    text-secondary-900
                "
            >
                {title}
            </h1>

            {subtitle && (
                <p
                    className="
                        mt-2
                        text-secondary-700
                    "
                >
                    {subtitle}
                </p>
            )}

        </div>
    );
}