import api from "@/services/api";

export const noticeService = {
  // GET /api/notices — with targetAudience filter
  getNotices: async (targetAudience = ["Students", "All"]) => {
    try {
      const response = await api.get("/notices", {
        params: { 
          targetAudience: Array.isArray(targetAudience) ? targetAudience.join(",") : targetAudience 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notices:", error);
      throw error.response?.data || { message: "Failed to fetch notices." };
    }
  },
};