import React, { createContext, useState, useEffect, useContext } from "react";
import { API, checkServerHealth } from "./apiUtils";
import * as connectionService from "./connectionService";
import * as companyService from "./companyService";
import * as positionService from "./positionService";
import * as authService from "./authService";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [darkMode, setDarkMode] = useState(true);
  const [connections, setConnections] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [positions, setPositions] = useState([]);
  const [view, setView] = useState("login");
  const [serverReady, setServerReady] = useState(false);
  const [healthCheckAttempts, setHealthCheckAttempts] = useState(0);

  // Function to perform health check
  const performHealthCheck = async () => {
    console.log("Checking server health...");
    const isHealthy = await checkServerHealth();

    if (isHealthy) {
      console.log("Server is ready!");
      setServerReady(true);
      return true;
    } else {
      setHealthCheckAttempts((prev) => prev + 1);
      console.log(`Server not ready yet, attempt ${healthCheckAttempts + 1}`);
      return false;
    }
  };

  // Initial health check and retry logic
  useEffect(() => {
    let healthCheckTimeout;

    const startHealthCheck = async () => {
      // Only run if server is not ready
      if (serverReady) {
        return;
      }

      const isReady = await performHealthCheck();

      if (!isReady && !serverReady) {
        // Retry every 2 seconds for the first 30 seconds, then every 5 seconds
        const retryInterval = healthCheckAttempts < 15 ? 2000 : 5000;

        healthCheckTimeout = setTimeout(() => {
          startHealthCheck();
        }, retryInterval);
      }
    };

    // Only start health check if server is not ready
    if (!serverReady) {
      startHealthCheck();
    }

    return () => {
      if (healthCheckTimeout) {
        clearTimeout(healthCheckTimeout);
      }
    };
  }, [serverReady]); // Remove healthCheckAttempts from dependencies

  // Function to refresh all data
  const refreshData = () => {
    if (token && serverReady) {
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
  }, [token, serverReady]);

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
        serverReady,
        healthCheckAttempts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
