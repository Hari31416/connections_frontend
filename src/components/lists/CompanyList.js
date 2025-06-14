import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

const CompanyList = ({ openCompanyModal, setEditCompany, viewCompany }) => {
  const { darkMode, companies, deleteCompany, positions } = useApp();
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

  const handleEditCompany = (company) => {
    setEditCompany(company);
    openCompanyModal();
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

  // Get positions for a specific company
  const getCompanyPositions = (companyId) => {
    return positions.filter((position) => position.companyId._id === companyId);
  };

  return (
    <div className="col-12">
      <div
        className={`card shadow-sm h-100 ${
          darkMode ? "bg-dark border-dark" : "border-light"
        }`}
      >
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Companies</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={() => {
              setEditCompany(null);
              openCompanyModal();
            }}
          >
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          <div className="list-group company-list">
            {companies.length > 0 ? (
              companies.map((company) => {
                const companyPositions = getCompanyPositions(company._id);
                return (
                  <React.Fragment key={company._id}>
                    <div
                      className={`list-group-item ${
                        darkMode ? "bg-dark text-light border-secondary" : ""
                      }`}
                    >
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <div className="d-flex align-items-start">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => toggleExpand(company._id)}
                            aria-label={
                              expandedCompany === company._id
                                ? "Collapse"
                                : "Expand"
                            }
                          >
                            <i
                              className={`bi bi-chevron-${
                                expandedCompany === company._id ? "up" : "down"
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
                                  viewCompany(company._id);
                                }}
                                style={{
                                  textDecoration: "none",
                                  cursor: "pointer",
                                }}
                              >
                                {company.name}
                              </a>
                            </div>
                            <div
                              className={
                                darkMode ? "text-light-50" : "text-muted"
                              }
                            >
                              {company.industry || "Industry not specified"}
                            </div>
                            {company.website && (
                              <div className="mt-2">
                                <a
                                  href={
                                    company.website.startsWith("http")
                                      ? company.website
                                      : `https://${company.website}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-primary"
                                >
                                  <i className="bi bi-globe me-1"></i>
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <span className="badge bg-info">
                            {companyPositions.length}{" "}
                            {companyPositions.length === 1
                              ? "position"
                              : "positions"}
                          </span>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-info"
                              onClick={() => viewCompany(company._id)}
                              aria-label="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEditCompany(company)}
                              aria-label="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                handleDeleteCompany(company._id, company.name)
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

                    {expandedCompany === company._id && (
                      <div
                        className={`list-group-item ${
                          darkMode
                            ? "bg-dark text-light border-secondary"
                            : "bg-light"
                        }`}
                      >
                        <div className="py-1">
                          <h6 className="border-bottom pb-2">
                            People at this Company:
                          </h6>
                          {companyPositions.length > 0 ? (
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
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {companyPositions.map((position) => (
                                    <tr key={position._id}>
                                      <td>{position.connectionId.name}</td>
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
                              No positions associated with this company.
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
