import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

const CompanyModal = ({ showModal, closeModal }) => {
  const { darkMode, addCompany } = useApp();
  const [newComp, setNewComp] = useState({
    name: "",
    industry: "",
    website: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addCompany(newComp);
    if (success) {
      closeModal();
    }
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
      <div className="modal-dialog" role="document">
        <div
          className={`modal-content ${darkMode ? "bg-dark text-light" : ""}`}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="companyModalLabel">
              Add New Company
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
                Save Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
