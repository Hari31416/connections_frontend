import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const CompanyModal = ({ showModal, closeModal, editCompany = null }) => {
  const { darkMode, addCompany, updateCompany, positions } = useApp();
  const [newComp, setNewComp] = useState({
    name: "",
    industry: "",
    website: "",
  });

  // If editing an existing company, populate the form
  useEffect(() => {
    if (editCompany) {
      setNewComp({
        id: editCompany._id,
        name: editCompany.name || "",
        industry: editCompany.industry || "",
        website: editCompany.website || "",
      });
    } else {
      // Reset form when adding a new company
      setNewComp({
        name: "",
        industry: "",
        website: "",
      });
    }
  }, [editCompany, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;

    if (editCompany) {
      success = await updateCompany(newComp);
    } else {
      success = await addCompany(newComp);
    }

    if (success) {
      closeModal();
    }
  };

  // Get positions for this company
  const getCompanyPositions = () => {
    if (!editCompany) return [];

    return positions.filter(
      (position) => position.companyId._id === editCompany._id
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="companyModalLabel"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div
          className={`modal-content ${darkMode ? "bg-dark text-light" : ""}`}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="companyModalLabel">
              {editCompany ? "Edit Company" : "Add New Company"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="companyName"
                  placeholder="Enter company name"
                  value={newComp.name}
                  onChange={(e) =>
                    setNewComp({ ...newComp, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="companyIndustry" className="form-label">
                  Industry
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="companyIndustry"
                  placeholder="Enter industry"
                  value={newComp.industry}
                  onChange={(e) =>
                    setNewComp({ ...newComp, industry: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="companyWebsite" className="form-label">
                  Website
                </label>
                <input
                  type="url"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="companyWebsite"
                  placeholder="Enter website URL"
                  value={newComp.website}
                  onChange={(e) =>
                    setNewComp({ ...newComp, website: e.target.value })
                  }
                />
              </div>

              {/* Show company positions when editing */}
              {editCompany && (
                <div className="mb-4 mt-4">
                  <h6 className="border-bottom pb-2">People at this Company</h6>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    To add or manage positions, use the Positions tab after
                    saving this company.
                  </div>

                  {/* List of associated positions */}
                  {getCompanyPositions().length > 0 ? (
                    <div className="table-responsive">
                      <table
                        className={`table ${darkMode ? "table-dark" : ""}`}
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCompanyPositions().map((position) => (
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
                    <div className="text-muted mb-3">
                      No positions associated with this company yet.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editCompany ? "Update Company" : "Save Company"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
