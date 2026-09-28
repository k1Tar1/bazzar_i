import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getIdVerificationRequests } from "../../api/admin";

import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";


export default function AdminIdVerifications() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            setLoading(true);
            setError(null);

            const response =
                await getIdVerificationRequests();

            setRequests(response.data);
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to load identity verification requests."
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-semibold text-secondary-900">
                    Identity Verification
                </h1>

                <p className="mt-1 text-sm text-secondary-600">
                    Review seller identity verification requests.
                </p>
            </div>

            {error && (
                <Alert
                    type="error"
                    message={error}
                />
            )}

            {!error && requests.length === 0 && (
                <Card>
                    <p className="text-sm text-secondary-600">
                        There are no identity verification requests.
                    </p>
                </Card>
            )}

            {requests.length > 0 && (
                <Card className="overflow-hidden p-0">

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">

                            <thead className="bg-secondary-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                                        Seller
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                                        NIN
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                                        Created
                                    </th>

                                    <th className="px-6 py-3">
                                        <span className="sr-only">
                                            View
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-secondary-200 bg-white">

                                {requests.map((request) => (
                                    <tr key={request.id}>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="font-medium text-secondary-900">
                                                {request.seller_name || "—"}
                                            </div>

                                            <div className="text-sm text-secondary-500">
                                                {request.seller_email}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                                            {request.nin}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                                                {request.status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-500">
                                            {new Date(
                                                request.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <Link
                                                to={`/admin/id-verifications/${request.id}`}
                                                className="font-medium text-primary-600 hover:text-primary-700"
                                            >
                                                Review
                                            </Link>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>

                </Card>
            )}
        </div>
    );
}