import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

export default function ProtectedRoute({ children, allowUnverified = false }) {

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (!user?.is_email_verified && !allowUnverified) {
        return <Navigate to="/verify-email" replace />;
    }

    if (!user?.profile_complete) {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
}