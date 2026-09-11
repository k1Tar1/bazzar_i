import client from "./client";

export function register(data) {
    return client.post(
        "/auth/register/",
        data
    );
}

export function login(data) {
    return client.post(
        "/auth/login/",
        data
    );
}

export function googleLogin(credential) {
    return client.post("/auth/google/login/", {
        credential,
    });
}

export function getCurrentUser() {
    return client.get("/auth/current-user/");
}

export function updateCurrentUser(data) {
    return client.patch("/auth/current-user/", data);
}

export function refresh() {
    return client.post(
        "/auth/refresh/"
    );
}

export function logout() {
    return client.post(
        "/auth/logout/"
    );
}

export function verifyEmail(uid, token) {
    return client.post(
        "/auth/verify-email/",
        {
            uid,
            token,
        }
    );
}

export function resendVerification(email) {
    return client.post(
        "/auth/resend-verification/",
        {
            email,
        }
    );
}

export function changePassword(data) {
    return client.post("/auth/change-password/", data);
}

export function requestPasswordReset(email) {
    return client.post("/auth/password-reset/", {
        email,
    });
}

export function confirmPasswordReset(data) {
    return client.post(
        "/auth/password-reset/confirm/",
        data
    );
}