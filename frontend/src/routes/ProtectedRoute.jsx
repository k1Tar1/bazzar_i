import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

export default function ProtectedRoute({
    children,
    allowUnverified = false,
    allowIncompleteProfile = false,
    allowCustomerOnly = false,
}) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user.is_email_verified && !allowUnverified) {
        return <Navigate to="/verify-email" replace />;
    }

    if (!user.profile_complete && !allowIncompleteProfile) {
        return <Navigate to="/complete-profile" replace />;
    }

    if (allowCustomerOnly && (user.is_seller || user?.is_admin)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children || <Outlet />;
}
