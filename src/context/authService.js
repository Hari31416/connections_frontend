import { postWithAuth } from "./apiUtils";

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

export const registerUser = async (email, password) => {
  try {
    const data = await postWithAuth("/register", { email, password });
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    // Return the specific error message from the backend
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
