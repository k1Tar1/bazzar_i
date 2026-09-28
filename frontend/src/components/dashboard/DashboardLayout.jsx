import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

import { dashboardMenus } from "../../config/dashboardMenu";

export default function DashboardLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    let dashboardType = "customer";

    if (location.pathname.startsWith("/seller")) {
        dashboardType = "seller";
    } else if (location.pathname.startsWith("/admin")) {
        dashboardType = "admin";
    }

    const menuItems = dashboardMenus[dashboardType];

    return (
        <div className="min-h-screen bg-secondary-50">

            <DashboardSidebar
                menuItems={menuItems}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-64">

                <DashboardNavbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}