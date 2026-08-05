export default function AuthLayout({
    children,
}) {
    return (
        <main
            className="
                min-h-screen

                flex
                items-center
                justify-center

                bg-gray-50

                px-4
                py-8
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                "
            >
                {children}
            </div>
        </main>
    );
}