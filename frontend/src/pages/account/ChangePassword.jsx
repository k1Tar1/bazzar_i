import { useState } from "react";
import { Lock, Save } from "lucide-react";

import { changePassword } from "../../api/auth";
import useForm from "../../hooks/useForm";

import {
    validateChangePasswordForm,
    formatApiErrors,
} from "../../utils/validation";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function ChangePassword() {
    const [success, setSuccess] = useState(false);

    const {
        values,
        errors,
        setErrors,
        loading,
        setLoading,
        handleChange,
        validateForm,
        resetForm,
    } = useForm(
        {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
        validateChangePasswordForm
    );

    function handlePasswordChange(event) {
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
            await changePassword(values);

            resetForm();
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
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                    Change Password
                </h1>

                <p className="mt-1 text-sm text-secondary-500">
                    Update your password to keep your account secure.
                </p>
            </div>

            {success && (
                <Alert type="success">
                    Your password has been changed successfully.
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
                    <Input
                        label="Current password"
                        name="old_password"
                        type="password"
                        value={values.old_password}
                        onChange={handlePasswordChange}
                        error={errors.old_password}
                        leftIcon={<Lock size={18} />}
                        required
                    />

                    <Input
                        label="New password"
                        name="new_password"
                        type="password"
                        value={values.new_password}
                        onChange={handlePasswordChange}
                        error={errors.new_password}
                        leftIcon={<Lock size={18} />}
                        required
                        helperText="Use at least 8 characters."
                    />

                    <Input
                        label="Confirm new password"
                        name="confirm_password"
                        type="password"
                        value={values.confirm_password}
                        onChange={handlePasswordChange}
                        error={errors.confirm_password}
                        leftIcon={<Lock size={18} />}
                        required
                    />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            loading={loading}
                            leftIcon={<Save size={18} />}
                        >
                            Change Password
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}