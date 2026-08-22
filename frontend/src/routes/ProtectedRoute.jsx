import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PageLoader from "../components/common/PageLoader";

export default function ProtectedRoute({ children }) {

    const {
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

    return children;
}