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
  } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show loading screen if server is not ready
  if (!serverReady) {
    return <ServerLoading darkMode={darkMode} attempts={healthCheckAttempts} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAuth(
      view === "login" ? "/login" : "/register",
      email,
      password
    );
    // Clear form fields on submission
    setEmail("");
    setPassword("");
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
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <h2 className="card-title text-center mb-4">
          {view === "login" ? "Welcome Back!" : "Join Us!"}
        </h2>
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
            />
          </div>
          <div className="mb-4">
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
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
            {view === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="text-center">
          <a
            href="#"
            className="text-primary"
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
              setView(view === "login" ? "register" : "login");
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
