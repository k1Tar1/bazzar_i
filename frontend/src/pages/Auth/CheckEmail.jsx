import { useLocation, Link } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Divider from "../../components/ui/Divider";

export default function CheckEmail() {
    const location = useLocation();

    const email = location.state?.email;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleResend = async () => {
        try {
            setLoading(true);

            // TODO:
            // await resendVerificationEmail(email);

            setMessage(
                "A new verification email has been sent."
            );
        } catch {
            setMessage(
                "Unable to resend the verification email."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
            <Card className="w-full p-8">

                <div className="flex flex-col items-center text-center">

                    <div
                        className="
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
                        <Mail size={36} />
                    </div>

                    <h1 className="text-3xl font-bold text-secondary-900">
                        Check your email
                    </h1>

                    <p className="mt-3 text-secondary-700">
                        We've sent a verification link to
                    </p>

                    {email && (
                        <p className="mt-2 break-all font-semibold text-secondary-900">
                            {email}
                        </p>
                    )}

                    <p className="mt-6 text-sm leading-6 text-secondary-700">
                        Click the link in the email to activate your account.
                        After verification you'll be able to sign in.
                    </p>

                </div>

                <Divider className="my-8">
                    Didn't receive it?
                </Divider>

                {message && (
                    <Alert
                        variant="success"
                    >
                        {message}
                    </Alert>
                )}

                <div className="mt-6 flex flex-col gap-4">

                    <Button
                        fullWidth
                        loading={loading}
                        leftIcon={<RefreshCw size={18} />}
                        onClick={handleResend}
                    >

                        Resend verification email
                    </Button>

                    <Link to="/login">
                        <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<ArrowLeft size={18} />}
                        >
                            Back to Login
                        </Button>
                    </Link>

                </div>

            </Card>
        </div>
    );
}