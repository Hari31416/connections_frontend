import React, { createContext, useState, useEffect, useContext } from "react";
import { API } from "./apiUtils";
import * as connectionService from "./connectionService";
import * as companyService from "./companyService";
import * as positionService from "./positionService";
import * as authService from "./authService";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [darkMode, setDarkMode] = useState(false);
  const [connections, setConnections] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [positions, setPositions] = useState([]);
  const [view, setView] = useState("login");

  // Function to refresh all data
  const refreshData = () => {
    if (token) {
      // Fetch connections
      connectionService
        .fetchConnections(token)
        .then(setConnections)
        .catch((error) => console.error("Error fetching connections:", error));

      // Fetch companies
      companyService
        .fetchCompanies(token)
        .then(setCompanies)
        .catch((error) => console.error("Error fetching companies:", error));

      // Fetch positions
      positionService
        .fetchPositions(token)
        .then(setPositions)
        .catch((error) => console.error("Error fetching positions:", error));
    }
  };

  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token]);

  const handleAuth = async (endpoint, email, password) => {
    const authFunction =
      endpoint === "/login" ? authService.loginUser : authService.registerUser;
    const data = await authFunction(email, password);

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setView("main");
      return true;
    } else {
      alert(data.error || "Authentication failed.");
      return false;
    }
  };

  // Connection operations with state updates
  const addConnection = async (newConn) => {
    const conn = await connectionService.addConnection(newConn, token);
    if (conn) {
      setConnections([...connections, conn]);
      return conn;
    }
    return false;
  };

  const updateConnection = async (updatedConn) => {
    const conn = await connectionService.updateConnection(updatedConn, token);
    if (conn) {
      setConnections(connections.map((c) => (c._id === conn._id ? conn : c)));
      return true;
    }
    return false;
  };

  const deleteConnection = async (connectionId) => {
    const success = await connectionService.deleteConnection(
      connectionId,
      token
    );
    if (success) {
      setConnections(connections.filter((c) => c._id !== connectionId));
      // Remove positions associated with this connection
      setPositions(
        positions.filter((p) => p.connectionId._id !== connectionId)
      );
      return true;
    }
    return false;
  };

  // Company operations with state updates
  const addCompany = async (newComp) => {
    const comp = await companyService.addCompany(newComp, token);
    if (comp) {
      setCompanies([...companies, comp]);
      return comp;
    }
    return false;
  };

  const updateCompany = async (updatedComp) => {
    const comp = await companyService.updateCompany(updatedComp, token);
    if (comp) {
      setCompanies(companies.map((c) => (c._id === comp._id ? comp : c)));
      return true;
    }
    return false;
  };

  const deleteCompany = async (companyId) => {
    const success = await companyService.deleteCompany(companyId, token);
    if (success) {
      setCompanies(companies.filter((c) => c._id !== companyId));
      // Remove positions associated with this company
      setPositions(positions.filter((p) => p.companyId._id !== companyId));
      return true;
    }
    return false;
  };

  // Position operations with state updates
  const addPosition = async (newPos) => {
    const pos = await positionService.addPosition(newPos, token);
    if (pos) {
      setPositions([...positions, pos]);
      return pos;
    }
    return false;
  };

  const updatePosition = async (updatedPos) => {
    const pos = await positionService.updatePosition(updatedPos, token);
    if (pos) {
      setPositions(positions.map((p) => (p._id === pos._id ? pos : p)));
      return true;
    }
    return false;
  };

  const deletePosition = async (positionId) => {
    const success = await positionService.deletePosition(positionId, token);
    if (success) {
      setPositions(positions.filter((p) => p._id !== positionId));
      return true;
    }
    return false;
  };

  const getPositionsByConnection = (connectionId) => {
    return positionService.getPositionsByConnection(connectionId, token);
  };

  const getPositionsByCompany = (companyId) => {
    return positionService.getPositionsByCompany(companyId, token);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setConnections([]);
    setCompanies([]);
    setPositions([]);
    setView("login");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        API,
        token,
        darkMode,
        connections,
        companies,
        positions,
        view,
        setView,
        handleAuth,
        addConnection,
        updateConnection,
        deleteConnection,
        addCompany,
        updateCompany,
        deleteCompany,
        addPosition,
        updatePosition,
        deletePosition,
        getPositionsByConnection,
        getPositionsByCompany,
        refreshData,
        logout,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
