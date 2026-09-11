import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

export default function GuestRoute({ children }) {

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (isAuthenticated && user?.profile_complete && !user?.is_email_verified) {
        return (
            <Navigate
                to="/verify-email"
                replace
            />
        );
    }

    if (isAuthenticated && !user?.profile_complete) {
        return (
            <Navigate
                to="/complete-profile"
                replace
            />
        );
    }

    if (isAuthenticated && user?.profile_complete && user?.is_email_verified) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}