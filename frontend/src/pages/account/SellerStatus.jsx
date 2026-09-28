import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Store,
    Save,
} from "lucide-react";

import { getSellerProfile } from "../../api/seller";
import { formatApiErrors } from "../../utils/validation";

import { WILAYAS } from "../../constants/wilayas";

import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import PageLoader from "../../components/common/PageLoader";

export default function SellerStatus() {
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        async function loadSellerProfile() {
            try {
                const response = await getSellerProfile();

                setSeller(response.data);
            } catch (err) {
                setErrors(
                    formatApiErrors(err.response?.data)
                );
            } finally {
                setLoading(false);
            }
        }

        loadSellerProfile();
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    if (!seller) {
        return (
            <div className="mx-auto max-w-2xl">
                <Alert type="error">
                    {errors.general ||
                        "Unable to load your seller profile."}
                </Alert>
            </div>
        );
    }

    const status = seller.verification_status;

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Store size={24} />
                </div>

                <h1 className="text-2xl font-bold text-secondary-900">
                    Seller Status
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    View the current status of your seller account.
                </p>
            </div>

            <Card>
                <div className="flex items-center gap-4">
                    <StatusIcon status={status} />

                    <div>
                        <p className="text-sm text-secondary-500">
                            Verification status
                        </p>

                        <h2 className="text-xl font-semibold text-secondary-900">
                            {getStatusLabel(status)}
                        </h2>
                    </div>
                </div>

                <div className="mt-6 border-t border-secondary-200 pt-6">
                    <StatusMessage status={status} />
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold text-secondary-900">
                    Seller Information
                </h2>

                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm text-secondary-500">
                            NIN
                        </p>

                        <p className="mt-1 font-medium text-secondary-900">
                            {seller.nin}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-secondary-500">
                            NIF
                        </p>

                        <p className="mt-1 font-medium text-secondary-900">
                            {seller.nif}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-secondary-500">
                            Business phone
                        </p>

                        <p className="mt-1 font-medium text-secondary-900">
                            {seller.business_phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-secondary-500">
                            Current business wilaya
                        </p>

                        <p className="mt-1 font-medium text-secondary-900">
                            {/* {WILAYAS.find(
                                (wilaya) => wilaya.value === seller.business_wilaya
                            )?.label} */}
                            {seller.business_wilaya}
                        </p>


                    </div>

                    <div>
                        <p className="text-sm text-secondary-500">
                            Current business addres
                        </p>

                        <p className="mt-1 font-medium text-secondary-900">
                            {seller.business_address}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        loading={loading}
                        leftIcon={<Save size={18} />}
                        variant="secondary"
                        onClick={() => navigate("/account/seller-profile")}
                    >
                        Edit Seller Information
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function StatusIcon({ status }) {
    if (status === "verified") {
        return (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success-600">
                <CheckCircle size={26} />
            </div>
        );
    }

    if (status === "rejected") {
        return (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-600">
                <XCircle size={26} />
            </div>
        );
    }

    if (status === "pending") {
        return (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Clock size={26} />
            </div>
        );
    }

    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
            <AlertCircle size={26} />
        </div>
    );
}

function getStatusLabel(status) {
    switch (status) {
        case "verified":
            return "Verified";

        case "pending":
            return "Verification Pending";

        case "rejected":
            return "Verification Rejected";

        case "unverified":
            return "Not Verified";

        default:
            return "Unknown";
    }
}

function StatusMessage({ status }) {
    switch (status) {
        case "verified":
            return (
                <p className="text-sm text-secondary-600">
                    Your seller account has been verified. You can now access seller functionality.
                </p>
            );

        case "pending":
            return (
                <p className="text-sm text-secondary-600">
                    Your seller information has been submitted and is currently being reviewed.
                </p>
            );

        case "rejected":
            return (
                <p className="text-sm text-secondary-600">
                    Your seller verification was rejected. Please review the requirements and update your information.
                </p>
            );

        default:
            return (
                <p className="text-sm text-secondary-600">
                    Your seller profile has not been verified yet.
                </p>
            );
    }
}