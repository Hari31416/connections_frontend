import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { searchConnections } from "../../context/connectionService";
import { searchCompanies } from "../../context/companyService";

const SearchComponent = ({ onSelectConnection, onSelectCompany }) => {
  const { darkMode, token } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    connections: [],
    companies: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState("all"); // 'all', 'connections', 'companies'

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults({ connections: [], companies: [] });
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, searchType, token]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults({ connections: [], companies: [] });
      return;
    }

    setIsSearching(true);
    try {
      let connections = [];
      let companies = [];

      if (searchType === "all" || searchType === "connections") {
        connections = await searchConnections(searchQuery.trim(), token);
      }

      if (searchType === "all" || searchType === "companies") {
        companies = await searchCompanies(searchQuery.trim(), token);
      }

      setSearchResults({ connections, companies });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ connections: [], companies: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ connections: [], companies: [] });
  };

  const handleConnectionClick = (connection) => {
    onSelectConnection(connection._id);
    clearSearch();
  };

  const handleCompanyClick = (company) => {
    onSelectCompany(company._id);
    clearSearch();
  };

  const totalResults =
    searchResults.connections.length + searchResults.companies.length;

  return (
    <div className="search-component mb-4">
      <div className="row">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className={`form-control ${
                darkMode ? "bg-dark text-light border-secondary" : ""
              }`}
              placeholder="Search connections or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={clearSearch}
                title="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <select
            className={`form-select ${
              darkMode ? "bg-dark text-light border-secondary" : ""
            }`}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="connections">Connections Only</option>
            <option value="companies">Companies Only</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim().length >= 2 && (
        <div className={`mt-3 search-results ${darkMode ? "text-light" : ""}`}>
          {isSearching ? (
            <div className="text-center py-3">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Searching...</span>
              </div>
              Searching...
            </div>
          ) : (
            <>
              {totalResults === 0 ? (
                <div className="text-muted text-center py-3">
                  <i className="bi bi-search me-2"></i>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <>
                  <div className="small text-muted mb-2">
                    Found {totalResults} result{totalResults !== 1 ? "s" : ""}{" "}
                    for "{searchQuery}"
                  </div>

                  {/* Connections Results */}
                  {searchResults.connections.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-primary mb-2">
                        <i className="bi bi-people me-2"></i>
                        Connections ({searchResults.connections.length})
                      </h6>
                      <div className="row">
                        {searchResults.connections.map((connection) => (
                          <div key={connection._id} className="col-md-6 mb-2">
                            <div
                              className={`card card-hover ${
                                darkMode
                                  ? "bg-dark border-secondary"
                                  : "border-light"
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleConnectionClick(connection)}
                            >
                              <div className="card-body py-2 px-3">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-person-circle me-2 text-primary"></i>
                                  <div>
                                    <div
                                      className={`fw-bold ${
                                        darkMode ? "text-light" : "text-dark"
                                      }`}
                                    >
                                      {connection.name}
                                    </div>
                                    {connection.email && (
                                      <small className="text-muted">
                                        {connection.email}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Companies Results */}
                  {searchResults.companies.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-success mb-2">
                        <i className="bi bi-building me-2"></i>
                        Companies ({searchResults.companies.length})
                      </h6>
                      <div className="row">
                        {searchResults.companies.map((company) => (
                          <div key={company._id} className="col-md-6 mb-2">
                            <div
                              className={`card card-hover ${
                                darkMode
                                  ? "bg-dark border-secondary"
                                  : "border-light"
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCompanyClick(company)}
                            >
                              <div className="card-body py-2 px-3">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-building me-2 text-success"></i>
                                  <div>
                                    <div
                                      className={`fw-bold ${
                                        darkMode ? "text-light" : "text-dark"
                                      }`}
                                    >
                                      {company.name}
                                    </div>
                                    {company.industry && (
                                      <small className="text-muted">
                                        {company.industry}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Search Help */}
      {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
        <div className="text-muted small mt-2">
          <i className="bi bi-info-circle me-1"></i>
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
