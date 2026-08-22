import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    LoaderCircle,
    CheckCircle2,
    XCircle,
    Mail,
    ArrowRight,
    RefreshCw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { verifyEmail } from "../../api/auth";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function verify() {

            if (!uid || !token) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {

                await verifyEmail(uid, token);

                setStatus("success");

            } catch (error) {

                setStatus("error");

                if (error.response?.data?.detail) {
                    setMessage(error.response.data.detail);
                } else {
                    setMessage(
                        "The verification link is invalid or has expired."
                    );
                }
            }
        }

        verify();

    }, [uid, token]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-8">

            <Card className="w-full max-w-md p-8">

                {/* Loading */}

                {status === "loading" && (

                    <div className="text-center">

                        <LoaderCircle
                            size={60}
                            className="mx-auto animate-spin text-primary-600"
                        />

                        <h1 className="mt-6 text-3xl font-bold text-secondary-900">
                            Verifying Email
                        </h1>

                        <p className="mt-3 text-secondary-700">
                            Please wait while we verify your account.
                        </p>

                    </div>

                )}

                {/* Success */}

                {status === "success" && (

                    <div className="text-center">

                        <CheckCircle2
                            size={60}
                            className="mx-auto text-success"
                        />

                        <h1 className="mt-6 text-3xl font-bold text-secondary-900">
                            Email Verified
                        </h1>

                        <p className="mt-3 text-secondary-700">
                            Your account has been successfully verified.
                        </p>

                        <Button
                            className="mt-8"
                            fullWidth
                            rightIcon={<ArrowRight size={18} />}
                            onClick={() => navigate("/login")}
                        >
                            Continue to Login
                        </Button>

                    </div>

                )}

                {/* Error */}

                {status === "error" && (

                    <div className="text-center">

                        <XCircle
                            size={60}
                            className="mx-auto text-danger"
                        />

                        <h1 className="mt-6 text-3xl font-bold text-secondary-900">
                            Verification Failed
                        </h1>

                        <p className="mt-3 text-secondary-700">
                            {message}
                        </p>

                        <Alert
                            className="mt-6"
                            variant="warning"
                        >
                            You can request a new verification email.
                        </Alert>

                        <div className="mt-8 flex flex-col gap-4">

                            <Button
                                leftIcon={<RefreshCw size={18} />}
                                fullWidth
                                onClick={() => navigate("/check-email")}
                            >
                                Resend Verification Email
                            </Button>

                            <Button
                                variant="outline"
                                fullWidth
                                leftIcon={<Mail size={18} />}
                                onClick={() => navigate("/login")}
                            >
                                Back to Login
                            </Button>

                        </div>

                    </div>

                )}

            </Card>

        </div>
    );
}