import React from 'react';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { darkMode, logout } = useApp();
  
  return (
    <footer className="text-center mt-5 pt-4 border-top">
      <button
        className={`btn btn-lg ${
          darkMode ? "btn-outline-light" : "btn-outline-primary"
        }`}
        onClick={logout}
      >
        Logout
      </button>
    </footer>
  );
};

export default Footer;