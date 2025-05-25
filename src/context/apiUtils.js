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
    Authorization: token ? `Bearer ${token}` : "",
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
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
