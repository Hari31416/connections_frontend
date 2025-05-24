import React from "react";
import { useApp } from "../../context/AppContext";

const Footer = () => {
  const { darkMode } = useApp();

  return (
    <footer className="text-center py-3 mt-auto border-top">
      <p className="text-muted mb-0">
        &copy; {new Date().getFullYear()} My CRM Dashboard
      </p>
    </footer>
  );
};

export default Footer;
