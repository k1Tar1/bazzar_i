import {
    ShoppingBag,
    Clock,
    Truck,
    CheckCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">

            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                    Welcome back, {user?.first_name || "Customer"}!
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    Here's an overview of your shopping activity.
                </p>
            </div>


            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary-500">
                                Total Orders
                            </p>

                            <p className="mt-2 text-2xl font-bold text-secondary-900">
                                0
                            </p>
                        </div>

                        <div className="rounded-lg bg-primary-50 p-3 text-primary-600">
                            <ShoppingBag size={22} />
                        </div>
                    </div>
                </Card>


                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary-500">
                                Pending
                            </p>

                            <p className="mt-2 text-2xl font-bold text-secondary-900">
                                0
                            </p>
                        </div>

                        <div className="rounded-lg bg-secondary-100 p-3 text-secondary-600">
                            <Clock size={22} />
                        </div>
                    </div>
                </Card>


                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary-500">
                                In Delivery
                            </p>

                            <p className="mt-2 text-2xl font-bold text-secondary-900">
                                0
                            </p>
                        </div>

                        <div className="rounded-lg bg-secondary-100 p-3 text-secondary-600">
                            <Truck size={22} />
                        </div>
                    </div>
                </Card>


                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-secondary-500">
                                Completed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-secondary-900">
                                0
                            </p>
                        </div>

                        <div className="rounded-lg bg-success-50 p-3 text-success-600">
                            <CheckCircle size={22} />
                        </div>
                    </div>
                </Card>

            </div>


            {/* Recent orders */}
            <Card>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-secondary-900">
                        Recent Orders
                    </h2>

                    <p className="text-sm text-secondary-500">
                        Your latest purchases will appear here.
                    </p>
                </div>

                <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-secondary-200">
                    <p className="text-sm text-secondary-500">
                        You don't have any orders yet.
                    </p>
                </div>
            </Card>

        </div>
    );
}