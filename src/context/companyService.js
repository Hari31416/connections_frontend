import {
  fetchWithAuth,
  postWithAuth,
  putWithAuth,
  deleteWithAuth,
} from "./apiUtils";

// Company service functions
export const fetchCompanies = async (token) => {
  try {
    return await fetchWithAuth("/companies", {}, token);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

export const addCompany = async (newComp, token) => {
  try {
    return await postWithAuth("/companies", newComp, token);
  } catch (error) {
    console.error("Error adding company:", error);
    return false;
  }
};

export const updateCompany = async (updatedComp, token) => {
  try {
    const payload = {
      name: updatedComp.name,
      industry: updatedComp.industry,
      website: updatedComp.website,
    };
    return await putWithAuth(`/companies/${updatedComp.id}`, payload, token);
  } catch (error) {
    console.error("Error updating company:", error);
    return false;
  }
};

export const deleteCompany = async (companyId, token) => {
  try {
    await deleteWithAuth(`/companies/${companyId}`, token);
    return true;
  } catch (error) {
    console.error("Error deleting company:", error);
    return false;
  }
};

export const getCompanyDetails = async (companyId, token) => {
  try {
    return await fetchWithAuth(`/companies/${companyId}`, {}, token);
  } catch (error) {
    console.error("Error fetching company details:", error);
    return null;
  }
};

export const getCompaniesByConnection = async (connectionId, token) => {
  try {
    return await fetchWithAuth(
      `/companies/byconnection/${connectionId}`,
      {},
      token
    );
  } catch (error) {
    console.error("Error fetching companies by connection:", error);
    return [];
  }
};

export const searchCompanies = async (query, token) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return await fetchWithAuth(
      `/companies/search/${encodeURIComponent(query)}`,
      {},
      token
    );
  } catch (error) {
    console.error("Error searching companies:", error);
    return [];
  }
};
