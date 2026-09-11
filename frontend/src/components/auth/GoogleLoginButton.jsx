import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/AuthContext";


export default function GoogleLoginButton() {
    const { loginWithGoogle } = useAuth();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function handleSuccess(credentialResponse) {
        setError("");

        if (!credentialResponse?.credential) {
            setError("Google did not provide a valid credential.");
            return;
        }

        try {
            setLoading(true);

            const user = await loginWithGoogle(credentialResponse.credential);

            if (!user.profile_complete) {
                navigate("/complete-profile");
                return;
            }

            if (user.is_seller) {
                navigate("/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            const responseData = error.response?.data;

            if (responseData?.detail) {
                setError(responseData.detail);
            } else if (responseData?.credential) {
                const credentialError = responseData.credential;

                setError(
                    Array.isArray(credentialError)
                        ? credentialError[0]
                        : credentialError
                );
            } else {
                setError("Google login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleError() {
        setError("Google login failed. Please try again.");
    }

    return (
        <div className="space-y-2">
            <div
                className={
                    loading
                        ? "pointer-events-none opacity-60"
                        : ""
                }
            >
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="continue_with"
                />
            </div>

            {loading && (
                <p className="text-center text-sm text-gray-500">
                    Signing in with Google...
                </p>
            )}

            {error && (
                <p className="text-center text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}