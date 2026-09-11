import { useState } from "react";
import { Phone, MapPin, MapPinned, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { updateCurrentUser } from "../../api/auth";

import { WILAYAS } from "../../constants/wilayas";

import AuthLayout from "../../components/layouts/AuthLayout";
import AuthHeader from "../../components/layouts/AuthHeader";
import AuthFooter from "../../components/layouts/AuthFooter";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";


export default function CompleteProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        wilaya: user?.wilaya || "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.phone ||
            !formData.address ||
            !formData.wilaya
        ) {
            setError("Please complete all fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await updateCurrentUser(formData);

            console.log("Profile updated:", response.data);

            // Go to the main application
            navigate("/", { replace: true });

        } catch (error) {
            const responseData = error.response?.data;

            if (responseData?.detail) {
                setError(responseData.detail);
            } else {
                setError(
                    "Unable to update your profile. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <AuthHeader
                    title="Complete your profile"
                    subtitle="Please provide a few more details before continuing."
                />

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    {error && (
                        <Alert
                            variant="danger"
                            message={error}
                        />
                    )}

                    <div className="grid gap-5 md:grid-cols-2">

                        <Input
                            label="First Name"
                            name="first_name"
                            autoComplete="given-name"
                            value={formData.first_name}
                            onChange={handleChange}
                            leftIcon={<User size={18} />}
                            error={error.first_name}
                            required
                        />

                        <Input
                            label="Last Name"
                            name="last_name"
                            autoComplete="family-name"
                            value={formData.last_name}
                            onChange={handleChange}
                            leftIcon={<User size={18} />}
                            required
                            error={error.last_name}
                        />

                    </div>

                    <Input
                        label="Phone number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        leftIcon={<Phone size={18} />}
                        required
                    />

                    <Select
                        label="Wilaya"
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleChange}
                        options={WILAYAS}
                        leftIcon={<MapPinned size={18} />}
                        required
                        error={error.wilaya}
                    />

                    <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        leftIcon={<MapPin size={18} />}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        Complete profile
                    </Button>
                </form>

                <AuthFooter />
            </Card>
        </AuthLayout>
    );
}