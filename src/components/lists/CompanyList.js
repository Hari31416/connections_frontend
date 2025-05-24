import React from "react";
import { useApp } from "../../context/AppContext";

const CompanyList = ({ openCompanyModal }) => {
  const { darkMode, companies } = useApp();

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
          <ul className={`list-group ${darkMode ? "list-group-flush" : ""}`}>
            {companies.length > 0 ? (
              companies.map((c) => (
                <li
                  key={c._id}
                  className={`list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                >
                  <div>
                    <strong>{c.name}</strong>{" "}
                    <span>({c.industry || "N/A"})</span>
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
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
