// to add
// setUser()
// refreshUser()
// hasRole()

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    login as loginRequest,
    logout as logoutRequest,
    refresh as refreshRequest,
    googleLogin as googleLoginRequest
} from "../api/auth";

import client from "../api/client";

import {
    saveAccessToken,
    removeAccessToken,
} from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {

        async function restoreSession() {

            try {

                /*
                |--------------------------------------------------------------------------
                | Ask Django for a new access token.
                |
                | The browser automatically sends the HttpOnly
                | refresh_token cookie.
                |--------------------------------------------------------------------------
                */

                const response = await refreshRequest();

                const accessToken =
                    response.data.access;

                saveAccessToken(accessToken);


                /*
                |--------------------------------------------------------------------------
                | Get the current user
                |--------------------------------------------------------------------------
                */

                const userResponse = await client.get(
                    "/auth/me/"
                );

                setUser(
                    userResponse.data
                );

            } catch {

                /*
                |--------------------------------------------------------------------------
                | No valid refresh token/session.
                |--------------------------------------------------------------------------
                */

                removeAccessToken();

                setUser(null);

            } finally {

                setLoading(false);

            }

        }

        restoreSession();

    }, []);

    async function login(email, password) {

        const response = await loginRequest({
            email,
            password,
        });

        if (
            !response.data.access ||
            !response.data.user
        ) {
            throw new Error(
                "Invalid response from login."
            );
        }

        const {
            access,
            user,
        } = response.data;

        saveAccessToken(access);

        setUser(user);

        return user;
    }

    async function loginWithGoogle(credential) {
        const response = await googleLoginRequest({
            credential,
        });

        const { access, user } = response.data;

        saveAccessToken(access);
        setUser(user);

        return user;
    }

    async function logout() {

        try {

            await logoutRequest();

        }

        finally {

            removeAccessToken();

            setUser(null);

        }
    }

    const value = useMemo(() => ({
        user,
        loading,
        isAuthenticated,
        login,
        logout,
    }), [
        user,
        loading,
        isAuthenticated,
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}