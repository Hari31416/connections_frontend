import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

const CompanyList = ({ openCompanyModal }) => {
  const { darkMode, companies, deleteCompany } = useApp();
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleExpand = (companyId) => {
    if (expandedCompany === companyId) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(companyId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      setIsDeleting(true);
      const success = await deleteCompany(companyId);
      if (success) {
        // If the deleted company was expanded, collapse it
        if (expandedCompany === companyId) {
          setExpandedCompany(null);
        }
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="col-12">
      <div
        className={`card shadow-sm h-100 ${
          darkMode ? "bg-dark border-dark" : "border-light"
        }`}
      >
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Your Companies</h5>
          <button className="btn btn-sm btn-light" onClick={openCompanyModal}>
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          <div className="list-group">
            {companies.length > 0 ? (
              companies.map((c) => (
                <React.Fragment key={c._id}>
                  <div
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      darkMode ? "bg-dark text-light border-secondary" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-3"
                        onClick={() => toggleExpand(c._id)}
                      >
                        <i
                          className={`bi bi-chevron-${
                            expandedCompany === c._id ? "up" : "down"
                          }`}
                        ></i>
                      </button>
                      <div>
                        <strong>{c.name}</strong>{" "}
                        <span className="text-muted">
                          ({c.industry || "N/A"})
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      {c.connections && (
                        <span className="badge bg-info me-3">
                          {c.connections.length}{" "}
                          {c.connections.length === 1
                            ? "connection"
                            : "connections"}
                        </span>
                      )}
                      {c.website && (
                        <a
                          href={
                            c.website.startsWith("http")
                              ? c.website
                              : `https://${c.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Visit Website
                        </a>
                      )}
                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => handleDeleteCompany(c._id, c.name)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedCompany === c._id && c.connections && (
                    <div
                      className={`list-group-item ${
                        darkMode
                          ? "bg-dark text-light border-secondary"
                          : "bg-light"
                      }`}
                    >
                      <div className="p-2">
                        <h6>Associated Connections:</h6>
                        {c.connections.length > 0 ? (
                          <div className="table-responsive">
                            <table
                              className={`table table-sm ${
                                darkMode ? "table-dark" : "table-light"
                              }`}
                            >
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Position</th>
                                </tr>
                              </thead>
                              <tbody>
                                {c.connections.map((connection, idx) => (
                                  <tr key={idx}>
                                    <td>{connection.connectionName}</td>
                                    <td>{connection.position || "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-muted">
                            No connections associated with this company.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div
                className={`list-group-item text-center py-3 ${
                  darkMode ? "bg-dark text-light border-secondary" : ""
                }`}
              >
                No companies added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
