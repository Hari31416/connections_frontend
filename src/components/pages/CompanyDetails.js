import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import PositionModal from "../modals/PositionModal";
import ModalBackdrop from "../modals/ModalBackdrop";

const CompanyDetails = ({ companyId, onBack }) => {
  const { darkMode, companies, positions, connections, deletePosition } =
    useApp();
  const [company, setCompany] = useState(null);
  const [companyPositions, setCompanyPositions] = useState([]);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [editPosition, setEditPosition] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Find the company
    const foundCompany = companies.find((c) => c._id === companyId);
    setCompany(foundCompany);

    // Find related positions
    const relatedPositions = positions.filter(
      (position) => position.companyId._id === companyId
    );
    setCompanyPositions(relatedPositions);
  }, [companyId, companies, positions]);

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

  // Group positions by connection
  const positionsByConnection = companyPositions.reduce((acc, position) => {
    const connectionId = position.connectionId._id;
    if (!acc[connectionId]) {
      acc[connectionId] = {
        connection: position.connectionId,
        positions: [],
      };
    }
    acc[connectionId].positions.push(position);
    return acc;
  }, {});

  if (!company) {
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
            <span className="h5 mb-0">Company Details</span>
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
          {/* Company Information Card */}
          <div
            className={`card mb-4 ${
              darkMode ? "bg-dark text-light border-secondary" : ""
            }`}
          >
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-building me-2"></i>
                {company.name}
                {company.industry && (
                  <span className="badge bg-secondary ms-2">
                    {company.industry}
                  </span>
                )}
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {company.website && (
                    <div className="mb-3">
                      <h6 className="mb-1">Website</h6>
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          darkMode ? "text-light" : "text-primary"
                        }`}
                      >
                        <i className="bi bi-globe me-2"></i>
                        {company.website}
                      </a>
                    </div>
                  )}
                  <div className="mb-3">
                    <h6 className="mb-1">People at this Company</h6>
                    <div className="badge bg-info">
                      {Object.keys(positionsByConnection).length}{" "}
                      {Object.keys(positionsByConnection).length === 1
                        ? "person"
                        : "people"}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  {company.industry && (
                    <div>
                      <h6 className="mb-1">Industry</h6>
                      <p className={darkMode ? "text-light-50" : "text-muted"}>
                        {company.industry}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* People and Position Listings */}
          <h4 className="mb-3">People at {company.name}</h4>

          {Object.values(positionsByConnection).length > 0 ? (
            Object.values(positionsByConnection).map(
              ({ connection, positions }) => (
                <div
                  key={connection._id}
                  className={`card mb-4 ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                >
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-person-circle me-2"></i>
                      {connection.name}
                      {positions.some((p) => p.current) && (
                        <span className="badge bg-success ms-2">
                          Currently employed
                        </span>
                      )}
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-6">
                          {connection.email && (
                            <div className="mb-2">
                              <i className="bi bi-envelope me-2"></i>
                              <a
                                href={`mailto:${connection.email}`}
                                className={
                                  darkMode ? "text-light" : "text-primary"
                                }
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
                                className={
                                  darkMode ? "text-light" : "text-primary"
                                }
                              >
                                {connection.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

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
              )
            )
          ) : (
            <div
              className={`alert ${
                darkMode ? "alert-dark" : "alert-light"
              } text-center`}
            >
              No positions found for this company. Add a position to get
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
        preselectedCompanyId={companyId}
      />
      <ModalBackdrop show={showPositionModal} />
    </div>
  );
};

export default CompanyDetails;
