import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser, googleLogin } from "../api/authApi";

function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const getDisplayName = (usernameOrEmail) => {
        if (usernameOrEmail.includes("@")) {
            return usernameOrEmail.split("@")[0];
        }
        return usernameOrEmail;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const data = isSignUp
                ? await registerUser(username, password)
                : await loginUser(username, password);

            login({
                username: data.username,
                displayName: data.displayName || getDisplayName(data.username),
                token: data.token,
            });
            navigate("/", { replace: true });
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                (isSignUp ? "Registration failed. Try again." : "Invalid credentials.");
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError("");
        setLoading(true);
        try {
            const data = await googleLogin(credentialResponse.credential);
            login({
                username: data.username,
                displayName: data.displayName || getDisplayName(data.username),
                token: data.token,
            });
            navigate("/", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Google login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google sign-in was cancelled or failed.");
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoSection}>
                    <span style={styles.logoIcon}>🎵</span>
                    <h1 style={styles.logoText}>StreamTunes</h1>
                </div>

                <h2 style={styles.heading}>
                    {isSignUp ? "Create an Account" : "Welcome Back"}
                </h2>
                <p style={styles.subtitle}>
                    {isSignUp
                        ? "Sign up to start streaming your music"
                        : "Log in to continue listening"}
                </p>

                {/* Error */}
                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            style={styles.input}
                            autoComplete="username"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={styles.input}
                            autoComplete={isSignUp ? "new-password" : "current-password"}
                        />
                    </div>

                    {isSignUp && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                style={styles.input}
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
                    </button>
                </form>

                {/* Divider */}
                <div style={styles.divider}>
                    <span style={styles.dividerLine}></span>
                    <span style={styles.dividerText}>OR</span>
                    <span style={styles.dividerLine}></span>
                </div>

                {/* Google Login */}
                <div style={styles.googleWrapper}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_black"
                        size="large"
                        width="100%"
                        text={isSignUp ? "signup_with" : "signin_with"}
                        shape="pill"
                    />
                </div>

                {/* Toggle */}
                <p style={styles.toggleText}>
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setConfirmPassword("");
                        }}
                        style={styles.toggleBtn}
                    >
                        {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        padding: "1rem",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "2.5rem 2rem",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 80px rgba(34, 197, 94, 0.05)",
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    logoIcon: {
        fontSize: "2rem",
    },
    logoText: {
        fontSize: "1.6rem",
        fontWeight: "700",
        background: "linear-gradient(135deg, #22c55e, #10b981)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "0.5px",
    },
    heading: {
        fontSize: "1.4rem",
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        margin: "0 0 0.4rem 0",
    },
    subtitle: {
        fontSize: "0.85rem",
        color: "rgba(255, 255, 255, 0.5)",
        textAlign: "center",
        margin: "0 0 1.5rem 0",
    },
    errorBox: {
        background: "rgba(239, 68, 68, 0.12)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: "10px",
        padding: "0.7rem 1rem",
        color: "#fca5a5",
        fontSize: "0.85rem",
        marginBottom: "1rem",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
    },
    label: {
        fontSize: "0.8rem",
        fontWeight: "500",
        color: "rgba(255, 255, 255, 0.6)",
        marginLeft: "0.2rem",
    },
    input: {
        padding: "0.75rem 1rem",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(255, 255, 255, 0.06)",
        color: "#fff",
        fontSize: "0.95rem",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    submitBtn: {
        marginTop: "0.5rem",
        padding: "0.8rem",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "600",
        letterSpacing: "0.3px",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
    },
    divider: {
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        margin: "1.5rem 0",
    },
    dividerLine: {
        flex: 1,
        height: "1px",
        background: "rgba(255, 255, 255, 0.1)",
    },
    dividerText: {
        fontSize: "0.75rem",
        color: "rgba(255, 255, 255, 0.35)",
        fontWeight: "500",
        letterSpacing: "1px",
    },
    googleWrapper: {
        display: "flex",
        justifyContent: "center",
    },
    toggleText: {
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "rgba(255, 255, 255, 0.5)",
    },
    toggleBtn: {
        background: "none",
        border: "none",
        color: "#22c55e",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "0.85rem",
        textDecoration: "underline",
        textUnderlineOffset: "2px",
    },
};

export default LoginPage;
