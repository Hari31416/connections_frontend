import React, { createContext, useState, useEffect, useContext } from "react";

const API = "http://localhost:4000/api";

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
      fetch(API + "/connections", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch connections");
          return r.json();
        })
        .then(setConnections)
        .catch((error) => console.error("Error fetching connections:", error));

      // Fetch companies
      fetch(API + "/companies", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch companies");
          return r.json();
        })
        .then(setCompanies)
        .catch((error) => console.error("Error fetching companies:", error));

      // Fetch positions
      fetch(API + "/positions", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch positions");
          return r.json();
        })
        .then(setPositions)
        .catch((error) => console.error("Error fetching positions:", error));
    }
  };

  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token]);

  const handleAuth = (endpoint, email, password) => {
    return fetch(API + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setView("main");
          return true;
        } else {
          alert(data.error || "Authentication failed.");
          return false;
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        return false;
      });
  };

  // Connection CRUD operations
  const addConnection = (newConn) => {
    return fetch(API + "/connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newConn),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add connection");
        return r.json();
      })
      .then((conn) => {
        setConnections([...connections, conn]);
        return conn;
      })
      .catch((error) => {
        console.error("Error adding connection:", error);
        return false;
      });
  };

  const updateConnection = (updatedConn) => {
    return fetch(`${API}/connections/${updatedConn.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: updatedConn.name,
        email: updatedConn.email,
        phone: updatedConn.phone,
        notes: updatedConn.notes,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to update connection");
        return r.json();
      })
      .then((conn) => {
        // Update the connections state with the updated connection
        setConnections(connections.map((c) => (c._id === conn._id ? conn : c)));
        return true;
      })
      .catch((error) => {
        console.error("Error updating connection:", error);
        return false;
      });
  };

  const deleteConnection = (connectionId) => {
    return fetch(`${API}/connections/${connectionId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to delete connection");
        return r.json();
      })
      .then(() => {
        // Remove the deleted connection from state
        setConnections(connections.filter((c) => c._id !== connectionId));
        // Remove positions associated with this connection
        setPositions(
          positions.filter((p) => p.connectionId._id !== connectionId)
        );
        return true;
      })
      .catch((error) => {
        console.error("Error deleting connection:", error);
        return false;
      });
  };

  // Company CRUD operations
  const addCompany = (newComp) => {
    return fetch(API + "/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newComp),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add company");
        return r.json();
      })
      .then((comp) => {
        setCompanies([...companies, comp]);
        return comp;
      })
      .catch((error) => {
        console.error("Error adding company:", error);
        return false;
      });
  };

  const updateCompany = (updatedComp) => {
    return fetch(`${API}/companies/${updatedComp.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: updatedComp.name,
        industry: updatedComp.industry,
        website: updatedComp.website,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to update company");
        return r.json();
      })
      .then((comp) => {
        // Update the companies state with the updated company
        setCompanies(companies.map((c) => (c._id === comp._id ? comp : c)));
        return true;
      })
      .catch((error) => {
        console.error("Error updating company:", error);
        return false;
      });
  };

  const deleteCompany = (companyId) => {
    return fetch(`${API}/companies/${companyId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to delete company");
        return r.json();
      })
      .then(() => {
        // Remove the deleted company from state
        setCompanies(companies.filter((c) => c._id !== companyId));
        // Remove positions associated with this company
        setPositions(positions.filter((p) => p.companyId._id !== companyId));
        return true;
      })
      .catch((error) => {
        console.error("Error deleting company:", error);
        return false;
      });
  };

  // Position CRUD operations
  const addPosition = (newPos) => {
    return fetch(API + "/positions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newPos),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add position");
        return r.json();
      })
      .then((pos) => {
        setPositions([...positions, pos]);
        return pos;
      })
      .catch((error) => {
        console.error("Error adding position:", error);
        return false;
      });
  };

  const updatePosition = (updatedPos) => {
    return fetch(`${API}/positions/${updatedPos.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: updatedPos.title,
        startDate: updatedPos.startDate,
        endDate: updatedPos.endDate,
        current: updatedPos.current,
        notes: updatedPos.notes,
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to update position");
        return r.json();
      })
      .then((pos) => {
        // Update the positions state with the updated position
        setPositions(positions.map((p) => (p._id === pos._id ? pos : p)));
        return true;
      })
      .catch((error) => {
        console.error("Error updating position:", error);
        return false;
      });
  };

  const deletePosition = (positionId) => {
    return fetch(`${API}/positions/${positionId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to delete position");
        return r.json();
      })
      .then(() => {
        // Remove the deleted position from state
        setPositions(positions.filter((p) => p._id !== positionId));
        return true;
      })
      .catch((error) => {
        console.error("Error deleting position:", error);
        return false;
      });
  };

  // Helper functions to get positions by connection or company
  const getPositionsByConnection = (connectionId) => {
    return fetch(`${API}/positions/connection/${connectionId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch positions");
        return r.json();
      })
      .catch((error) => {
        console.error("Error fetching positions:", error);
        return [];
      });
  };

  const getPositionsByCompany = (companyId) => {
    return fetch(`${API}/positions/company/${companyId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch positions");
        return r.json();
      })
      .catch((error) => {
        console.error("Error fetching positions:", error);
        return [];
      });
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
