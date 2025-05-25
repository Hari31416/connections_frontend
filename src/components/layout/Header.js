import React from "react";
import { useApp } from "../../context/AppContext";

const Header = ({ openUserManagementModal }) => {
  const { darkMode, toggleDarkMode, logout, user } = useApp();

  return (
    <header className="navbar navbar-expand-lg mb-4 pb-3">
      <div className="container-fluid px-0">
        <div className="d-flex align-items-center">
          <div className="brand-container me-3">
            <i className="bi bi-people-fill brand-icon me-2"></i>
            <h1
              className={`brand-title mb-0 ${
                darkMode ? "text-light" : "text-dark"
              }`}
            >
              <span className="brand-main">Connections</span>
              <span className="brand-sub">Manager</span>
            </h1>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {user?.isAdmin && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={openUserManagementModal}
              >
                <i className="bi bi-person-plus me-1"></i>
                Create User
              </button>
              <span className="badge bg-success me-2">Admin</span>
            </>
          )}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={toggleDarkMode}
          >
            {darkMode ? "Light Side" : "Dark Side"}
          </button>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
