import React from "react";
import { useApp } from "../../context/AppContext";

const ConnectionList = ({ openConnectionModal }) => {
  const { darkMode, connections } = useApp();

  return (
    <div className="col-12">
      <div
        className={`card shadow-sm h-100 ${
          darkMode ? "bg-dark border-dark" : "border-light"
        }`}
      >
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Your Connections</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={openConnectionModal}
          >
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
        <div
          className={darkMode ? "card-body bg-dark text-light" : "card-body"}
        >
          <div className="table-responsive">
            <table
              className={`table table-hover align-middle mb-0 ${
                darkMode ? "table-dark" : ""
              }`}
            >
              <thead className={darkMode ? "" : "table-light"}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {connections.length > 0 ? (
                  connections.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.email || "-"}</td>
                      <td>{c.phone || "-"}</td>
                      <td>{c.notes || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-3">
                      No connections added yet.
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

export default ConnectionList;
