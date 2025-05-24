import {
  fetchWithAuth,
  postWithAuth,
  putWithAuth,
  deleteWithAuth,
} from "./apiUtils";

// Position service functions
export const fetchPositions = async (token) => {
  try {
    return await fetchWithAuth("/positions", {}, token);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return [];
  }
};

export const addPosition = async (newPos, token) => {
  try {
    return await postWithAuth("/positions", newPos, token);
  } catch (error) {
    console.error("Error adding position:", error);
    return false;
  }
};

export const updatePosition = async (updatedPos, token) => {
  try {
    const payload = {
      title: updatedPos.title,
      startDate: updatedPos.startDate,
      endDate: updatedPos.endDate,
      current: updatedPos.current,
      notes: updatedPos.notes,
    };
    return await putWithAuth(`/positions/${updatedPos.id}`, payload, token);
  } catch (error) {
    console.error("Error updating position:", error);
    return false;
  }
};

export const deletePosition = async (positionId, token) => {
  try {
    await deleteWithAuth(`/positions/${positionId}`, token);
    return true;
  } catch (error) {
    console.error("Error deleting position:", error);
    return false;
  }
};

export const getPositionsByConnection = async (connectionId, token) => {
  try {
    return await fetchWithAuth(
      `/positions/connection/${connectionId}`,
      {},
      token
    );
  } catch (error) {
    console.error("Error fetching positions by connection:", error);
    return [];
  }
};

export const getPositionsByCompany = async (companyId, token) => {
  try {
    return await fetchWithAuth(`/positions/company/${companyId}`, {}, token);
  } catch (error) {
    console.error("Error fetching positions by company:", error);
    return [];
  }
};
