import { postWithAuth, fetchWithAuth } from "./apiUtils";

// Auth service functions
export const loginUser = async (email, password) => {
  try {
    const data = await postWithAuth("/login", { email, password });
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    // Return the specific error message from the backend
    return { error: error.message };
  }
};

export const registerUser = async (email, password, token) => {
  try {
    const data = await postWithAuth("/register", { email, password }, token);
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    // Return the specific error message from the backend
    return { error: error.message };
  }
};

// Check if any users exist in the system
export const checkUsersExist = async () => {
  try {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_BASE || "http://localhost:4000/api"
      }/users/exists`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { error: error.message };
  }
};

// Initialize first admin user
export const initializeFirstUser = async (email, password) => {
  try {
    const data = await postWithAuth("/initialize", { email, password });
    return data;
  } catch (error) {
    console.error("Initialization error:", error);
    return { error: error.message };
  }
};

// Function to decode JWT token and get user info
export const getUserFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.userId,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
