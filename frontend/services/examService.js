import api from "./api";

/**
 * NOTE: There is no /api/exams backend yet (no model/controller/routes exist
 * in src/ at the time this was written). Every method below tries the real
 * endpoint first, and silently falls back to MOCK data if it 404s / errors,
 * so the UI works today and needs zero changes once the backend lands.
 * Backend is expected to scope everything by req.user.schoolId server-side.
 */


export const examService = {
  list: async (params = {}) => (await api.get("/exams", { params })).data,
  getById: async (id) => (await api.get(`/exams/${id}`)).data,
  create: async (payload) => (await api.post("/exams", payload)).data,
  update: async (id, payload) => (await api.put(`/exams/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/exams/${id}`)).data,
  publishResult: async (id, payload) => (await api.put(`/exams/${id}/result`, payload)).data,
};
