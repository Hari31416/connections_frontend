import React, { useState, useEffect } from "react";
// No need to import Bootstrap CSS here if it's already in index.html
// import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:4000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connections, setConnections] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newConn, setNewConn] = useState({ name: "", email: "", phone: "" });
  const [newComp, setNewComp] = useState({
    name: "",
    industry: "",
    website: "",
  });
  const [darkMode, setDarkMode] = useState(false); // Default to light mode

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

  function handleAuth(endpoint) {
    fetch(API + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setView("main"); // Navigate to main view on success
          setEmail(""); // Clear form fields
          setPassword("");
        } else {
          alert(data.error || "Authentication failed.");
        }
      })
      .catch((error) => console.error("Authentication error:", error));
  }

  function addConnection() {
    fetch(API + "/connections", {
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
        setNewConn({ name: "", email: "", phone: "" }); // Clear form
      })
      .catch((error) => console.error("Error adding connection:", error));
  }

  function addCompany() {
    fetch(API + "/companies", {
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
        setNewComp({ name: "", industry: "", website: "" }); // Clear form
      })
      .catch((error) => console.error("Error adding company:", error));
  }

  // Login/Register View
  if (!token) {
    return (
      <div
        className={`d-flex align-items-center justify-content-center min-vh-100 ${
          darkMode ? "bg-dark text-light" : "bg-light"
        }`}
      >
        <div
          className={`card p-4 shadow-lg ${
            darkMode ? "bg-dark text-light border-dark" : "bg-white"
          }`}
          style={{ maxWidth: 450, width: "100%" }}
        >
          <div className="d-flex justify-content-end mb-3">
            <button
              className={`btn btn-sm ${
                darkMode ? "btn-outline-primary" : "btn-primary"
              }`}
              onClick={() => setDarkMode((d) => !d)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
          <h2 className="card-title text-center mb-4">
            {view === "login" ? "Welcome Back!" : "Join Us!"}
          </h2>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label visually-hidden">
              Email address
            </label>
            <input
              id="emailInput"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="passwordInput"
              className="form-label visually-hidden"
            >
              Password
            </label>
            <input
              id="passwordInput"
              className={`form-control form-control-lg ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
          </div>
          <button
            className="btn btn-primary btn-lg w-100 mb-3"
            onClick={() =>
              handleAuth(view === "login" ? "/login" : "/register")
            }
          >
            {view === "login" ? "Login" : "Register"}
          </button>
          <div className="text-center">
            <a
              href="#"
              className="text-primary"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                setView(view === "login" ? "register" : "login");
              }}
            >
              {view === "login"
                ? "No account? Register here."
                : "Already have an account? Login here."}
            </a>
          </div>
        </div>
      </div>
    );
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
        {/* Header and Dark Mode Toggle */}
        <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <h1 className="h3 mb-0">My CRM Dashboard</h1>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        <main>
          <div className="row g-4">
            {/* Connections Section */}
            <div className="col-lg-6">
              <div
                className={`card shadow-sm h-100 ${
                  darkMode ? "bg-dark border-dark" : "border-light"
                }`}
              >
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Your Connections</h5>
                </div>
                <div
                  className={
                    darkMode ? "card-body bg-dark text-light" : "card-body"
                  }
                >
                  <div className="table-responsive mb-4">
                    <table
                      className={`table table-hover align-middle mb-0 ${
                        darkMode ? "table-dark" : ""
                      }`}
                    >
                      <thead className={darkMode ? "" : "table-light"}>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {connections.length > 0 ? (
                          connections.map((c) => (
                            <tr key={c._id}>
                              <td>{c.name}</td>
                              <td>{c.email || "-"}</td>
                              <td>{c.phone || "-"}</td>
                              <td>{c.notes || "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-3">
                              No connections added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add New Connection Form */}
                  <h6 className="mb-3">Add New Connection</h6>
                  <div className="row g-2">
                    <div className="col-md-12">
                      <input
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        placeholder="Name"
                        value={newConn.name}
                        onChange={(e) =>
                          setNewConn({ ...newConn, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        placeholder="Email (Optional)"
                        type="email"
                        value={newConn.email}
                        onChange={(e) =>
                          setNewConn({ ...newConn, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        placeholder="Phone (Optional)"
                        type="tel"
                        value={newConn.phone}
                        onChange={(e) =>
                          setNewConn({ ...newConn, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 mt-2"
                        onClick={addConnection}
                      >
                        Add Connection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies Section */}
            <div className="col-lg-6">
              <div
                className={`card shadow-sm h-100 ${
                  darkMode ? "bg-dark border-dark" : "border-light"
                }`}
              >
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Your Companies</h5>
                </div>
                <div
                  className={
                    darkMode ? "card-body bg-dark text-light" : "card-body"
                  }
                >
                  <ul
                    className={`list-group mb-4 ${
                      darkMode ? "list-group-flush" : ""
                    }`}
                  >
                    {companies.length > 0 ? (
                      companies.map((c) => (
                        <li
                          key={c._id}
                          className={`list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center ${
                            darkMode
                              ? "bg-dark text-light border-secondary"
                              : ""
                          }`}
                        >
                          <div>
                            <strong>{c.name}</strong>{" "}
                            <span className="text-muted small">
                              ({c.industry || "N/A"})
                            </span>
                          </div>
                          {c.website && (
                            <a
                              href={
                                c.website.startsWith("http")
                                  ? c.website
                                  : `https://${c.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm mt-2 mt-md-0"
                            >
                              Visit Website
                            </a>
                          )}
                        </li>
                      ))
                    ) : (
                      <li
                        className={`list-group-item text-center py-3 ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                      >
                        No companies added yet.
                      </li>
                    )}
                  </ul>

                  {/* Add New Company Form */}
                  <h6 className="mb-3">Add New Company</h6>
                  <div className="row g-2">
                    <div className="col-md-12">
                      <input
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        placeholder="Company Name"
                        value={newComp.name}
                        onChange={(e) =>
                          setNewComp({ ...newComp, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        placeholder="Industry (Optional)"
                        value={newComp.industry}
                        onChange={(e) =>
                          setNewComp({ ...newComp, industry: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        placeholder="Website (Optional)"
                        type="url"
                        value={newComp.website}
                        onChange={(e) =>
                          setNewComp({ ...newComp, website: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 mt-2"
                        onClick={addCompany}
                      >
                        Add Company
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center mt-5 pt-4 border-top">
          <button
            className={`btn btn-lg ${
              darkMode ? "btn-outline-light" : "btn-outline-primary"
            }`}
            onClick={() => {
              setToken("");
              localStorage.removeItem("token");
              setConnections([]); // Clear connections on logout
              setCompanies([]); // Clear companies on logout
              setView("login"); // Go back to login view
            }}
          >
            Logout
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
