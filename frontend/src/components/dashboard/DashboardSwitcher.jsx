import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Select from "../ui/Select";

export default function DashboardSwitcher() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = user?.is_admin;
    const isSeller = user?.is_seller;

    if (!isAdmin && !isSeller) {
        return null;
    }

    let currentDashboard = "customer";

    if (location.pathname.startsWith("/admin/")) {
        currentDashboard = "admin";
    } else if (location.pathname.startsWith("/seller/")) {
        currentDashboard = "seller";
    }

    function handleChange(event) {
        const dashboard = event.target.value;

        if (dashboard === "admin") {
            navigate("/admin/dashboard");
        }

        if (dashboard === "seller") {
            navigate("/seller/dashboard");
        }

        if (dashboard === "customer") {
            navigate("/dashboard/customer");
        }
    }

    return (
        <Select
            value={currentDashboard}
            onChange={handleChange}
            options={[
                ...(isAdmin
                    ? [{ value: "admin", label: "Admin Dashboard" }]
                    : []),

                ...(isSeller || isAdmin
                    ? [{ value: "seller", label: "Seller Dashboard" }]
                    : []),

                {
                    value: "customer",
                    label: "Customer Dashboard",
                },
            ]}
        />
    );
}