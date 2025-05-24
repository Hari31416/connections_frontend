import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const ConnectionModal = ({ showModal, closeModal, editConnection = null }) => {
  const {
    darkMode,
    addConnection,
    updateConnection,
    positions,
    companies,
    addPosition,
    updatePosition,
    deletePosition,
  } = useApp();
  const [newConn, setNewConn] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // State for position management within the modal
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [positionFormData, setPositionFormData] = useState({
    companyId: "",
    title: "",
    startDate: "",
    endDate: "",
    current: false,
    notes: "",
  });

  // If editing an existing connection, populate the form
  useEffect(() => {
    if (editConnection) {
      setNewConn({
        id: editConnection._id,
        name: editConnection.name || "",
        email: editConnection.email || "",
        phone: editConnection.phone || "",
        linkedinUserId: editConnection.linkedinUserId || "",
        githubUserId: editConnection.githubUserId || "",
        notes: editConnection.notes || "",
      });
    } else {
      // Reset form when adding a new connection
      setNewConn({
        name: "",
        email: "",
        phone: "",
        linkedinUserId: "",
        githubUserId: "",
        notes: "",
      });
    }

    // Reset position form state
    setShowPositionForm(false);
    setEditingPosition(null);
    resetPositionForm();
  }, [editConnection, showModal]);

  const resetPositionForm = () => {
    setPositionFormData({
      companyId: "",
      title: "",
      startDate: "",
      endDate: "",
      current: false,
      notes: "",
    });
  };

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

  // Get positions for this connection
  const getConnectionPositions = () => {
    if (!editConnection) return [];

    return positions.filter(
      (position) => position.connectionId._id === editConnection._id
    );
  };

  // Handle showing the position form
  const handleAddPosition = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingPosition(null);
    resetPositionForm();
    setShowPositionForm(true);
  };

  // Handle editing a position
  const handleEditPosition = (position, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingPosition(position);
    setPositionFormData({
      id: position._id,
      companyId: position.companyId._id,
      title: position.title || "",
      startDate: position.startDate
        ? new Date(position.startDate).toISOString().split("T")[0]
        : "",
      endDate: position.endDate
        ? new Date(position.endDate).toISOString().split("T")[0]
        : "",
      current: position.current || false,
      notes: position.notes || "",
    });
    setShowPositionForm(true);
  };

  // Handle deleting a position
  const handleDeletePosition = async (positionId, title, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      window.confirm(`Are you sure you want to delete this position: ${title}?`)
    ) {
      const success = await deletePosition(positionId);
      if (!success) {
        alert("Failed to delete position");
      }
    }
  };

  // Handle submitting the position form
  const handlePositionSubmit = async (e) => {
    e.preventDefault();
    let success;

    const positionData = {
      ...positionFormData,
      connectionId: editConnection._id,
    };

    if (editingPosition) {
      positionData.id = editingPosition._id;
      success = await updatePosition(positionData);
    } else {
      success = await addPosition(positionData);
    }

    if (success) {
      setShowPositionForm(false);
      resetPositionForm();
    }
  };

  // When "current" is checked, clear the end date
  const handleCurrentChange = (e) => {
    const isCurrent = e.target.checked;
    setPositionFormData({
      ...positionFormData,
      current: isCurrent,
      endDate: isCurrent ? "" : positionFormData.endDate,
    });
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
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
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
              <div className="mb-3">
                <label htmlFor="connectionLinkedin" className="form-label">
                  LinkedIn User ID
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="connectionLinkedin"
                  placeholder="e.g. john-doe-123456789"
                  value={newConn.linkedinUserId}
                  onChange={(e) =>
                    setNewConn({ ...newConn, linkedinUserId: e.target.value })
                  }
                />
                <small className="form-text text-muted">
                  Enter the LinkedIn username or profile ID (the part after /in/
                  in the LinkedIn URL)
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="connectionGithub" className="form-label">
                  GitHub User ID
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="connectionGithub"
                  placeholder="e.g. johndoe"
                  value={newConn.githubUserId}
                  onChange={(e) =>
                    setNewConn({ ...newConn, githubUserId: e.target.value })
                  }
                />
                <small className="form-text text-muted">
                  Enter the GitHub username (the part after github.com/ in the
                  GitHub URL)
                </small>
              </div>

              {/* Show company positions when editing */}
              {editConnection && (
                <div className="mb-4 mt-4">
                  <h6 className="border-bottom pb-2">Company Positions</h6>

                  {/* List of associated positions */}
                  {getConnectionPositions().length > 0 ? (
                    <div className="table-responsive">
                      <table
                        className={`table ${darkMode ? "table-dark" : ""}`}
                      >
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getConnectionPositions().map((position) => (
                            <tr key={position._id}>
                              <td>{position.companyId.name}</td>
                              <td>{position.title}</td>
                              <td>{formatDate(position.startDate)}</td>
                              <td>
                                {position.current
                                  ? "Current"
                                  : formatDate(position.endDate)}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary me-2"
                                  onClick={(e) =>
                                    handleEditPosition(position, e)
                                  }
                                  title="Edit Position"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={(e) =>
                                    handleDeletePosition(
                                      position._id,
                                      position.title,
                                      e
                                    )
                                  }
                                  title="Delete Position"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted mb-3">
                      No positions associated with this connection yet.
                    </div>
                  )}

                  {/* Add Position Button */}
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={handleAddPosition}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Add Position
                    </button>
                  </div>
                </div>
              )}

              {/* Position Form - Shown when adding/editing a position */}
              {showPositionForm && (
                <div className="mt-4 mb-4 p-3 border rounded">
                  <h6 className="border-bottom pb-2">
                    {editingPosition ? "Edit Position" : "Add New Position"}
                  </h6>
                  <div>
                    {" "}
                    {/* Changed from form to div */}
                    <div className="mb-3">
                      <label htmlFor="positionCompany" className="form-label">
                        Company
                      </label>
                      <select
                        className={`form-select ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        id="positionCompany"
                        value={positionFormData.companyId}
                        onChange={(e) =>
                          setPositionFormData({
                            ...positionFormData,
                            companyId: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select a company</option>
                        {companies.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="positionTitle" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        id="positionTitle"
                        placeholder="Enter job title"
                        value={positionFormData.title}
                        onChange={(e) =>
                          setPositionFormData({
                            ...positionFormData,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="positionStartDate" className="form-label">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        id="positionStartDate"
                        value={positionFormData.startDate}
                        onChange={(e) =>
                          setPositionFormData({
                            ...positionFormData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="positionEndDate" className="form-label">
                        End Date
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        id="positionEndDate"
                        value={positionFormData.endDate}
                        onChange={(e) =>
                          setPositionFormData({
                            ...positionFormData,
                            endDate: e.target.value,
                          })
                        }
                        disabled={positionFormData.current}
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="positionCurrent"
                        checked={positionFormData.current}
                        onChange={handleCurrentChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="positionCurrent"
                      >
                        Currently Employed
                      </label>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="positionNotes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        className={`form-control ${
                          darkMode ? "bg-dark text-light border-secondary" : ""
                        }`}
                        id="positionNotes"
                        rows="3"
                        placeholder="Add notes about this position"
                        value={positionFormData.notes}
                        onChange={(e) =>
                          setPositionFormData({
                            ...positionFormData,
                            notes: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPositionForm(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePositionSubmit(e);
                        }}
                      >
                        {editingPosition ? "Update Position" : "Save Position"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
