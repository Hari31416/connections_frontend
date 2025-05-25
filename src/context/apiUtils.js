// API utility functions
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";
const HEALTH_CHECK_URL = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE.replace("/api", "")}/health`
  : "http://localhost:4000/health";

// Health check function to verify backend is ready
export const checkServerHealth = async () => {
  try {
    const response = await fetch(HEALTH_CHECK_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    const data = await response.json();
    return data.status === "OK";
  } catch (error) {
    console.log("Health check failed:", error.message);
    return false;
  }
};

export const fetchWithAuth = async (endpoint, options = {}, token) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  // Only add Authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Always try to parse the response body for error details
    const responseData = await response.json();

    if (!response.ok) {
      // If the backend sent an error message, use that; otherwise use a generic message
      const errorMessage =
        responseData.error ||
        `API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    // If it's already our custom error with backend message, just re-throw it
    if (error.message && !error.message.startsWith("API error:")) {
      throw error;
    }
    // For network errors or other issues, provide a generic message
    throw new Error(error.message || "Network error occurred");
  }
};

export const postWithAuth = async (endpoint, data, token) => {
  return fetchWithAuth(
    endpoint,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );
};

export const putWithAuth = async (endpoint, data, token) => {
  return fetchWithAuth(
    endpoint,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );
};

export const deleteWithAuth = async (endpoint, token) => {
  return fetchWithAuth(
    endpoint,
    {
      method: "DELETE",
    },
    token
  );
};

export const API = API_BASE;
