import { useState } from "react";
import { Lock } from "lucide-react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { confirmPasswordReset } from "../../api/auth";

import AuthLayout from "../../components/layouts/AuthLayout";
import AuthHeader from "../../components/layouts/AuthHeader";
import AuthFooter from "../../components/layouts/AuthFooter";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function ResetPassword() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        new_password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (
            !formData.new_password ||
            !formData.confirm_password
        ) {
            setError("Please fill in both password fields.");
            return;
        }

        if (
            formData.new_password !==
            formData.confirm_password
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await confirmPasswordReset({
                uid,
                token,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password,
            });

            setSuccess(true);
        } catch (error) {
            const responseData = error.response?.data;

            if (responseData?.detail) {
                setError(responseData.detail);
            } else if (responseData?.token) {
                const tokenError = responseData.token;

                setError(
                    Array.isArray(tokenError)
                        ? tokenError[0]
                        : tokenError
                );
            } else if (responseData?.new_password) {
                const passwordError =
                    responseData.new_password;

                setError(
                    Array.isArray(passwordError)
                        ? passwordError[0]
                        : passwordError
                );
            } else if (responseData?.confirm_password) {
                const passwordError =
                    responseData.confirm_password;

                setError(
                    Array.isArray(passwordError)
                        ? passwordError[0]
                        : passwordError
                );
            } else {
                setError(
                    "Unable to reset your password. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <AuthLayout>
                <Card className="w-full max-w-md">
                    <AuthHeader
                        title="Password reset successfully"
                        subtitle="Your password has been changed successfully."
                    />

                    <div className="mt-6">
                        <Button
                            type="button"
                            fullWidth
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Go to login
                        </Button>
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
                    title="Reset your password"
                    subtitle="Enter your new password below."
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
                        label="New password"
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        leftIcon={<Lock size={18} />}
                        required
                    />

                    <Input
                        label="Confirm password"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        leftIcon={<Lock size={18} />}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        Reset password
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