import {
  fetchWithAuth,
  postWithAuth,
  putWithAuth,
  deleteWithAuth,
} from "./apiUtils";

// Connection service functions
export const fetchConnections = async (token) => {
  try {
    return await fetchWithAuth("/connections", {}, token);
  } catch (error) {
    console.error("Error fetching connections:", error);
    return [];
  }
};

export const addConnection = async (newConn, token) => {
  try {
    return await postWithAuth("/connections", newConn, token);
  } catch (error) {
    console.error("Error adding connection:", error);
    return false;
  }
};

export const updateConnection = async (updatedConn, token) => {
  try {
    const payload = {
      name: updatedConn.name,
      email: updatedConn.email,
      phone: updatedConn.phone,
      notes: updatedConn.notes,
    };
    return await putWithAuth(`/connections/${updatedConn.id}`, payload, token);
  } catch (error) {
    console.error("Error updating connection:", error);
    return false;
  }
};

export const deleteConnection = async (connectionId, token) => {
  try {
    await deleteWithAuth(`/connections/${connectionId}`, token);
    return true;
  } catch (error) {
    console.error("Error deleting connection:", error);
    return false;
  }
};

export const getConnectionDetails = async (connectionId, token) => {
  try {
    return await fetchWithAuth(`/connections/${connectionId}`, {}, token);
  } catch (error) {
    console.error("Error fetching connection details:", error);
    return null;
  }
};
