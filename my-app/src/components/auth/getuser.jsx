import api from "../../api";

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/me");
    return response.data; // { username: "...", role: "..." }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};
