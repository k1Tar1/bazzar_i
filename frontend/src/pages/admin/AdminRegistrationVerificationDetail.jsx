import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";

import {
    getRegistrationVerificationRequest,
    approveRegistrationVerification,
    rejectRegistrationVerification,
} from "../../api/admin";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";
import VerificationStatusBadge from "../../components/admin/VerificationStatusBadge";


export default function AdminRegistrationVerificationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [showRejectForm, setShowRejectForm] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [feedbackError, setFeedbackError] = useState(null);


    useEffect(() => {
        loadRequest();
    }, [id]);


    async function loadRequest() {
        try {
            setLoading(true);
            setError(null);

            const response =
                await getRegistrationVerificationRequest(id);

            setRequest(response.data);

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to load registration verification request."
            );

        } finally {
            setLoading(false);
        }
    }


    async function handleApprove() {
        const confirmed = window.confirm(
            "Are you sure you want to approve this business registration?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError(null);
            setSuccess(null);

            const response =
                await approveRegistrationVerification(id);

            setSuccess(
                response.data?.detail ||
                "Business registration approved successfully."
            );

            setTimeout(() => {
                navigate(
                    "/admin/registration-verifications"
                );
            }, 1000);

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to approve business registration."
            );

        } finally {
            setActionLoading(false);
        }
    }


    async function handleReject() {
        const trimmedFeedback = feedback.trim();

        if (!trimmedFeedback) {
            setFeedbackError(
                "Feedback is required when rejecting a request."
            );
            return;
        }

        try {
            setActionLoading(true);
            setError(null);
            setSuccess(null);
            setFeedbackError(null);

            const response =
                await rejectRegistrationVerification(
                    id,
                    trimmedFeedback
                );

            setSuccess(
                response.data?.detail ||
                "Business registration rejected."
            );

            setRequest((current) => ({
                ...current,
                status: "rejected",
                feedback: trimmedFeedback,
            }));

            setShowRejectForm(false);

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                error.response?.data?.feedback ||
                "Failed to reject business registration."
            );

        } finally {
            setActionLoading(false);
        }
    }


    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }


    if (error && !request) {
        return (
            <div className="space-y-4">

                <Button
                    variant="outline"
                    onClick={() =>
                        navigate(
                            "/admin/registration-verifications"
                        )
                    }
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Alert
                    type="error"
                    message={error}
                />

            </div>
        );
    }


    if (!request) {
        return null;
    }


    const isPending = request.status === "pending";


    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center gap-3">

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        navigate(
                            "/admin/registration-verifications"
                        )
                    }
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">
                        Business Registration Verification
                    </h1>

                    <p className="mt-1 text-sm text-secondary-600">
                        Review seller business registration details.
                    </p>
                </div>

            </div>


            {/* Messages */}

            {error && (
                <Alert
                    type="error"
                    message={error}
                />
            )}

            {success && (
                <Alert
                    type="success"
                    message={success}
                />
            )}


            {/* Seller information */}

            <Card>

                <div className="flex flex-wrap items-center justify-between gap-3">

                    <h2 className="text-lg font-semibold text-secondary-900">
                        Seller Information
                    </h2>

                    <VerificationStatusBadge
                        status={request.status}
                    />

                </div>


                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                    <div>
                        <p className="text-xs font-medium uppercase text-secondary-500">
                            Name
                        </p>

                        <p className="mt-1 text-sm text-secondary-900">
                            {request.seller_name || "—"}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-medium uppercase text-secondary-500">
                            Email
                        </p>

                        <p className="mt-1 text-sm text-secondary-900">
                            {request.seller_email}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-medium uppercase text-secondary-500">
                            NIF
                        </p>

                        <p className="mt-1 text-sm font-medium text-secondary-900">
                            {request.nif}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-medium uppercase text-secondary-500">
                            Submitted
                        </p>

                        <p className="mt-1 text-sm text-secondary-900">
                            {new Date(
                                request.created_at
                            ).toLocaleString()}
                        </p>
                    </div>

                </div>

            </Card>


            {/* Registration document */}

            <Card>

                <h2 className="text-lg font-semibold text-secondary-900">
                    Business Registration Document
                </h2>

                <div className="mt-5 overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50">

                    <img
                        src={request.business_registration_image}
                        alt="Business registration document"
                        className="max-h-175 w-full object-contain"
                    />

                </div>

            </Card>


            {/* Previous rejection feedback */}

            {request.status === "rejected" &&
                request.feedback && (
                    <Card>

                        <h2 className="text-lg font-semibold text-secondary-900">
                            Rejection Feedback
                        </h2>

                        <p className="mt-3 text-sm text-secondary-700">
                            {request.feedback}
                        </p>

                    </Card>
                )}


            {/* Actions */}

            {isPending && (
                <Card>

                    <h2 className="text-lg font-semibold text-secondary-900">
                        Review Decision
                    </h2>


                    {!showRejectForm && (
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                            <Button
                                variant="success"
                                loading={actionLoading}
                                disabled={actionLoading}
                                onClick={handleApprove}
                            >
                                <Check className="h-4 w-4" />
                                Approve
                            </Button>


                            <Button
                                variant="danger"
                                disabled={actionLoading}
                                onClick={() => {
                                    setFeedback("");
                                    setFeedbackError(null);
                                    setShowRejectForm(true);
                                }}
                            >
                                <X className="h-4 w-4" />
                                Reject
                            </Button>

                        </div>
                    )}


                    {showRejectForm && (
                        <div className="mt-5 space-y-4">

                            <div>
                                <label className="mb-1 block text-sm font-medium text-secondary-700">
                                    Rejection feedback
                                </label>

                                <textarea
                                    value={feedback}
                                    onChange={(event) =>
                                        setFeedback(
                                            event.target.value
                                        )
                                    }
                                    rows={5}
                                    placeholder="Explain why the business registration was rejected..."
                                    className="w-full rounded-lg border border-secondary-300 bg-white p-3 text-sm text-secondary-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                />

                                {feedbackError && (
                                    <p className="mt-1 text-sm text-danger-600">
                                        {feedbackError}
                                    </p>
                                )}
                            </div>


                            <div className="flex flex-col gap-3 sm:flex-row">

                                <Button
                                    variant="danger"
                                    loading={actionLoading}
                                    disabled={actionLoading}
                                    onClick={handleReject}
                                >
                                    <X className="h-4 w-4" />
                                    Confirm Rejection
                                </Button>


                                <Button
                                    variant="outline"
                                    disabled={actionLoading}
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        setFeedback("");
                                        setFeedbackError(null);
                                    }}
                                >
                                    Cancel
                                </Button>

                            </div>

                        </div>
                    )}

                </Card>
            )}

        </div>
    );
}