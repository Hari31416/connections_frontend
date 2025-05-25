import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import ServerLoading from "../layout/ServerLoading";

const Auth = () => {
  const {
    darkMode,
    toggleDarkMode,
    handleAuth,
    view,
    setView,
    serverReady,
    healthCheckAttempts,
    authLoading,
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  // Show loading screen if server is not ready
  if (!serverReady) {
    return <ServerLoading darkMode={darkMode} attempts={healthCheckAttempts} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setPasswordError("");
    setAuthError("");

    // For registration, check if passwords match
    if (view === "register" && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const result = await handleAuth(
      view === "login" ? "/login" : "/register",
      email,
      password
    );

    if (result.success) {
      // Clear form fields on successful submission
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      // Display the specific error message from backend
      setAuthError(result.error);
    }
  };

  // Clear errors when switching between login/register
  const handleViewChange = (newView) => {
    setPasswordError("");
    setAuthError("");
    setView(newView);
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-center min-vh-100 ${
        darkMode ? "bg-dark text-light" : "bg-light"
      }`}
    >
      <div
        className={`card p-4 shadow-lg ${
          darkMode ? "bg-dark text-light border-dark" : "bg-white"
        }`}
        style={{ maxWidth: 450, width: "100%" }}
      >
        <div className="d-flex justify-content-end mb-3">
          <button
            className={`btn btn-sm ${
              darkMode ? "btn-outline-primary" : "btn-primary"
            }`}
            onClick={toggleDarkMode}
            disabled={authLoading}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <h2 className="card-title text-center mb-4">
          {view === "login" ? "Welcome Back!" : "Join Us!"}
        </h2>

        {/* General authentication error display */}
        {authError && (
          <div className="alert alert-danger mb-3" role="alert">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label visually-hidden">
              Email address
            </label>
            <input
              id="emailInput"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              required
              disabled={authLoading}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="passwordInput"
              className="form-label visually-hidden"
            >
              Password
            </label>
            <input
              id="passwordInput"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              required
              disabled={authLoading}
            />
          </div>
          {view === "register" && (
            <div className="mb-3">
              <label
                htmlFor="confirmPasswordInput"
                className="form-label visually-hidden"
              >
                Confirm Password
              </label>
              <input
                id="confirmPasswordInput"
                className={`form-control form-control-lg ${
                  darkMode ? "bg-dark text-light border-secondary" : ""
                } ${passwordError ? "border-danger" : ""}`}
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
                required
                disabled={authLoading}
              />
              {passwordError && (
                <div className="text-danger mt-2 small">{passwordError}</div>
              )}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mb-3"
            disabled={authLoading}
          >
            {authLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                {view === "login" ? "Signing in..." : "Creating account..."}
              </div>
            ) : view === "login" ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="text-center">
          <a
            href="#"
            className="text-primary"
            onClick={(e) => {
              e.preventDefault();
              handleViewChange(view === "login" ? "register" : "login");
            }}
            style={{
              pointerEvents: authLoading ? "none" : "auto",
              opacity: authLoading ? 0.5 : 1,
            }}
          >
            {view === "login"
              ? "No account? Register here."
              : "Already have an account? Login here."}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
