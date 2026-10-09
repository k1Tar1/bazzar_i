export function validateRequiredFields(values, fields) {
    const errors = {};

    for (const field of fields) {
        if (!values[field]?.trim()) {
            errors[field] = "This field is required.";
        }
    }

    return errors;
}

export function validateProfileForm(values) {
    const errors = {};

    if (!values.first_name.trim()) {
        errors.first_name = "First name is required.";
    } else if (values.first_name.length > 50) {
        errors.first_name = "First name is too long.";
    }

    if (!values.last_name.trim()) {
        errors.last_name = "Last name is required.";
    } else if (values.last_name.length > 50) {
        errors.last_name = "Last name is too long.";
    }

    if (!values.phone.trim()) {
        errors.phone = "Phone number is required.";
    } else if (!/^(\+213|213|0)(5|6|7)[0-9]{8}$/.test(values.phone.trim())) {
        errors.phone = "Enter a valid Algerian phone number.";
    }

    if (!values.address.trim()) {
        errors.address = "Address is required.";
    }

    return errors;
}

export function formatApiErrors(data) {
    const errors = {};

    if (!data) {
        return {
            general: "Something went wrong.",
        };
    }

    for (const [field, messages] of Object.entries(data)) {
        const message = Array.isArray(messages)
            ? messages[0]
            : messages;

        if (field === "non_field_errors") {
            errors.general = message;
        } else {
            errors[field] = message;
        }
    }

    return errors;
}

export function validateChangePasswordForm(values) {
    const errors = {};

    if (!values.old_password) {
        errors.old_password = "Current password is required.";
    }

    if (!values.new_password) {
        errors.new_password = "New password is required.";
    } else if (values.new_password.length < 8) {
        errors.new_password =
            "Password must be at least 8 characters.";
    }

    if (!values.confirm_password) {
        errors.confirm_password =
            "Please confirm your new password.";
    } else if (
        values.new_password !== values.confirm_password
    ) {
        errors.confirm_password =
            "Passwords do not match.";
    }

    return errors;
}

export function validateSellerProfileForm(values) {
    const errors = {};

    // NIN and NIF are removed from the seller registration since they became part of the selller validation process

    // if (!values.nin.trim()) {
    //     errors.nin = "NIN is required.";
    // } else if (!/^\d{18}$/.test(values.nin.trim())) {
    //     errors.nin = "NIN must contain exactly 18 digits.";
    // }

    // if (!values.nif.trim()) {
    //     errors.nif = "NIF is required.";
    // } else if (!/^\d{9}$/.test(values.nif.trim())) {
    //     errors.nif = "NIF must contain exactly 9 digits.";
    // }

    if (!values.business_address.trim()) {
        errors.business_address = "Address is required.";
    }

    if (!values.business_phone.trim()) {
        errors.business_phone = "Business phone number is required.";
    } else if (!/^(\+213|213|0)(5|6|7)[0-9]{8}$/.test(values.business_phone.trim())) {
        errors.business_phone = "Enter a valid Algerian phone number.";
    }

    return errors;
}

export function validateSellerIdVerificationForm(values) {
    const errors = {};

    if (!values.nin.trim()) {
        errors.nin = "NIN is required.";
    } else if (!/^\d{18}$/.test(values.nin.trim())) {
        errors.nin =
            "NIN must contain exactly 18 digits.";
    }

    if (!values.id_image) {
        errors.id_image =
            "Identity document is required.";
    }

    if (!values.selfie_image) {
        errors.selfie_image =
            "Selfie is required.";
    }

    return errors;
}

export function validateSellerVerificationForm(
    values,
    needsIdentity
) {
    const errors = {};

    if (needsIdentity) {
        if (!values.nin.trim()) {
            errors.nin = "NIN is required.";
        } else if (!/^\d{18}$/.test(values.nin.trim())) {
            errors.nin = "NIN must contain exactly 18 digits.";
        }

        if (!values.id_image) {
            errors.id_image =
                "Identity document is required.";
        }

        if (!values.selfie_image) {
            errors.selfie_image =
                "Selfie is required.";
        }
    }

    // Registration is optional.
    //
    // But if the seller starts filling it,
    // both fields must be provided.

    const hasRegistrationDocument =
        Boolean(values.business_registration_image);

    const hasNif =
        Boolean(values.nif.trim());

    if (hasRegistrationDocument || hasNif) {
        if (!hasRegistrationDocument) {
            errors.business_registration_image =
                "Business registration document is required.";
        }

        if (!hasNif) {
            errors.nif =
                "NIF is required when submitting business registration.";
        } else if (!/^\d{15}$/.test(values.nif.trim())) {
            errors.nif =
                "NIF must contain exactly 15 digits.";
        }
    }

    return errors;
}