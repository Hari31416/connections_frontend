import React, { useState, useEffect } from "react";
import "./App.css";
import { AppProvider, useApp } from "./context/AppContext";
import Auth from "./components/auth/Auth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ConnectionList from "./components/lists/ConnectionList";
import CompanyList from "./components/lists/CompanyList";
import PositionList from "./components/lists/PositionList";
import ConnectionModal from "./components/modals/ConnectionModal";
import CompanyModal from "./components/modals/CompanyModal";
import PositionModal from "./components/modals/PositionModal";
import ModalBackdrop from "./components/modals/ModalBackdrop";

const MainApp = () => {
  const { darkMode, token } = useApp();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [editConnection, setEditConnection] = useState(null);
  const [editCompany, setEditCompany] = useState(null);
  const [editPosition, setEditPosition] = useState(null);

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

  // If not logged in, show Auth component
  if (!token) {
    return <Auth />;
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
            />
          </div>
          <div className="row mb-4">
            <CompanyList
              openCompanyModal={openCompanyModal}
              setEditCompany={setEditCompany}
            />
          </div>
          <div className="row mb-4">
            <PositionList
              openPositionModal={openPositionModal}
              setEditPosition={setEditPosition}
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
