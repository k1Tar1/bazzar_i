import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        wilaya: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        setErrors({});
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setErrors({
                confirmPassword: "Passwords do not match.",
            });
            return;
        }

        setLoading(true);

        try {
            await api.post("auth/register/", {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                wilaya: formData.wilaya,
                address: formData.address,
                password: formData.password,
            });

            navigate("/verify-email");
        } catch (error) {
            if (error.response?.data) {
                setErrors(error.response.data);
            } else {
                setMessage("Something went wrong.");
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="mb-8 text-center">

                    <h1 className="text-4xl font-bold text-blue-600">
                        Marketplace
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Create your account
                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h2 className="text-2xl font-bold text-center">
                        Sign Up
                    </h2>

                    <p className="text-center text-gray-500 mt-2 mb-6">
                        Start buying or selling in minutes.
                    </p>

                    {message && (
                        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                            {message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                />

                                {errors.first_name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                />

                                {errors.last_name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>

                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Wilaya
                            </label>

                            <input
                                type="text"
                                name="wilaya"
                                value={formData.wilaya}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />

                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
}