let accessToken = null;

export function saveAccessToken(token) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

export function removeAccessToken() {
    accessToken = null;
}

export function hasAccessToken() {
    return Boolean(accessToken);
}