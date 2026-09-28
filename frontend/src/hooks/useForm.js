import { useState } from "react";

export default function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setValues((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    }

    function validateForm() {
        const validationErrors = validate(values);

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    }

    function resetForm(newValues = initialValues) {
        setValues(newValues);
        setErrors({});
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        loading,
        setLoading,
        handleChange,
        validateForm,
        resetForm,
    };
}