import client from "./client";

export function createSellerProfile(data) {
    return client.post("/seller/register/", data);
}

export function getSellerProfile() {
    return client.get("/seller/profile/");
}

export function updateSellerProfile(data) {
    return client.patch("/seller/profile/", data);
}

export function createSellerIdVerification(data) {
    return client.post(
        "/seller/id-verification/",
        data
    );
}

export function updateSellerIdVerification(data) {
    return client.patch(
        "/seller/id-verification/",
        data
    );
}

export function createSellerRegistrationVerification(data) {
    return client.post(
        "/seller/registration-verification/",
        data
    );
}

export function updateSellerRegistrationVerification(data) {
    return client.patch(
        "/seller/registration-verification/",
        data
    );
}