import api from "./api";

export const examService = {
  list: async (params = {}) => (await api.get("/exams", { params })).data,
  getById: async (id) => (await api.get(`/exams/${id}`)).data,
  create: async (payload) => (await api.post("/exams", payload)).data,
  update: async (id, payload) => (await api.put(`/exams/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/exams/${id}`)).data,
  publishResult: async (id, payload) => (await api.put(`/exams/${id}/result`, payload)).data,
};
