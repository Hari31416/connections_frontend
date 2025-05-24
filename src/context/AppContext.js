import React, { createContext, useState, useEffect, useContext } from "react";

const API = "http://localhost:4000/api";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [darkMode, setDarkMode] = useState(false);
  const [connections, setConnections] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [view, setView] = useState("login");

  // Function to refresh companies data
  const refreshCompanies = () => {
    if (token) {
      fetch(API + "/companies", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch companies");
          return r.json();
        })
        .then(setCompanies)
        .catch((error) => console.error("Error fetching companies:", error));
    }
  };

  useEffect(() => {
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

        // Refresh companies data to update connections
        refreshCompanies();

        return true;
      })
      .catch((error) => {
        console.error("Error adding connection:", error);
        return false;
      });
  };

  // Add updateConnection function to edit existing connections
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
        companies: updatedConn.companies,
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

        // Refresh companies data to update connections
        refreshCompanies();

        return true;
      })
      .catch((error) => {
        console.error("Error updating connection:", error);
        return false;
      });
  };

  // Add function to delete a connection
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

        // Refresh companies data to update connections
        refreshCompanies();

        return true;
      })
      .catch((error) => {
        console.error("Error deleting connection:", error);
        return false;
      });
  };

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
        return true;
      })
      .catch((error) => {
        console.error("Error adding company:", error);
        return false;
      });
  };

  // Add updateCompany function to edit existing companies
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
        connections: updatedComp.connections,
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

  // Add function to delete a company
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
        return true;
      })
      .catch((error) => {
        console.error("Error deleting company:", error);
        return false;
      });
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setConnections([]);
    setCompanies([]);
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
        view,
        setView,
        handleAuth,
        addConnection,
        updateConnection,
        deleteConnection,
        addCompany,
        updateCompany,
        deleteCompany,
        logout,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
