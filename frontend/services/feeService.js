import api, { BASE_URL } from "./api";

export const feeService = {
  list:       async (params = {}) => (await api.get("/fees", { params })).data,
  getById:    async (id) => (await api.get("/fees/" + id)).data,
  create:     async (payload) => (await api.post("/fees", payload)).data,
  bulkCreate: async (payload) => (await api.post("/fees/bulk", payload)).data,
  markPaid:   async (id, payload) => (await api.put("/fees/" + id + "/pay", payload)).data,
  update:     async (id, payload) => (await api.put("/fees/" + id, payload)).data,
  remove:     async (id) => (await api.delete("/fees/" + id)).data,
  analytics:  async () => (await api.get("/fees/analytics/summary")).data,
  receiptUrl: (id) => BASE_URL + "/fees/" + id + "/receipt",
};