import React, { useState, useEffect } from "react";
import "./App.css";
import { AppProvider, useApp } from "./context/AppContext";
import Auth from "./components/auth/Auth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ServerLoading from "./components/layout/ServerLoading";
import ConnectionList from "./components/lists/ConnectionList";
import CompanyList from "./components/lists/CompanyList";
import PositionList from "./components/lists/PositionList";
import ConnectionModal from "./components/modals/ConnectionModal";
import CompanyModal from "./components/modals/CompanyModal";
import PositionModal from "./components/modals/PositionModal";
import ModalBackdrop from "./components/modals/ModalBackdrop";
import ConnectionDetails from "./components/pages/ConnectionDetails";
import CompanyDetails from "./components/pages/CompanyDetails";

const MainApp = () => {
  const { darkMode, token, serverReady, healthCheckAttempts } = useApp();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [editConnection, setEditConnection] = useState(null);
  const [editCompany, setEditCompany] = useState(null);
  const [editPosition, setEditPosition] = useState(null);
  const [viewConnectionId, setViewConnectionId] = useState(null);
  const [viewCompanyId, setViewCompanyId] = useState(null);

  // Apply dark mode class to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Functions to handle modal toggling
  const openConnectionModal = () => setShowConnectionModal(true);
  const closeConnectionModal = () => setShowConnectionModal(false);

  const openCompanyModal = () => setShowCompanyModal(true);
  const closeCompanyModal = () => setShowCompanyModal(false);

  const openPositionModal = () => setShowPositionModal(true);
  const closePositionModal = () => setShowPositionModal(false);

  // Function to view connection details
  const viewConnection = (connectionId) => {
    setViewConnectionId(connectionId);
  };

  // Function to view company details
  const viewCompany = (companyId) => {
    setViewConnectionId(null); // Clear the connection view first
    setViewCompanyId(companyId);
  };

  // Function to go back to main view
  const backToMain = () => {
    setViewConnectionId(null);
    setViewCompanyId(null);
  };

  // If not logged in, show Auth component
  if (!token) {
    return <Auth />;
  }

  // Show loading screen if server is not ready
  if (!serverReady) {
    return <ServerLoading darkMode={darkMode} attempts={healthCheckAttempts} />;
  }

  // Connection Details View
  if (viewConnectionId) {
    return (
      <div
        className={`d-flex flex-column min-vh-100 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <div
          className="container-fluid d-flex flex-column flex-grow-1"
          style={{ maxWidth: 1140, padding: "0 15px" }}
        >
          <Header />

          <main className="flex-grow-1 d-flex flex-column">
            <div className="row mb-4">
              <ConnectionDetails
                connectionId={viewConnectionId}
                onBack={backToMain}
                viewCompany={viewCompany}
              />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    );
  }

  // Company Details View
  if (viewCompanyId) {
    return (
      <div
        className={`d-flex flex-column min-vh-100 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <div
          className="container-fluid d-flex flex-column flex-grow-1"
          style={{ maxWidth: 1140, padding: "0 15px" }}
        >
          <Header />

          <main className="flex-grow-1 d-flex flex-column">
            <div className="row mb-4">
              <CompanyDetails
                companyId={viewCompanyId}
                onBack={backToMain}
                viewConnection={viewConnection}
              />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    );
  }

  // Main App View
  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div
        className="container-fluid d-flex flex-column flex-grow-1"
        style={{ maxWidth: 1140, padding: "0 15px" }}
      >
        <Header />

        <main className="flex-grow-1 d-flex flex-column">
          <div className="row mb-4">
            <ConnectionList
              openConnectionModal={openConnectionModal}
              setEditConnection={setEditConnection}
              viewConnection={viewConnection}
            />
          </div>
          <div className="row mb-4">
            <CompanyList
              openCompanyModal={openCompanyModal}
              setEditCompany={setEditCompany}
              viewCompany={viewCompany}
            />
          </div>
          <div className="row mb-4">
            <PositionList
              openPositionModal={openPositionModal}
              setEditPosition={setEditPosition}
              viewConnection={viewConnection}
              viewCompany={viewCompany}
            />
          </div>
        </main>

        <Footer />
      </div>

      {/* Render Modals */}
      <ConnectionModal
        showModal={showConnectionModal}
        closeModal={closeConnectionModal}
        editConnection={editConnection}
      />
      <CompanyModal
        showModal={showCompanyModal}
        closeModal={closeCompanyModal}
        editCompany={editCompany}
      />
      <PositionModal
        showModal={showPositionModal}
        closeModal={closePositionModal}
        editPosition={editPosition}
      />
      <ModalBackdrop
        show={showConnectionModal || showCompanyModal || showPositionModal}
      />
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
