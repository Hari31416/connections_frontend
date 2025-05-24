import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

const ConnectionList = ({ openConnectionModal }) => {
  const { darkMode, connections, deleteConnection } = useApp();
  const [expandedConnection, setExpandedConnection] = useState(null);

  const handleEdit = (connection) => {
    openConnectionModal(connection);
  };

  const handleDelete = async (connectionId) => {
    if (window.confirm("Are you sure you want to delete this connection?")) {
      await deleteConnection(connectionId);
    }
  };

  const toggleExpand = (connectionId) => {
    if (expandedConnection === connectionId) {
      setExpandedConnection(null);
    } else {
      setExpandedConnection(connectionId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="col-12">
      <div
        className={`card shadow-sm h-100 ${
          darkMode ? "bg-dark border-dark" : "border-light"
        }`}
      >
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Your Connections</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={() => openConnectionModal()}
          >
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          <div className="table-responsive">
            <table
              className={`table table-hover align-middle mb-0 ${
                darkMode ? "table-dark" : ""
              }`}
            >
              <thead className={darkMode ? "" : "table-light"}>
                <tr>
                  <th style={{ width: "40px" }}></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Companies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {connections.length > 0 ? (
                  connections.map((c) => (
                    <React.Fragment key={c._id}>
                      <tr>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleExpand(c._id)}
                          >
                            <i
                              className={`bi bi-chevron-${
                                expandedConnection === c._id ? "up" : "down"
                              }`}
                            ></i>
                          </button>
                        </td>
                        <td>{c.name}</td>
                        <td>{c.email || "-"}</td>
                        <td>{c.phone || "-"}</td>
                        <td>
                          {c.companies && c.companies.length > 0
                            ? `${c.companies.length} ${
                                c.companies.length === 1
                                  ? "company"
                                  : "companies"
                              }`
                            : "None"}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(c)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(c._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedConnection === c._id && (
                        <tr>
                          <td
                            colSpan="6"
                            className={darkMode ? "bg-dark" : "bg-light"}
                          >
                            <div className="p-3">
                              {c.notes && (
                                <div className="mb-3">
                                  <h6>Notes:</h6>
                                  <p className="text-muted">{c.notes}</p>
                                </div>
                              )}

                              <h6>Companies & Positions:</h6>
                              {c.companies && c.companies.length > 0 ? (
                                <div className="table-responsive">
                                  <table
                                    className={`table table-sm ${
                                      darkMode ? "table-dark" : "table-light"
                                    }`}
                                  >
                                    <thead>
                                      <tr>
                                        <th>Company</th>
                                        <th>Position</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {c.companies.map((company, idx) => (
                                        <tr key={idx}>
                                          <td>{company.companyName}</td>
                                          <td>{company.position || "-"}</td>
                                          <td>
                                            {formatDate(company.startDate)}
                                          </td>
                                          <td>{formatDate(company.endDate)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-muted">
                                  No companies associated with this connection.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      No connections added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionList;
