import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Store,
    Users,
    Settings,
    Ticket,
} from "lucide-react";

export const dashboardMenus = {
    customer: [
        {
            label: "Dashboard",
            path: "/dashboard/customer",
            icon: LayoutDashboard,
        },
        {
            label: "Orders",
            path: "/account/orders",
            icon: ShoppingCart,
        },
        {
            label: "Settings",
            path: "/account/settings",
            icon: Settings,
        },
    ],

    seller: [
        {
            label: "Dashboard",
            path: "/seller/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "My Store",
            path: "/seller/store",
            icon: Store,
        },
        {
            label: "Products",
            path: "/seller/products",
            icon: Package,
        },
        {
            label: "Orders",
            path: "/seller/orders",
            icon: ShoppingCart,
        },
        {
            label: "Settings",
            path: "/seller/settings",
            icon: Settings,
        },
    ],

    admin: [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: Users,
        },
        {
            label: "Stores",
            path: "/admin/stores",
            icon: Store,
        },
        {
            label: "Orders",
            path: "/admin/orders",
            icon: ShoppingCart,
        },
        {
            label: "Support",
            path: "/admin/support",
            icon: Ticket,
        },
        {
            label: "Settings",
            path: "/admin/settings",
            icon: Settings,
        },
    ],
};