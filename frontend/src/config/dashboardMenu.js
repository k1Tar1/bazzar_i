import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Store,
    Users,
    Headphones,
    User,
    LayoutDashboard,
    ShieldCheck,
    FileCheck,
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
            label: "Profile",
            path: "/account/profile",
            icon: User,
        },
    ],

    seller: [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Overview",
            path: "/seller",
        },
        {
            label: "Stores",
            path: "/seller/stores",
        },
        {
            label: "Products",
            path: "/seller/products",
        },
        {
            label: "Orders",
            path: "/seller/orders",
        },
        {
            label: "Analytics",
            path: "/seller/analytics",
        },
        {
            label: "Subscription",
            path: "/seller/subscription",
        },
        {
            label: "Payments",
            path: "/seller/payments",
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
            label: "Identity Verification",
            path: "/admin/id-verifications",
            icon: ShieldCheck,
        },

        {
            label: "Business Registration",
            path: "/admin/registration-verifications",
            icon: FileCheck,
        },
        {
            label: "Orders",
            path: "/admin/orders",
            icon: ShoppingCart,
        },
        {
            label: "Support",
            path: "/admin/support",
            icon: Headphones,
        },
    ],
};