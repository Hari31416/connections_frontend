import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const ConnectionModal = ({ showModal, closeModal, editConnection = null }) => {
  const { darkMode, addConnection, updateConnection, positions } = useApp();
  const [newConn, setNewConn] = useState({
    name: "",
    email: "",
    phone: "",
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
        notes: editConnection.notes || "",
      });
    } else {
      // Reset form when adding a new connection
      setNewConn({
        name: "",
        email: "",
        phone: "",
        notes: "",
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

  // Get positions for this connection
  const getConnectionPositions = () => {
    if (!editConnection) return [];

    return positions.filter(
      (position) => position.connectionId._id === editConnection._id
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

              {/* Show company positions when editing */}
              {editConnection && (
                <div className="mb-4 mt-4">
                  <h6 className="border-bottom pb-2">Company Positions</h6>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    To add or manage positions, use the Positions tab after
                    saving this connection.
                  </div>

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
