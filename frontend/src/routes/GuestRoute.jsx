import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

export default function GuestRoute({ children }) {

    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <PageLoader />;
    }

    if (isAuthenticated && user?.is_email_verified) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}