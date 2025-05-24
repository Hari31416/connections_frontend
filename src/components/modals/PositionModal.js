import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const PositionModal = ({
  showModal,
  closeModal,
  editPosition = null,
  preselectedConnectionId = null,
  preselectedCompanyId = null,
}) => {
  const { darkMode, companies, connections, addPosition, updatePosition } =
    useApp();

  const [newPos, setNewPos] = useState({
    connectionId: "",
    companyId: "",
    title: "",
    startDate: "",
    endDate: "",
    current: false,
    notes: "",
  });

  // If editing an existing position, populate the form
  useEffect(() => {
    if (editPosition) {
      setNewPos({
        id: editPosition._id,
        connectionId: editPosition.connectionId._id,
        companyId: editPosition.companyId._id,
        title: editPosition.title || "",
        startDate: editPosition.startDate
          ? new Date(editPosition.startDate).toISOString().split("T")[0]
          : "",
        endDate: editPosition.endDate
          ? new Date(editPosition.endDate).toISOString().split("T")[0]
          : "",
        current: editPosition.current || false,
        notes: editPosition.notes || "",
      });
    } else {
      // Reset form when adding a new position
      setNewPos({
        connectionId: preselectedConnectionId || "",
        companyId: preselectedCompanyId || "",
        title: "",
        startDate: "",
        endDate: "",
        current: false,
        notes: "",
      });
    }
  }, [editPosition, showModal, preselectedConnectionId, preselectedCompanyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;

    if (editPosition) {
      success = await updatePosition(newPos);
    } else {
      success = await addPosition(newPos);
    }

    if (success) {
      closeModal();
    }
  };

  // When "current" is checked, clear the end date
  const handleCurrentChange = (e) => {
    const isCurrent = e.target.checked;
    setNewPos({
      ...newPos,
      current: isCurrent,
      endDate: isCurrent ? "" : newPos.endDate,
    });
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="positionModalLabel"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog" role="document">
        <div
          className={`modal-content ${darkMode ? "bg-dark text-light" : ""}`}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="positionModalLabel">
              {editPosition ? "Edit Position" : "Add New Position"}
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
              {/* Connection Selection */}
              <div className="mb-3">
                <label htmlFor="connectionSelect" className="form-label">
                  Connection
                </label>
                <select
                  id="connectionSelect"
                  className={`form-select ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  value={newPos.connectionId}
                  onChange={(e) =>
                    setNewPos({ ...newPos, connectionId: e.target.value })
                  }
                  required
                  disabled={editPosition || preselectedConnectionId} // Disable when editing existing position or preselected
                >
                  <option value="">Select a connection</option>
                  {connections.map((connection) => (
                    <option key={connection._id} value={connection._id}>
                      {connection.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Selection */}
              <div className="mb-3">
                <label htmlFor="companySelect" className="form-label">
                  Company
                </label>
                <select
                  id="companySelect"
                  className={`form-select ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  value={newPos.companyId}
                  onChange={(e) =>
                    setNewPos({ ...newPos, companyId: e.target.value })
                  }
                  required
                  disabled={editPosition || preselectedCompanyId} // Disable when editing existing position or preselected
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Position Title */}
              <div className="mb-3">
                <label htmlFor="positionTitle" className="form-label">
                  Position Title
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  id="positionTitle"
                  placeholder="e.g. Software Engineer"
                  value={newPos.title}
                  onChange={(e) =>
                    setNewPos({ ...newPos, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Date Range */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="startDateInput" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      darkMode ? "bg-dark text-light border-secondary" : ""
                    }`}
                    id="startDateInput"
                    value={newPos.startDate}
                    onChange={(e) =>
                      setNewPos({ ...newPos, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="endDateInput" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      darkMode ? "bg-dark text-light border-secondary" : ""
                    }`}
                    id="endDateInput"
                    value={newPos.endDate}
                    onChange={(e) =>
                      setNewPos({ ...newPos, endDate: e.target.value })
                    }
                    disabled={newPos.current}
                  />
                </div>
              </div>

              {/* Current Position Checkbox */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="currentPosition"
                  checked={newPos.current}
                  onChange={handleCurrentChange}
                />
                <label className="form-check-label" htmlFor="currentPosition">
                  Current Position
                </label>
              </div>

              {/* Notes */}
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
                  value={newPos.notes}
                  onChange={(e) =>
                    setNewPos({ ...newPos, notes: e.target.value })
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
                {editPosition ? "Update Position" : "Save Position"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PositionModal;
