import React from 'react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useApp();
  
  return (
    <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
      <h1 className="h3 mb-0">My CRM Dashboard</h1>
      <button
        className="btn btn-primary btn-sm"
        onClick={toggleDarkMode}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Header;