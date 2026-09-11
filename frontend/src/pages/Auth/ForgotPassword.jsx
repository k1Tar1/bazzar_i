import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { requestPasswordReset } from "../../api/auth";

import AuthLayout from "../../components/layouts/AuthLayout";
import AuthHeader from "../../components/layouts/AuthHeader";
import AuthFooter from "../../components/layouts/AuthFooter";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            await requestPasswordReset(email);

            setSubmitted(true);
        } catch (error) {
            const responseData = error.response?.data;

            if (responseData?.email) {
                const emailError = responseData.email;

                setError(
                    Array.isArray(emailError)
                        ? emailError[0]
                        : emailError
                );
            } else if (responseData?.detail) {
                setError(responseData.detail);
            } else {
                setError(
                    "Unable to process your request. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <AuthLayout>
                <Card className="w-full max-w-md">
                    <AuthHeader
                        title="Check your email"
                        subtitle={`If an account exists for ${email}, we've sent you a password reset link.`}
                    />

                    <div className="mt-6 space-y-4">
                        <p className="text-center text-sm text-secondary-600">
                            Check your inbox and follow the link
                            to create a new password.
                        </p>

                        <Link
                            to="/login"
                            className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            Back to login
                        </Link>
                    </div>

                    <AuthFooter />
                </Card>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <AuthHeader
                    title="Forgot your password?"
                    subtitle="Enter your email address and we'll send you a link to reset your password."
                />

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    {error && (
                        <Alert
                            variant="danger"
                            message={error}
                        />
                    )}

                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your email"
                        leftIcon={<Mail size={18} />}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        Send reset link
                    </Button>

                    <Link
                        to="/login"
                        className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Back to login
                    </Link>
                </form>

                <AuthFooter />
            </Card>
        </AuthLayout>
    );
}