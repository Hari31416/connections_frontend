import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import ServerLoading from "../layout/ServerLoading";

const Auth = () => {
  const {
    darkMode,
    toggleDarkMode,
    handleAuth,
    serverReady,
    healthCheckAttempts,
    authLoading,
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Show loading screen if server is not ready
  if (!serverReady) {
    return <ServerLoading darkMode={darkMode} attempts={healthCheckAttempts} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setAuthError("");

    const result = await handleAuth("/login", email, password);

    if (result.success) {
      // Clear form fields on successful submission
      setEmail("");
      setPassword("");
    } else {
      // Display the specific error message from backend
      setAuthError(result.error);
    }
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
            {darkMode ? "Light Side" : "Dark Side"}
          </button>
        </div>
        <h2 className="card-title text-center mb-4">Welcome Back!</h2>

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
                Signing in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
