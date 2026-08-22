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
} from "../api/auth";

import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    removeTokens,
    getUser,
    saveUser,
    removeUser,
} from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {

        const access = getAccessToken();
        const refresh = getRefreshToken();

        if (access && refresh) {

            // Later we'll validate/refresh the token.
            // For now we simply assume a saved token
            // means the user is authenticated.

            try {

                const user = getUser();

                if (user) {
                    setUser(user);
                }

            } catch {
                removeTokens();
                removeUser();
                setUser(null);
            }
        }

        setLoading(false);

    }, []);

    async function login(email, password) {

        const response = await loginRequest({
            email,
            password,
        });

        if (
            !response.data.access ||
            !response.data.refresh ||
            !response.data.user
        ) {
            throw new Error(
                "Invalid response from login."
            );
        }

        const {
            access,
            refresh,
            user,
        } = response.data;

        saveTokens(access, refresh);

        saveUser(user);

        setUser(user);

        return user;
    }

    async function logout() {

        try {

            await logoutRequest();

        }

        finally {

            removeTokens();

            removeUser();

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