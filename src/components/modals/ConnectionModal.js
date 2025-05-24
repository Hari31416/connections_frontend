import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const ConnectionModal = ({ showModal, closeModal, editConnection = null }) => {
  const { darkMode, addConnection, updateConnection, companies } = useApp();
  const [newConn, setNewConn] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    companies: [],
  });
  const [selectedCompany, setSelectedCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // If editing an existing connection, populate the form
  useEffect(() => {
    if (editConnection) {
      setNewConn({
        id: editConnection._id,
        name: editConnection.name || "",
        email: editConnection.email || "",
        phone: editConnection.phone || "",
        notes: editConnection.notes || "",
        companies: editConnection.companies || [],
      });
    } else {
      // Reset form when adding a new connection
      setNewConn({
        name: "",
        email: "",
        phone: "",
        notes: "",
        companies: [],
      });
    }
  }, [editConnection, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;

    if (editConnection) {
      success = await updateConnection(newConn);
    } else {
      success = await addConnection(newConn);
    }

    if (success) {
      closeModal();
    }
  };

  const addCompanyToConnection = () => {
    if (!selectedCompany) return;

    const company = companies.find((c) => c._id === selectedCompany);
    if (!company) return;

    // Create new company entry
    const companyEntry = {
      companyId: company._id,
      companyName: company.name,
      position: position,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    // Add to companies array
    setNewConn({
      ...newConn,
      companies: [...newConn.companies, companyEntry],
    });

    // Reset form fields
    setSelectedCompany("");
    setPosition("");
    setStartDate("");
    setEndDate("");
  };

  const removeCompanyFromConnection = (companyId) => {
    setNewConn({
      ...newConn,
      companies: newConn.companies.filter((c) => c.companyId !== companyId),
    });
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="connectionModalLabel"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div
          className={`modal-content ${darkMode ? "bg-dark text-light" : ""}`}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="connectionModalLabel">
              {editConnection ? "Edit Connection" : "Add New Connection"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="connectionName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="connectionName"
                  placeholder="Enter name"
                  value={newConn.name}
                  onChange={(e) =>
                    setNewConn({ ...newConn, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="connectionEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="connectionEmail"
                  placeholder="Enter email"
                  value={newConn.email}
                  onChange={(e) =>
                    setNewConn({ ...newConn, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="connectionPhone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="connectionPhone"
                  placeholder="Enter phone number"
                  value={newConn.phone}
                  onChange={(e) =>
                    setNewConn({ ...newConn, phone: e.target.value })
                  }
                />
              </div>

              {/* Company Associations Section */}
              <div className="mb-4 mt-4">
                <h6 className="border-bottom pb-2">Company Associations</h6>

                {/* List of associated companies */}
                {newConn.companies && newConn.companies.length > 0 ? (
                  <div className="mb-3">
                    <table className={`table ${darkMode ? "table-dark" : ""}`}>
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Position</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newConn.companies.map((company, index) => (
                          <tr key={index}>
                            <td>{company.companyName}</td>
                            <td>{company.position}</td>
                            <td>
                              {company.startDate
                                ? new Date(
                                    company.startDate
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              {company.endDate
                                ? new Date(company.endDate).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  removeCompanyFromConnection(company.companyId)
                                }
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted mb-3">
                    No companies associated with this connection yet.
                  </div>
                )}

                {/* Add company form */}
                <div className="card mb-3">
                  <div
                    className={`card-header ${darkMode ? "bg-secondary" : ""}`}
                  >
                    Add Company Association
                  </div>
                  <div className={`card-body ${darkMode ? "bg-dark" : ""}`}>
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <label htmlFor="companySelect" className="form-label">
                          Company
                        </label>
                        <select
                          id="companySelect"
                          className={`form-select ${
                            darkMode
                              ? "bg-dark text-light border-secondary"
                              : ""
                          }`}
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.target.value)}
                        >
                          <option value="">Select a company</option>
                          {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="positionInput" className="form-label">
                          Position
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            darkMode
                              ? "bg-dark text-light border-secondary"
                              : ""
                          }`}
                          id="positionInput"
                          placeholder="e.g. Software Engineer"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="startDateInput" className="form-label">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className={`form-control ${
                            darkMode
                              ? "bg-dark text-light border-secondary"
                              : ""
                          }`}
                          id="startDateInput"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="endDateInput" className="form-label">
                          End Date
                        </label>
                        <input
                          type="date"
                          className={`form-control ${
                            darkMode
                              ? "bg-dark text-light border-secondary"
                              : ""
                          }`}
                          id="endDateInput"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={addCompanyToConnection}
                    >
                      Add Company
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="connectionNotes" className="form-label">
                  Notes
                </label>
                <textarea
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="connectionNotes"
                  rows="3"
                  placeholder="Add notes about this connection"
                  value={newConn.notes}
                  onChange={(e) =>
                    setNewConn({ ...newConn, notes: e.target.value })
                  }
                ></textarea>
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
                {editConnection ? "Update Connection" : "Save Connection"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
