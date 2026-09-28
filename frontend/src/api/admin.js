import client from "./client";

// ==============================
// Identity verification
// ==============================

export function getIdVerificationRequests() {
    return client.get("/admin/id-verifications/");
}

export function getIdVerificationRequest(id) {
    return client.get(`/admin/id-verifications/${id}/`);
}

export function approveIdVerification(id) {
    return client.post(
        `/admin/id-verifications/${id}/approve/`
    );
}

export function rejectIdVerification(id, feedback) {
    return client.post(
        `/admin/id-verifications/${id}/reject/`,
        { feedback }
    );
}


// ==============================
// Business registration
// ==============================

export function getRegistrationVerificationRequests() {
    return client.get(
        "/admin/registration-verifications/"
    );
}

export function getRegistrationVerificationRequest(id) {
    return client.get(
        `/admin/registration-verifications/${id}/`
    );
}

export function approveRegistrationVerification(id) {
    return client.post(
        `/admin/registration-verifications/${id}/approve/`
    );
}

export function rejectRegistrationVerification(id, feedback) {
    return client.post(
        `/admin/registration-verifications/${id}/reject/`,
        { feedback }
    );
}

export function getVerificationSummary() {
    return client.get("/admin/verification-summary/");
}