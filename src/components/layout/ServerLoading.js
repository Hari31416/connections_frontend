import React from "react";

const ServerLoading = ({ darkMode, attempts }) => {
  const getLoadingMessage = () => {
    if (attempts < 10) {
      return "Starting server...";
    } else if (attempts < 15) {
      return "Server is taking longer than usual to start...";
    } else {
      return "Still waiting for server to respond...";
    }
  };

  const getHelpText = () => {
    if (attempts > 20) {
      return (
        <div className="mt-3">
          <p className="mb-2">If the server is taking too long to start:</p>
          <ul className="text-start">
            <li>Make sure the backend server is running</li>
            <li>Check if port 4000 is available</li>
            <li>Verify your network connection</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center min-vh-100 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="text-center">
        {/* Animated spinner */}
        <div className="mb-4">
          <div
            className={`spinner-border spinner-border-lg ${
              darkMode ? "text-light" : "text-primary"
            }`}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>

        {/* Loading message */}
        <h3 className="mb-3">{getLoadingMessage()}</h3>

        {/* Connection status */}
        <p className={`mb-2 ${darkMode ? "text-light-50" : "text-muted"}`}>
          Checking server connection...
        </p>

        {/* Pulse animation for the connection indicator */}
        <div className="mb-4">
          <div
            className={`badge ${
              darkMode ? "bg-secondary" : "bg-primary"
            } pulse-animation`}
          >
            Connecting to backend
          </div>
        </div>

        {/* Help text for extended wait times */}
        {getHelpText()}
      </div>
    </div>
  );
};

export default ServerLoading;
