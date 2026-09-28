import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { updateCurrentUser } from "../../api/auth";

import { WILAYAS } from "../../constants/wilayas";

import { validateProfileForm, formatApiErrors } from "../../utils/validation";

import useForm from "../../hooks/useForm";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Select from "../../components/ui/Select";

export default function Profile() {
    const { user, updateUser } = useAuth();

    const {
        values: form,
        setValues: setForm,
        errors,
        setErrors,
        loading,
        setLoading,
        handleChange,
        validateForm,
    } = useForm(
        {
            first_name: "",
            last_name: "",
            phone: "",
            address: "",
            wilaya: "",
        },
        validateProfileForm
    );

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) return;

        setForm({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            phone: user.phone || "",
            address: user.address || "",
            wilaya: user.wilaya || "",
        });
    }, [user]);

    function handleProfileChange(event) {
        handleChange(event);
        setSuccess(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccess(false);
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await updateCurrentUser(form);

            updateUser(response.data);

            setSuccess(true);
        } catch (err) {
            setErrors(
                formatApiErrors(err.response?.data)
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    Manage your personal information.
                </p>
            </div>

            {success && (
                <Alert type="success">
                    Your profile has been updated successfully.
                </Alert>
            )}

            {errors.general && (
                <Alert type="error">
                    {errors.general}
                </Alert>
            )}

            <Card>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="grid gap-5 sm:grid-cols-2">

                        <Input
                            label="First name"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleProfileChange}
                            error={errors.first_name}
                        />

                        <Input
                            label="Last name"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleProfileChange}
                            error={errors.last_name}
                        />

                    </div>

                    <Input
                        label="Email"
                        value={user?.email || ""}
                        disabled
                        helperText="Your email address cannot be changed here."
                    />

                    <Input
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleProfileChange}
                        error={errors.phone}
                    />

                    <Select
                        label="Wilaya"
                        name="wilaya"
                        value={form.wilaya}
                        onChange={handleProfileChange}
                        options={WILAYAS}
                    />

                    <Input
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleProfileChange}
                        error={errors.address}
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