import { useEffect, useState } from "react";
import { Save, Store } from "lucide-react";

import {
    getSellerProfile,
    updateSellerProfile,
} from "../../api/seller";

import useForm from "../../hooks/useForm";

import {
    validateSellerProfileForm,
    formatApiErrors,
} from "../../utils/validation";

import { WILAYAS } from "../../constants/wilayas";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Select from "../../components/ui/Select";
import PageLoader from "../../components/common/PageLoader";

export default function SellerProfile() {
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [success, setSuccess] = useState(false);

    const {
        values,
        setValues,
        errors,
        setErrors,
        loading,
        setLoading,
        handleChange,
        validateForm,
    } = useForm(
        {
            business_wilaya: "",
            business_address: "",
            business_phone: "",
        },
        validateSellerProfileForm
    );

    const [verificationStatus, setVerificationStatus] =
        useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await getSellerProfile();

                setValues({
                    business_wilaya: response.data.business_wilaya || "",
                    business_address: response.data.business_address || "",
                    business_phone: response.data.business_phone || "",
                });

                setVerificationStatus(
                    response.data.verification_status
                );
            } catch (err) {
                setErrors(
                    formatApiErrors(err.response?.data)
                );
            } finally {
                setLoadingProfile(false);
            }
        }

        loadProfile();
    }, [setValues, setErrors]);

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccess(false);
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await updateSellerProfile(values);

            setValues({
                nin: response.data.nin || "",
                nif: response.data.nif || "",
                business_wilaya: response.data.business_wilaya || "",
                business_address: response.data.business_address || "",
                business_phone: response.data.business_phone || "",
            });

            setVerificationStatus(
                response.data.verification_status
            );

            setSuccess(true);
        } catch (err) {
            setErrors(
                formatApiErrors(err.response?.data)
            );
        } finally {
            setLoading(false);
        }
    }

    if (loadingProfile) {
        return <PageLoader />;
    }

    // const locked =
    //     verificationStatus === "pending" ||
    //     verificationStatus === "verified";

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Store size={24} />
                </div>

                <h1 className="text-2xl font-bold text-secondary-900">
                    Seller Profile
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    Manage your seller information.
                </p>
            </div>

            {success && (
                <Alert variant="success">
                    Your seller profile has been updated.
                </Alert>
            )}

            {errors.general && (
                <Alert variant="error">
                    {errors.general}
                </Alert>
            )}

            {/* {locked && ( */}
            {/* <Alert variant="info">
                Your identity information cannot be changed while your seller verification is pending or completed.
            </Alert> */}
            {/* )} */}

            <Card>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <Input
                        label="Business phone"
                        name="business_phone"
                        value={values.business_phone}
                        onChange={handleChange}
                        error={errors.business_phone}
                        // disabled={locked}
                        required
                    />

                    <Select
                        label="Business Wilaya"
                        name="business_wilaya"
                        value={values.business_wilaya}
                        onChange={handleChange}
                        options={WILAYAS}
                        required
                        helperText={"Choose your business wilaya"}
                    />

                    <Input
                        label="Business address"
                        name="business_address"
                        value={values.business_address}
                        onChange={handleChange}
                        error={errors.business_address}
                        helperText="Enter your business address."
                        required
                    />


                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            loading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}