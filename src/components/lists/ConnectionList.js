import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const ConnectionList = ({
  openConnectionModal,
  setEditConnection,
  viewConnection,
}) => {
  const { darkMode, connections, deleteConnection, positions } = useApp();
  const [expandedConnection, setExpandedConnection] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleEditConnection = (connection) => {
    setEditConnection(connection);
    openConnectionModal();
  };

  const handleDeleteConnection = async (connectionId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setIsDeleting(true);
      const success = await deleteConnection(connectionId);
      if (success) {
        // If the deleted connection was expanded, collapse it
        if (expandedConnection === connectionId) {
          setExpandedConnection(null);
        }
      }
      setIsDeleting(false);
    }
  };

  // Get positions for a specific connection
  const getConnectionPositions = (connectionId) => {
    return positions.filter(
      (position) => position.connectionId._id === connectionId
    );
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
            onClick={() => {
              setEditConnection(null);
              openConnectionModal();
            }}
          >
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          <div className="list-group connection-list">
            {connections.length > 0 ? (
              connections.map((connection) => {
                const connectionPositions = getConnectionPositions(
                  connection._id
                );
                return (
                  <React.Fragment key={connection._id}>
                    <div
                      className={`list-group-item ${
                        darkMode ? "bg-dark text-light border-secondary" : ""
                      }`}
                    >
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <div className="d-flex align-items-start">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => toggleExpand(connection._id)}
                            aria-label={
                              expandedConnection === connection._id
                                ? "Collapse"
                                : "Expand"
                            }
                          >
                            <i
                              className={`bi bi-chevron-${
                                expandedConnection === connection._id
                                  ? "up"
                                  : "down"
                              }`}
                            ></i>
                          </button>
                          <div>
                            <div className="fw-bold mb-1">
                              <a
                                href="#"
                                className={
                                  darkMode ? "text-light" : "text-dark"
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  viewConnection(connection._id);
                                }}
                                style={{
                                  textDecoration: "none",
                                  cursor: "pointer",
                                }}
                              >
                                {connection.name}
                              </a>
                            </div>
                            {connectionPositions.length > 0 &&
                              connectionPositions.some((p) => p.current) && (
                                <div className="mb-1">
                                  <span className="badge bg-success">
                                    {
                                      connectionPositions.find((p) => p.current)
                                        ?.title
                                    }{" "}
                                    at{" "}
                                    {
                                      connectionPositions.find((p) => p.current)
                                        ?.companyId.name
                                    }
                                  </span>
                                </div>
                              )}
                            <div
                              className={`small ${
                                darkMode ? "text-light-50" : "text-muted"
                              }`}
                            >
                              {connection.email && (
                                <div className="mb-1">
                                  <i className="bi bi-envelope me-1"></i>
                                  <a
                                    href={`mailto:${connection.email}`}
                                    className={
                                      darkMode ? "text-light-50" : "text-muted"
                                    }
                                  >
                                    {connection.email}
                                  </a>
                                </div>
                              )}
                              {connection.phone && (
                                <div>
                                  <i className="bi bi-telephone me-1"></i>
                                  <a
                                    href={`tel:${connection.phone}`}
                                    className={
                                      darkMode ? "text-light-50" : "text-muted"
                                    }
                                  >
                                    {connection.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <span className="badge bg-info">
                            {connectionPositions.length}{" "}
                            {connectionPositions.length === 1
                              ? "position"
                              : "positions"}
                          </span>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-info"
                              onClick={() => viewConnection(connection._id)}
                              aria-label="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEditConnection(connection)}
                              aria-label="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                handleDeleteConnection(
                                  connection._id,
                                  connection.name
                                )
                              }
                              disabled={isDeleting}
                              aria-label="Delete"
                            >
                              {isDeleting ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedConnection === connection._id && (
                      <div
                        className={`list-group-item ${
                          darkMode
                            ? "bg-dark text-light border-secondary"
                            : "bg-light"
                        }`}
                      >
                        <div className="py-1">
                          {connection.notes && (
                            <div className="mb-3">
                              <h6 className="border-bottom pb-2">Notes:</h6>
                              <p
                                className={
                                  darkMode ? "text-light-50" : "text-muted"
                                }
                              >
                                {connection.notes}
                              </p>
                            </div>
                          )}

                          <h6 className="border-bottom pb-2">
                            Company Positions:
                          </h6>
                          {connectionPositions.length > 0 ? (
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
                                  {connectionPositions.map((position) => (
                                    <tr key={position._id}>
                                      <td>{position.companyId.name}</td>
                                      <td>{position.title}</td>
                                      <td>{formatDate(position.startDate)}</td>
                                      <td>
                                        {position.current
                                          ? "Current"
                                          : formatDate(position.endDate)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p
                              className={
                                darkMode ? "text-light-50" : "text-muted"
                              }
                            >
                              No positions associated with this connection.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div
                className={`list-group-item text-center py-3 ${
                  darkMode ? "bg-dark text-light border-secondary" : ""
                }`}
              >
                No connections added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionList;
