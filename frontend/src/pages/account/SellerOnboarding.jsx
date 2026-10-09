import { useState } from "react";
import { ArrowRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createSellerProfile } from "../../api/seller";
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

export default function SellerOnboarding() {
    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);

    const {
        values,
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

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccess(false);
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await createSellerProfile(values);

            setSuccess(true);

            navigate("/seller/account/seller-verification");
        } catch (err) {
            setErrors(
                formatApiErrors(err.response?.data)
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Store size={24} />
                </div>

                <h1 className="text-2xl font-bold text-secondary-900">
                    Become a Seller
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    Complete your seller information to start selling on the platform.
                </p>
            </div>

            {errors.general && (
                <Alert type="error">
                    {errors.general}
                </Alert>
            )}

            {success && (
                <Alert type="success">
                    Your seller profile has been created successfully.
                </Alert>
            )}

            <Card>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <h2 className="text-lg font-semibold text-secondary-900">
                            Seller Information
                        </h2>

                        <p className="mt-1 text-sm text-secondary-500">
                            Provide the information required to create your seller profile.
                        </p>
                    </div>

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

                    <Input
                        label="Business phone"
                        name="business_phone"
                        value={values.business_phone}
                        onChange={handleChange}
                        error={errors.business_phone}
                        helperText="Enter your business phone number."
                        required
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            loading={loading}
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}