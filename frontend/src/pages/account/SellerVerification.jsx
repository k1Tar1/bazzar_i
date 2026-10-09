import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import PageLoader from "../../components/common/PageLoader";

import {
    getSellerVerification,
    createSellerIdVerification,
    updateSellerIdVerification,
    createSellerRegistrationVerification,
    updateSellerRegistrationVerification,
} from "../../api/seller";

import {
    validateSellerVerificationForm,
    formatApiErrors,
} from "../../utils/validation";


export default function SellerVerification() {
    const navigate = useNavigate();

    const [verification, setVerification] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [values, setValues] = useState({
        nin: "",
        id_image: null,
        selfie_image: null,

        nif: "",
        business_registration_image: null,
    });

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    console.log(values.id_image, values.id_image instanceof File);
    console.log(values.selfie_image, values.selfie_image instanceof File);



    useEffect(() => {
        async function loadVerification() {
            try {
                const response =
                    await getSellerVerification();

                setVerification(response.data);
            } catch (error) {
                setGeneralError(
                    "Unable to load your verification status."
                );
            } finally {
                setLoading(false);
            }
        }

        loadVerification();
    }, []);


    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setValues((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    }


    function handleFileChange(event) {
        const {
            name,
            files,
        } = event.target;

        setValues((previous) => ({
            ...previous,
            [name]: files[0] || null,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    }


    if (loading) {
        return <PageLoader />;
    }


    if (!verification) {
        return (
            <Card>
                <Alert type="error">
                    Unable to load verification information.
                </Alert>
            </Card>
        );
    }


    const identityStatus =
        verification.identity.status;

    const registrationStatus =
        verification.registration.status;

    const needsIdentity =
        identityStatus === "unverified" ||
        identityStatus === "rejected";

    const identityPending =
        identityStatus === "pending";

    const identityVerified =
        identityStatus === "verified";

    const needsRegistration =
        registrationStatus === "unverified" ||
        registrationStatus === "rejected";

    const registrationPending =
        registrationStatus === "pending";

    const registrationVerified =
        registrationStatus === "verified";

    const registrationCanBeSubmitted =
        verification.registration.can_submit;


    async function handleSubmit(event) {
        event.preventDefault();

        setGeneralError("");
        setErrors({});


        const validationErrors =
            validateSellerVerificationForm(
                values,
                needsIdentity
            );

        if (
            Object.keys(validationErrors).length > 0
        ) {
            setErrors(validationErrors);
            return;
        }


        try {
            setSubmitting(true);


            /*
             * ------------------------------------------------
             * STEP 1
             * Identity verification
             * ------------------------------------------------
             */

            if (needsIdentity) {
                const identityData =
                    new FormData();

                identityData.append(
                    "nin",
                    values.nin.trim()
                );

                identityData.append(
                    "id_image",
                    values.id_image
                );

                identityData.append(
                    "selfie_image",
                    values.selfie_image
                );


                if (
                    identityStatus === "rejected"
                ) {
                    await updateSellerIdVerification(
                        identityData
                    );
                } else {
                    await createSellerIdVerification(
                        identityData
                    );
                }
            }


            /*
             * ------------------------------------------------
             * STEP 2
             * Business registration
             * ------------------------------------------------
             */

            const hasRegistrationData =
                values.nif.trim() ||
                values.business_registration_image;


            if (
                hasRegistrationData
                &&
                registrationCanBeSubmitted
            ) {
                const registrationData =
                    new FormData();

                registrationData.append(
                    "nif",
                    values.nif.trim()
                );

                registrationData.append(
                    "business_registration_image",
                    values.business_registration_image
                );


                if (
                    registrationStatus === "rejected"
                ) {
                    await updateSellerRegistrationVerification(
                        registrationData
                    );
                } else {
                    await createSellerRegistrationVerification(
                        registrationData
                    );
                }
            }


            /*
             * Everything submitted successfully.
             */

            navigate("/account/seller-status");

        } catch (error) {
            if (error.response?.data) {
                setErrors(
                    formatApiErrors(
                        error.response.data
                    )
                );
            } else {
                setGeneralError(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <Card>
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-secondary-900">
                    Seller Verification
                </h1>

                <p className="mt-1 text-sm text-secondary-600">
                    Verify your identity to activate
                    your seller account. Business
                    registration is optional.
                </p>
            </div>


            {generalError && (
                <Alert
                    type="error"
                    className="mb-6"
                >
                    {generalError}
                </Alert>
            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >


                {/* =========================================
                    IDENTITY VERIFICATION
                ========================================== */}

                {needsIdentity && (
                    <section>
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-secondary-900">
                                Identity Verification
                            </h2>

                            <p className="mt-1 text-sm text-secondary-600">
                                This information is required
                                to verify your identity.
                            </p>
                        </div>


                        {identityStatus === "rejected" && (
                            <Alert
                                type="error"
                                className="mb-5"
                            >
                                <strong>
                                    Identity verification
                                    rejected
                                </strong>

                                <p className="mt-1">
                                    {verification.identity.feedback ||
                                        "Please correct your information and submit again."}
                                </p>
                            </Alert>
                        )}


                        <div className="space-y-5">

                            <Input
                                label="NIN"
                                name="nin"
                                value={values.nin}
                                onChange={handleChange}
                                error={errors.nin}
                                required
                            />


                            <div>
                                <label className="block text-sm font-medium text-secondary-700">
                                    Identity Document
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="file"
                                    name="id_image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full text-sm text-secondary-600"
                                />

                                {errors.id_image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.id_image}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-secondary-700">
                                    Selfie
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="file"
                                    name="selfie_image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full text-sm text-secondary-600"
                                />

                                {errors.selfie_image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.selfie_image}
                                    </p>
                                )}
                            </div>

                        </div>
                    </section>
                )}


                {/* =========================================
                    IDENTITY PENDING
                ========================================== */}

                {identityPending && (
                    <Alert type="info">
                        <strong>
                            Identity verification pending
                        </strong>

                        <p className="mt-1">
                            Your identity documents have
                            already been submitted and are
                            currently being reviewed.
                        </p>
                    </Alert>
                )}


                {/* =========================================
                    IDENTITY VERIFIED
                ========================================== */}

                {identityVerified && (
                    <Alert type="success">
                        <strong>
                            Identity verified
                        </strong>

                        <p className="mt-1">
                            Your identity has already been
                            verified.
                        </p>
                    </Alert>
                )}


                {/* =========================================
                    BUSINESS REGISTRATION
                ========================================== */}

                {needsRegistration && (
                    <section>
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-secondary-900">
                                Business Registration
                            </h2>

                            <p className="mt-1 text-sm text-secondary-600">
                                This section is optional.
                                Complete it if you have
                                registered your business.
                            </p>
                        </div>


                        {registrationStatus === "rejected" && (
                            <Alert
                                type="error"
                                className="mb-5"
                            >
                                <strong>
                                    Business registration
                                    rejected
                                </strong>

                                <p className="mt-1">
                                    {verification.registration.feedback ||
                                        "Please correct your information and submit again."}
                                </p>
                            </Alert>
                        )}


                        <div className="space-y-5">

                            <Input
                                label="NIF"
                                name="nif"
                                value={values.nif}
                                onChange={handleChange}
                                error={errors.nif}
                            />


                            <div>
                                <label className="block text-sm font-medium text-secondary-700">
                                    Business Registration
                                    Document
                                </label>

                                <input
                                    type="file"
                                    name="business_registration_image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full text-sm text-secondary-600"
                                />

                                {errors.business_registration_image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.business_registration_image
                                        }
                                    </p>
                                )}
                            </div>

                        </div>
                    </section>
                )}


                {/* =========================================
                    REGISTRATION PENDING
                ========================================== */}

                {registrationPending && (
                    <Alert type="info">
                        <strong>
                            Business registration pending
                        </strong>

                        <p className="mt-1">
                            Your business registration
                            documents are currently being
                            reviewed.
                        </p>
                    </Alert>
                )}


                {/* =========================================
                    REGISTRATION VERIFIED
                ========================================== */}

                {registrationVerified && (
                    <Alert type="success">
                        <strong>
                            Business registration verified
                        </strong>

                        <p className="mt-1">
                            Your business registration has
                            already been verified.
                        </p>
                    </Alert>
                )}


                {needsIdentity && needsRegistration && (
                    <Button
                        type="submit"
                        loading={submitting}
                        fullWidth
                    >
                        Submit Verification
                    </Button>
                )}

            </form>
        </Card>
    );
}