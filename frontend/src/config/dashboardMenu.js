import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Store,
    Users,
    Headphones,
    User,
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
            path: "/seller/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Overview",
            path: "/seller",
            icon: LayoutDashboard,
        },
        {
            label: "Stores",
            path: "/seller/stores",
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
            label: "Analytics",
            path: "/seller/analytics",
            icon: LayoutDashboard,
        },
        {
            label: "Subscription",
            path: "/seller/subscription",
            icon: LayoutDashboard,
        },
        {
            label: "Payments",
            path: "/seller/payments",
            icon: LayoutDashboard,
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