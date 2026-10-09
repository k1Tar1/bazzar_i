import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";

import {
    getIdVerificationRequest,
    approveIdVerification,
    rejectIdVerification,
} from "../../api/admin";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";


export default function AdminIdVerificationDetail() {
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
                await getIdVerificationRequest(id);

            setRequest(response.data);
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to load verification request."
            );
        } finally {
            setLoading(false);
        }
    }


    async function handleApprove() {
        const confirmed = window.confirm(
            "Are you sure you want to approve this identity verification?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError(null);
            setSuccess(null);

            const response =
                await approveIdVerification(id);

            setSuccess(
                response.data?.detail ||
                "Identity verification approved successfully."
            );

            // The demand is deleted after approval.
            // Give the admin a moment to see the success message.
            setTimeout(() => {
                navigate("/admin/id-verifications");
            }, 1000);

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to approve verification."
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
                await rejectIdVerification(
                    id,
                    trimmedFeedback
                );

            setSuccess(
                response.data?.detail ||
                "Identity verification rejected."
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
                "Failed to reject verification."
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
                        navigate("/admin/id-verifications")
                    }
                    leftIcon="ArrowLeft"
                >
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
                        navigate("/admin/id-verifications")
                    }
                    leftIcon="ArrowLeft"
                >
                    Back
                </Button>

                <div>
                    <h1 className="text-2xl font-semibold text-secondary-900">
                        Identity Verification
                    </h1>

                    <p className="mt-1 text-sm text-secondary-600">
                        Review seller identity documents.
                    </p>
                </div>

            </div>


            {/* Messages */}

            {
                error && (
                    <Alert
                        type="error"
                        message={error}
                    />
                )
            }

            {
                success && (
                    <Alert
                        type="success"
                        message={success}
                    />
                )
            }


            {/* Seller information */}

            <Card>

                <h2 className="text-lg font-semibold text-secondary-900">
                    Seller Information
                </h2>

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
                            NIN
                        </p>

                        <p className="mt-1 text-sm text-secondary-900">
                            {request.nin}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-medium uppercase text-secondary-500">
                            Status
                        </p>

                        <p className="mt-1 text-sm font-medium capitalize text-secondary-900">
                            {request.status}
                        </p>
                    </div>

                </div>

            </Card>


            {/* Documents */}

            <Card>

                <h2 className="text-lg font-semibold text-secondary-900">
                    Verification Documents
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">

                    {/* Identity document */}

                    <div>
                        <p className="mb-2 text-sm font-medium text-secondary-700">
                            Identity Document
                        </p>

                        <div className="overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50">

                            <img
                                src={request.id_image}
                                alt="Seller identity document"
                                className="max-h-125 w-full object-contain"
                            />

                        </div>

                    </div>


                    {/* Selfie */}

                    <div>
                        <p className="mb-2 text-sm font-medium text-secondary-700">
                            Selfie
                        </p>

                        <div className="overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50">

                            <img
                                src={request.selfie_image}
                                alt="Seller selfie"
                                className="max-h-125 w-full object-contain"
                            />

                        </div>

                    </div>

                </div>

            </Card>


            {/* Existing rejection feedback */}

            {
                request.status === "rejected" &&
                request.feedback && (
                    <Card>

                        <h2 className="text-lg font-semibold text-secondary-900">
                            Rejection Feedback
                        </h2>

                        <p className="mt-3 text-sm text-secondary-700">
                            {request.feedback}
                        </p>

                    </Card>
                )
            }


            {/* Actions */}

            {
                isPending && (
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
                                    leftIcon="Check"
                                >
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
                                    leftIcon="X"
                                >
                                    Reject
                                </Button>

                            </div>
                        )}


                        {showRejectForm && (
                            <div className="mt-5 space-y-4">

                                <Input
                                    label="Rejection feedback"
                                    value={feedback}
                                    onChange={(event) =>
                                        setFeedback(event.target.value)
                                    }
                                    error={feedbackError}
                                    helperText="Explain what the seller needs to correct before resubmitting."
                                />


                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <Button
                                        variant="danger"
                                        loading={actionLoading}
                                        disabled={actionLoading}
                                        onClick={handleReject}
                                        leftIcon="X"
                                    >
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
                )
            }

        </div >
    );
}