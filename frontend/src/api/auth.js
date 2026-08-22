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

export function refresh(refreshToken) {
    return client.post(
        "/auth/token/refresh/",
        {
            refresh: refreshToken,
        }
    );
}

export function logout(refreshToken) {
    return client.post(
        "/auth/logout/",
        {
            refresh: refreshToken,
        }
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

export function forgotPassword(email) {
    return client.post(
        "/auth/forgot-password/",
        {
            email,
        }
    );
}

export function resetPassword({
    uid,
    token,
    password,
    confirm_password,
}) {
    return client.post(
        "/auth/reset-password/",
        {
            uid,
            token,
            password,
            confirm_password,
        }
    );
}