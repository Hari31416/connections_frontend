import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import PositionModal from "../modals/PositionModal";
import ModalBackdrop from "../modals/ModalBackdrop";

const ConnectionDetails = ({ connectionId, onBack, viewCompany }) => {
  const { darkMode, connections, positions, companies, deletePosition } =
    useApp();
  const [connection, setConnection] = useState(null);
  const [connectionPositions, setConnectionPositions] = useState([]);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [editPosition, setEditPosition] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Find the connection
    const foundConnection = connections.find((c) => c._id === connectionId);
    setConnection(foundConnection);

    // Find related positions
    const relatedPositions = positions.filter(
      (position) => position.connectionId._id === connectionId
    );
    setConnectionPositions(relatedPositions);
  }, [connectionId, connections, positions]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditPosition = (position) => {
    setEditPosition(position);
    setShowPositionModal(true);
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

  const openPositionModal = () => {
    setEditPosition(null);
    setShowPositionModal(true);
  };

  const closePositionModal = () => {
    setShowPositionModal(false);
  };

  // Group positions by company
  const positionsByCompany = connectionPositions.reduce((acc, position) => {
    const companyId = position.companyId._id;
    if (!acc[companyId]) {
      acc[companyId] = {
        company: position.companyId,
        positions: [],
      };
    }
    acc[companyId].positions.push(position);
    return acc;
  }, {});

  if (!connection) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Get current position if any
  const currentPosition = connectionPositions.find((p) => p.current);

  return (
    <div className="col-12">
      <div
        className={`card shadow-sm h-100 ${
          darkMode ? "bg-dark border-dark" : "border-light"
        }`}
      >
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <div>
            <button
              className="btn btn-sm btn-light me-3"
              onClick={onBack}
              aria-label="Back"
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <span className="h5 mb-0">Contact Details</span>
          </div>
          <button
            className="btn btn-sm btn-success"
            onClick={openPositionModal}
          >
            <i className="bi bi-plus-lg"></i> Add Position
          </button>
        </div>

        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          {/* Contact Information Card */}
          <div
            className={`card mb-4 ${
              darkMode ? "bg-dark text-light border-secondary" : ""
            }`}
          >
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                {connection.name}
                {currentPosition && (
                  <span className="badge bg-success ms-2">
                    {currentPosition.title} at {currentPosition.companyId.name}
                  </span>
                )}
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="mb-1">Contact Information</h6>
                    {connection.email && (
                      <div className="mb-2">
                        <i className="bi bi-envelope me-2"></i>
                        <a
                          href={`mailto:${connection.email}`}
                          className={darkMode ? "text-light" : "text-primary"}
                        >
                          {connection.email}
                        </a>
                      </div>
                    )}
                    {connection.phone && (
                      <div className="mb-2">
                        <i className="bi bi-telephone me-2"></i>
                        <a
                          href={`tel:${connection.phone}`}
                          className={darkMode ? "text-light" : "text-primary"}
                        >
                          {connection.phone}
                        </a>
                      </div>
                    )}
                    {connection.linkedinUserId && (
                      <div className="mb-2">
                        <i className="bi bi-linkedin me-2"></i>
                        <a
                          href={`https://www.linkedin.com/in/${connection.linkedinUserId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={darkMode ? "text-light" : "text-primary"}
                        >
                          {connection.linkedinUserId}
                        </a>
                      </div>
                    )}
                    {connection.githubUserId && (
                      <div className="mb-2">
                        <i className="bi bi-github me-2"></i>
                        <a
                          href={`https://github.com/${connection.githubUserId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={darkMode ? "text-light" : "text-primary"}
                        >
                          {connection.githubUserId}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {connection.notes && (
                    <div>
                      <h6 className="mb-1">Notes</h6>
                      <p className={darkMode ? "text-light-50" : "text-muted"}>
                        {connection.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company and Position History */}
          <h4 className="mb-3">Career History</h4>

          {Object.values(positionsByCompany).length > 0 ? (
            Object.values(positionsByCompany).map(({ company, positions }) => (
              <div
                key={company._id}
                className={`card mb-4 ${
                  darkMode ? "bg-dark text-light border-secondary" : ""
                }`}
              >
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-building me-2"></i>
                    <a
                      href="#"
                      className={darkMode ? "text-light" : "text-dark"}
                      onClick={(e) => {
                        e.preventDefault();
                        viewCompany(company._id);
                      }}
                      style={{ textDecoration: "none", cursor: "pointer" }}
                    >
                      {company.name}
                    </a>
                    {company.industry && (
                      <span className={`ms-2 badge bg-secondary`}>
                        {company.industry}
                      </span>
                    )}
                  </h5>
                </div>
                <div className="card-body">
                  {company.website && (
                    <div className="mb-3">
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-globe me-1"></i> Visit Website
                      </a>
                    </div>
                  )}

                  <h6 className="border-bottom pb-2">Positions</h6>
                  <div className="table-responsive">
                    <table
                      className={`table table-hover ${
                        darkMode ? "table-dark" : ""
                      }`}
                    >
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Notes</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((position) => (
                          <tr key={position._id}>
                            <td>{position.title}</td>
                            <td>{formatDate(position.startDate)}</td>
                            <td>
                              {position.current
                                ? "Current"
                                : formatDate(position.endDate)}
                            </td>
                            <td>
                              {position.notes
                                ? position.notes.length > 50
                                  ? `${position.notes.substring(0, 50)}...`
                                  : position.notes
                                : "-"}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEditPosition(position)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeletePosition(
                                    position._id,
                                    position.title
                                  )
                                }
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className="bi bi-trash"></i>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`alert ${
                darkMode ? "alert-dark" : "alert-light"
              } text-center`}
            >
              No positions found for this connection. Add a position to get
              started.
            </div>
          )}
        </div>
      </div>

      {/* Position Modal */}
      <PositionModal
        showModal={showPositionModal}
        closeModal={closePositionModal}
        editPosition={editPosition}
        preselectedConnectionId={connectionId}
      />
      <ModalBackdrop show={showPositionModal} />
    </div>
  );
};

export default ConnectionDetails;
