import Card from "../ui/Card";

export default function AuthCard({
    title,
    subtitle,
    icon,
    children,
    footer,
    maxWidth = "max-w-md",
}) {
    return (
        <div
            className={`
                flex
                min-h-screen
                items-center
                justify-center
                px-4
                py-8
            `}
        >
            <Card
                className={`
                    w-full
                    ${maxWidth}
                    p-8
                `}
            >
                {(icon || title || subtitle) && (
                    <header className="mb-8 text-center">

                        {icon && (
                            <div
                                className="
                                    mx-auto
                                    mb-6
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary-100
                                    text-primary-600
                                "
                            >
                                {icon}
                            </div>
                        )}

                        {title && (
                            <h1 className="text-3xl font-bold text-secondary-900">
                                {title}
                            </h1>
                        )}

                        {subtitle && (
                            <p className="mt-3 text-secondary-700">
                                {subtitle}
                            </p>
                        )}

                    </header>
                )}

                <main>
                    {children}
                </main>

                {footer && (
                    <footer className="mt-8">
                        {footer}
                    </footer>
                )}

            </Card>
        </div>
    );
}