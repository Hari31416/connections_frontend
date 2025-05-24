import React from "react";
import { useApp } from "../../context/AppContext";

const Header = () => {
  const { darkMode, toggleDarkMode, logout } = useApp();

  return (
    <header className="navbar navbar-expand-lg mb-4 pb-3 border-bottom">
      <div className="container-fluid px-0">
        <h1 className="navbar-brand h3 mb-0">My CRM Dashboard</h1>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={toggleDarkMode}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
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
