import {
    Package,
    ShoppingCart,
    DollarSign,
    Store,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function SellerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const verificationStatus =
        user?.seller?.verification_status;

    const stats = [
        {
            label: "Total Products",
            value: "0",
            icon: Package,
        },
        {
            label: "Active Products",
            value: "0",
            icon: Package,
        },
        {
            label: "Orders",
            value: "0",
            icon: ShoppingCart,
        },
        {
            label: "Revenue",
            value: "0 DA",
            icon: DollarSign,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">
                    Seller Dashboard
                </h1>

                <p className="mt-1 text-sm text-secondary-600">
                    Welcome back, {user?.first_name || user?.email}.
                    Here's an overview of your store.
                </p>
            </div>

            {/* Verification status */}
            {verificationStatus === "pending" && (
                <Card>
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-amber-100 p-3">
                            <Store className="h-5 w-5 text-amber-600" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-secondary-900">
                                Seller verification is pending
                            </h2>

                            <p className="mt-1 text-sm text-secondary-600">
                                Your seller information is currently
                                being reviewed. Some seller features
                                may not be available until verification
                                is complete.
                            </p>

                            <Link
                                to="/seller/account/seller-verification"
                                className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
                            >
                                View verification status
                            </Link>
                        </div>
                    </div>
                </Card>
            )}

            {verificationStatus === "rejected" && (
                <Card>
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-red-100 p-3">
                            <Store className="h-5 w-5 text-red-600" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-secondary-900">
                                Seller verification was rejected
                            </h2>

                            <p className="mt-1 text-sm text-secondary-600">
                                Please review your seller information
                                and make the necessary corrections.
                            </p>

                            <Link
                                to="/seller/account/seller-status"
                                className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
                            >
                                Review seller profile
                            </Link>
                        </div>
                    </div>
                </Card>
            )}

            {verificationStatus === "unverified" && (
                <Card>
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-amber-100 p-3">
                            <Store className="h-5 w-5 text-amber-600" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-secondary-900">
                                Seller verification required
                            </h2>

                            <p className="mt-1 text-sm text-secondary-600">
                                Complete your seller verification to
                                start using seller features.
                            </p>

                            <Link
                                to="/seller/account/seller-verification"
                                className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
                            >
                                Complete seller verification
                            </Link>
                        </div>
                    </div>
                </Card>
            )}

            {verificationStatus === "verified" && (
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-100 p-3">
                            <Store className="h-5 w-5 text-green-600" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-secondary-900">
                                Your seller account is verified
                            </h2>

                            <p className="text-sm text-secondary-600">
                                You can now use the seller features.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.label}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-secondary-500">
                                        {stat.label}
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold text-secondary-900">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-primary-50 p-3">
                                    <Icon className="h-5 w-5 text-primary-600" />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent orders */}
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-secondary-900">
                            Recent Orders
                        </h2>

                        <p className="mt-1 text-sm text-secondary-600">
                            Your latest customer orders will appear here.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            navigate("/seller/orders");
                        }}
                    >
                        View Orders
                    </Button>
                </div>

                <div className="mt-6 rounded-lg border border-dashed border-secondary-300 p-8 text-center">
                    <ShoppingCart className="mx-auto h-8 w-8 text-secondary-400" />

                    <p className="mt-3 text-sm font-medium text-secondary-700">
                        No orders yet
                    </p>

                    <p className="mt-1 text-sm text-secondary-500">
                        Your recent orders will appear here once customers
                        start purchasing your products.
                    </p>
                </div>
            </Card>
        </div>
    );
}