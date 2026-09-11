import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardRouter() {
    const { user } = useAuth();

    if (user?.is_admin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.is_seller) {
        return <Navigate to="/seller/dashboard" replace />;
    }

    return <Navigate to="/dashboard/customer" replace />;
}