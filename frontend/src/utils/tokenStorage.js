const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens(accessToken, refreshToken) {
    localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
    );

    localStorage.setItem(
        REFRESH_TOKEN_KEY,
        refreshToken
    );
}

export function getAccessToken() {
    return localStorage.getItem(
        ACCESS_TOKEN_KEY
    );
}

export function getRefreshToken() {
    return localStorage.getItem(
        REFRESH_TOKEN_KEY
    );
}

export function removeTokens() {
    localStorage.removeItem(
        ACCESS_TOKEN_KEY
    );

    localStorage.removeItem(
        REFRESH_TOKEN_KEY
    );
}

export function hasTokens() {
    return Boolean(
        getAccessToken() &&
        getRefreshToken()
    );
}

export function saveUser(user) {
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
}

export function getUser() {
    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
}

export function removeUser() {
    localStorage.removeItem("user");
}