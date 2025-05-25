import React, { useState, useEffect } from "react";
import "./App.css";
import { AppProvider, useApp } from "./context/AppContext";
import Auth from "./components/auth/Auth";
import FirstUserSetup from "./components/auth/FirstUserSetup";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ServerLoading from "./components/layout/ServerLoading";
import ConnectionList from "./components/lists/ConnectionList";
import CompanyList from "./components/lists/CompanyList";
import PositionList from "./components/lists/PositionList";
import ConnectionModal from "./components/modals/ConnectionModal";
import CompanyModal from "./components/modals/CompanyModal";
import PositionModal from "./components/modals/PositionModal";
import UserManagementModal from "./components/modals/UserManagementModal";
import ModalBackdrop from "./components/modals/ModalBackdrop";
import ConnectionDetails from "./components/pages/ConnectionDetails";
import CompanyDetails from "./components/pages/CompanyDetails";

const MainApp = () => {
  const {
    darkMode,
    token,
    user,
    serverReady,
    healthCheckAttempts,
    initialDataLoading,
    hasUsers,
    checkingUsers,
  } = useApp();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
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

  const openUserManagementModal = () => setShowUserManagementModal(true);
  const closeUserManagementModal = () => setShowUserManagementModal(false);

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

  // Show loading screen if server is not ready
  if (!serverReady) {
    return <ServerLoading darkMode={darkMode} attempts={healthCheckAttempts} />;
  }

  // If not logged in, determine what to show
  if (!token) {
    // Still checking if users exist
    if (checkingUsers || hasUsers === null) {
      return (
        <div
          className={`d-flex flex-column align-items-center justify-content-center min-vh-100 ${
            darkMode ? "bg-dark text-light" : "bg-light text-dark"
          }`}
        >
          <div className="text-center">
            <div
              className="spinner-border mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="mb-2">Checking system status...</h4>
            <p className="text-muted">
              Please wait while we initialize the system
            </p>
          </div>
        </div>
      );
    }

    // No users exist - show first user setup
    if (!hasUsers) {
      return <FirstUserSetup />;
    }

    // Users exist - show normal login
    return <Auth />;
  }

  // Show loading screen while fetching initial data after login
  if (initialDataLoading) {
    return (
      <div
        className={`d-flex flex-column align-items-center justify-content-center min-vh-100 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mb-2">Loading your data...</h4>
          <p className="text-muted">
            Fetching your connections, companies, and positions
          </p>
        </div>
      </div>
    );
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
          <Header openUserManagementModal={openUserManagementModal} />

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
          <Header openUserManagementModal={openUserManagementModal} />

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
        <Header openUserManagementModal={openUserManagementModal} />

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
      <UserManagementModal
        showModal={showUserManagementModal}
        closeModal={closeUserManagementModal}
      />
      <ModalBackdrop
        show={
          showConnectionModal ||
          showCompanyModal ||
          showPositionModal ||
          showUserManagementModal
        }
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
