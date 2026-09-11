import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Divider from "../../components/ui/Divider";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

import { AuthLayout, AuthHeader, AuthFooter } from "../../components/layouts";

console.log(
    "Google Client ID:",
    JSON.stringify(import.meta.env.VITE_GOOGLE_CLIENT_ID)
);

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const user = await login(
                formData.email,
                formData.password
            );

            if (!user.is_email_verified) {
                navigate("/verify-email");
                return;
            }

            // Redirect based on the user's role.
            if (user.is_seller) {
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (error) {
            const responseData = error.response?.data;

            if (responseData?.detail) {
                setError(responseData.detail);
            } else {
                setError("Invalid email or password.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <AuthHeader
                title="Welcome back"
                subtitle="Sign in to your account"
            />

            <Card className="w-full">
                <div className="space-y-6">

                    {/* Error message */}
                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}

                    {/* Login form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail size={18} />}
                            required
                            fullWidth
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            leftIcon={<Lock size={18} />}
                            required
                            fullWidth
                        />

                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Sign in
                        </Button>
                    </form>

                    <Divider>
                        OR
                    </Divider>

                    <GoogleLoginButton />

                </div>
            </Card>

            <AuthFooter>
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-700"
                >
                    Create an account
                </Link>
            </AuthFooter>
        </AuthLayout>
    );
}