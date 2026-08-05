import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import {
    Mail,
    User,
    Phone,
    MapPinned,
    MapPinHouse,
} from "lucide-react";

import {
    Button,
    Card,
    Checkbox,
    Input,
    Alert,
    Select,
} from "../components/ui/index";

import {
    AuthLayout,
    AuthHeader,
    AuthFooter,
} from "../components/layouts";

import { WILAYAS } from "../constants/wilayas";

import validateRegister from "../validation/registerValidation";

export default function Register() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        wilaya: "",
        address: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState({});

    const [formError, setFormError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegister(form);

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        setError({});
        setFormError("");

        try {
            setLoading(true);

            const response = await register(form);

            console.log(response.data);

            // Later:
            // navigate("/check-email");
            console.log(form);
        } catch (error) {
            if (error.response?.status === 400) {

                const backendErrors = {};

                for (const key in error.response.data) {

                    backendErrors[key] =
                        error.response.data[key][0];
                }

                setError(backendErrors);

            } else {

                setFormError(
                    "Something went wrong. Please try again."
                );

            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <AuthLayout>

            <Card>

                <AuthHeader
                    title="Create an account"
                    subtitle="Create your marketplace account."
                />

                {formError && (
                    <Alert
                        variant="error"
                        dismissible
                        onClose={() => setFormError("")}
                    >
                        {formError}
                    </Alert>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    <div className="grid gap-5 md:grid-cols-2">

                        <Input
                            label="First Name"
                            name="first_name"
                            autoComplete="given-name"
                            value={form.first_name}
                            onChange={handleChange}
                            leftIcon={<User size={18} />}
                            error={error.first_name}
                            required
                        />

                        <Input
                            label="Last Name"
                            name="last_name"
                            autoComplete="family-name"
                            value={form.last_name}
                            onChange={handleChange}
                            leftIcon={<User size={18} />}
                            required
                            error={error.last_name}
                        />

                    </div>

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        leftIcon={<Mail size={18} />}
                        required
                        error={error.email}
                    />

                    <Input
                        label="Phone"
                        name="phone"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        leftIcon={<Phone size={18} />}
                        required
                        error={error.phone}
                    />

                    <Select
                        label="Wilaya"
                        name="wilaya"
                        value={form.wilaya}
                        onChange={handleChange}
                        options={WILAYAS}
                        leftIcon={<MapPinned size={18} />}
                        required
                        error={error.wilaya}
                    />

                    <Input
                        label="Address"
                        name="address"
                        autoComplete="street-address"
                        value={form.address}
                        onChange={handleChange}
                        leftIcon={<MapPinHouse size={18} />}
                        required
                        error={error.address}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        error={error.password}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        error={error.confirmPassword}
                    />

                    <Checkbox
                        name="acceptTerms"
                        checked={form.acceptTerms}
                        onChange={handleChange}
                        label={
                            <>
                                I agree to the{" "}
                                <Link
                                    to="/terms"
                                    className="font-medium text-primary-600 hover:underline"
                                >
                                    Terms and Conditions
                                </Link>
                            </>
                        }
                        error={error.acceptTerms}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                        loadingText="Creating account..."
                        disabled={loading}
                    >
                        Create Account
                    </Button>

                </form>

                <AuthFooter>

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:underline"
                    >
                        Sign In
                    </Link>

                </AuthFooter>

            </Card>

        </AuthLayout>
    );
}