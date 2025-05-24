import { postWithAuth } from "./apiUtils";

// Auth service functions
export const loginUser = async (email, password) => {
  try {
    const data = await postWithAuth("/login", { email, password });
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Authentication failed" };
  }
};

export const registerUser = async (email, password) => {
  try {
    const data = await postWithAuth("/register", { email, password });
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed" };
  }
};
