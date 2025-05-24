import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const PositionList = ({
  openPositionModal,
  setEditPosition,
  viewConnection,
  viewCompany,
}) => {
  const { darkMode, positions, deletePosition } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditPosition = (position) => {
    setEditPosition(position);
    openPositionModal();
  };

  const handleDeletePosition = async (positionId, title) => {
    if (
      window.confirm(`Are you sure you want to delete this position: ${title}?`)
    ) {
      setIsDeleting(true);
      const success = await deletePosition(positionId);
      if (!success) {
        alert("Failed to delete position");
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="col-12">
      <div
        className={`card shadow-sm h-100 ${
          darkMode ? "bg-dark border-dark" : "border-light"
        }`}
      >
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Positions</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={() => {
              setEditPosition(null);
              openPositionModal();
            }}
          >
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          <div className="table-responsive">
            <table
              className={`table ${darkMode ? "table-dark" : "table-light"}`}
            >
              <thead>
                <tr>
                  <th>Connection</th>
                  <th>Company</th>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.length > 0 ? (
                  positions.map((position) => (
                    <tr key={position._id}>
                      <td>
                        <a
                          href="#"
                          className={darkMode ? "text-light" : "text-dark"}
                          onClick={(e) => {
                            e.preventDefault();
                            viewConnection(position.connectionId._id);
                          }}
                          style={{ textDecoration: "none", cursor: "pointer" }}
                        >
                          {position.connectionId.name}
                        </a>
                      </td>
                      <td>
                        <a
                          href="#"
                          className={darkMode ? "text-light" : "text-dark"}
                          onClick={(e) => {
                            e.preventDefault();
                            viewCompany(position.companyId._id);
                          }}
                          style={{ textDecoration: "none", cursor: "pointer" }}
                        >
                          {position.companyId.name}
                        </a>
                      </td>
                      <td>{position.title}</td>
                      <td>{formatDate(position.startDate)}</td>
                      <td>
                        {position.current
                          ? "Current"
                          : formatDate(position.endDate)}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEditPosition(position)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleDeletePosition(position._id, position.title)
                            }
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No positions found. Add a position to connect a person
                      with a company.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionList;
