import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const ConnectionModal = ({ showModal, closeModal }) => {
  const { darkMode, addConnection } = useApp();
  const [newConn, setNewConn] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addConnection(newConn);
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
      aria-labelledby="connectionModalLabel"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog" role="document">
        <div
          className={`modal-content ${darkMode ? "bg-dark text-light" : ""}`}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="connectionModalLabel">
              Add New Connection
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
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Connection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;