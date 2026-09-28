import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ShieldCheck,
    FileCheck,
} from "lucide-react";

import {
    getVerificationSummary,
} from "../../api/admin";

import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";

export default function AdminDashboard() {

    const [verificationSummary, setVerificationSummary] =
        useState(null);

    const [verificationLoading, setVerificationLoading] =
        useState(true);

    const [verificationError, setVerificationError] =
        useState(null);

    useEffect(() => {
        loadVerificationSummary();
    }, []);

    async function loadVerificationSummary() {
        try {
            setVerificationLoading(true);
            setVerificationError(null);

            const response =
                await getVerificationSummary();

            setVerificationSummary(response.data);
        } catch (error) {
            setVerificationError(
                error.response?.data?.detail ||
                "Failed to load verification summary."
            );
        } finally {
            setVerificationLoading(false);
        }
    }

    return (
        <Card>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-secondary-900">
                        Seller Verification
                    </h2>

                    <p className="mt-1 text-sm text-secondary-600">
                        Verification requests requiring review.
                    </p>
                </div>
            </div>


            {verificationError && (
                <div className="mt-4">
                    <Alert
                        type="error"
                        message={verificationError}
                    />
                </div>
            )}


            {verificationLoading && (
                <div className="flex justify-center py-8">
                    <Spinner size="md" />
                </div>
            )}


            {!verificationLoading &&
                !verificationError &&
                verificationSummary && (

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                        {/* Identity */}

                        <Link
                            to="/admin/id-verifications"
                            className="rounded-xl border border-secondary-200 p-5 transition hover:border-primary-300 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <ShieldCheck className="h-6 w-6 text-primary-600" />

                                    <h3 className="mt-3 font-semibold text-secondary-900">
                                        Identity Verification
                                    </h3>
                                </div>

                                <span className="text-2xl font-semibold text-secondary-900">
                                    {verificationSummary.identity.pending}
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-secondary-600">
                                Pending requests
                            </p>

                        </Link>


                        {/* Registration */}

                        <Link
                            to="/admin/registration-verifications"
                            className="rounded-xl border border-secondary-200 p-5 transition hover:border-primary-300 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <FileCheck className="h-6 w-6 text-primary-600" />

                                    <h3 className="mt-3 font-semibold text-secondary-900">
                                        Business Registration
                                    </h3>
                                </div>

                                <span className="text-2xl font-semibold text-secondary-900">
                                    {verificationSummary.registration.pending}
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-secondary-600">
                                Pending requests
                            </p>

                        </Link>

                    </div>
                )}

        </Card>
    )
}