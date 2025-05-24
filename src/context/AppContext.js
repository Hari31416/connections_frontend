import React, { createContext, useState, useEffect, useContext } from 'react';

const API = "http://localhost:4000/api";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [darkMode, setDarkMode] = useState(false);
  const [connections, setConnections] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [view, setView] = useState("login");

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
        return true;
      })
      .catch((error) => {
        console.error("Error adding connection:", error);
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
        addCompany,
        logout,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;