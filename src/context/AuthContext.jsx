import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

const getStoredUser = () => {
    try {
        const stored = localStorage.getItem("streamtunes_user");
        return stored ? JSON.parse(stored) : null;
    } catch {
        localStorage.removeItem("streamtunes_user");
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);

    useEffect(() => {
        if (user) {
            localStorage.setItem("streamtunes_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("streamtunes_user");
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Failed to clear backend cookie", e);
        }
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
