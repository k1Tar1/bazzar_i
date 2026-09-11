import { Outlet } from "react-router-dom";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-secondary-50">
            <DashboardNavbar />

            <div className="flex">
                <DashboardSidebar />

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}