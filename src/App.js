import React, { useState } from "react";
import "./App.css";
import { AppProvider, useApp } from "./context/AppContext";
import Auth from "./components/auth/Auth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ConnectionList from "./components/lists/ConnectionList";
import CompanyList from "./components/lists/CompanyList";
import ConnectionModal from "./components/modals/ConnectionModal";
import CompanyModal from "./components/modals/CompanyModal";
import ModalBackdrop from "./components/modals/ModalBackdrop";

const MainApp = () => {
  const { darkMode, token } = useApp();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Functions to handle modal toggling
  const openConnectionModal = () => setShowConnectionModal(true);
  const closeConnectionModal = () => setShowConnectionModal(false);

  const openCompanyModal = () => setShowCompanyModal(true);
  const closeCompanyModal = () => setShowCompanyModal(false);

  // If not logged in, show Auth component
  if (!token) {
    return <Auth />;
  }

  // Main App View
  return (
    <div
      className={`min-vh-100 py-5 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div
        className="container-fluid"
        style={{ maxWidth: 1140, padding: "0 15px" }}
      >
        <Header />

        <main>
          <div className="row g-4">
            <ConnectionList openConnectionModal={openConnectionModal} />
            <CompanyList openCompanyModal={openCompanyModal} />
          </div>
        </main>

        <Footer />
      </div>

      {/* Render Modals */}
      <ConnectionModal
        showModal={showConnectionModal}
        closeModal={closeConnectionModal}
      />
      <CompanyModal
        showModal={showCompanyModal}
        closeModal={closeCompanyModal}
      />
      <ModalBackdrop show={showConnectionModal || showCompanyModal} />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
