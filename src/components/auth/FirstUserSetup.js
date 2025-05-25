import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import * as authService from "../../context/authService";

const FirstUserSetup = () => {
  const { darkMode, toggleDarkMode, setToken, setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.initializeFirstUser(email, password);

      if (result.token) {
        // Set token and user in context
        setToken(result.token);
        localStorage.setItem("token", result.token);

        // Extract user info from token
        const userInfo = authService.getUserFromToken(result.token);
        setUser(userInfo);
      } else {
        setError(result.error || "Failed to create admin user");
      }
    } catch (error) {
      setError("Failed to initialize system. Please try again.");
    } finally {
      setLoading(false);
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
        style={{ maxWidth: 500, width: "100%" }}
      >
        <div className="d-flex justify-content-end mb-3">
          <button
            className={`btn btn-sm ${
              darkMode ? "btn-outline-primary" : "btn-primary"
            }`}
            onClick={toggleDarkMode}
            disabled={loading}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="text-center mb-4">
          <i className="bi bi-gear-fill display-4 text-primary mb-3"></i>
          <h2 className="card-title">System Setup</h2>
          <p className="text-muted">
            No users found in the system. Create the first administrator account
            to get started.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="adminEmail" className="form-label">
              Administrator Email
            </label>
            <input
              id="adminEmail"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Enter admin email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="adminPassword" className="form-label">
              Password
            </label>
            <input
              id="adminPassword"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmAdminPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmAdminPassword"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              } ${passwordError ? "border-danger" : ""}`}
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            {passwordError && (
              <div className="text-danger mt-2 small">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <div className="d-flex align-items-center justify-content-center">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Creating Administrator...
              </div>
            ) : (
              <>
                <i className="bi bi-shield-check me-2"></i>
                Create Administrator Account
              </>
            )}
          </button>
        </form>

        <div className="alert alert-info mt-3" role="alert">
          <small>
            <i className="bi bi-info-circle me-2"></i>
            This will create the first administrator account with full system
            access.
          </small>
        </div>
      </div>
    </div>
  );
};

export default FirstUserSetup;
