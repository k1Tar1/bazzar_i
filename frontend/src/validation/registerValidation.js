export default function validateRegister(form) {
    const errors = {};

    // ---------- First Name ----------
    if (!form.first_name.trim()) {
        errors.first_name = "First name is required.";
    } else if (form.first_name.length > 150) {
        errors.first_name = "First name is too long.";
    }

    // ---------- Last Name ----------
    if (!form.last_name.trim()) {
        errors.last_name = "Last name is required.";
    } else if (form.last_name.length > 150) {
        errors.last_name = "Last name is too long.";
    }

    // ---------- Email ----------
    if (!form.email.trim()) {
        errors.email = "Email is required.";
    } else {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            errors.email = "Enter a valid email address.";
        }
    }

    // ---------- Phone ----------
    if (!form.phone.trim()) {
        errors.phone = "Phone number is required.";
    } else {
        // Allows:
        // +213XXXXXXXXX
        // 0XXXXXXXXX
        const phoneRegex =
            /^(\+213|0)(5|6|7)[0-9]{8}$/;

        if (!phoneRegex.test(form.phone)) {
            errors.phone = "Enter a valid Algerian phone number.";
        }
    }

    // ---------- Wilaya ----------
    if (!form.wilaya) {
        errors.wilaya = "Please select your wilaya.";
    }

    // ---------- Address ----------
    if (!form.address.trim()) {
        errors.address = "Address is required.";
    }

    // ---------- Password ----------
    if (!form.password) {
        errors.password = "Password is required.";
    } else {
        if (form.password.length < 8) {
            errors.password =
                "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(form.password)) {
            errors.password =
                "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(form.password)) {
            errors.password =
                "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(form.password)) {
            errors.password =
                "Password must contain at least one number.";
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
            errors.password =
                "Password must contain at least one special character.";
        }
    }

    // ---------- Confirm Password ----------
    if (!form.confirmPassword) {
        errors.confirmPassword =
            "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword =
            "Passwords do not match.";
    }

    // ---------- Terms ----------
    if (!form.acceptTerms) {
        errors.acceptTerms =
            "You must accept the Terms and Conditions.";
    }

    return errors;
}