import api from "./api";

export const feeService = {
  // --- CRUD ---
  // GET /api/fees
  list: (params) => api.get("/fees", { params }).then(res => res.data),
  
  // GET /api/fees/:id
  getById: (id) => api.get(`/fees/${id}`).then(res => res.data),

  // POST /api/fees
  create: (payload) => api.post("/fees", payload).then(res => res.data),
  
  // POST /api/fees/bulk (Used for Generating Invoices)
  bulkCreate: (payload) => api.post("/fees/bulk", payload).then(res => res.data),
  
  // PUT /api/fees/:id
  update: (id, payload) => api.put(`/fees/${id}`, payload).then(res => res.data),

  // --- ACTIONS ---
  // PUT /api/fees/:id/pay
  markPaid: (id, payload) => api.put(`/fees/${id}/pay`, payload).then(res => res.data),
  
  // DELETE /api/fees/:id
  remove: (id) => api.delete(`/fees/${id}`).then(res => res.data),
  
  // GET /api/fees/:id/receipt (Opens PDF in new tab)
  receiptUrl: (id) => `${api.defaults.baseURL}/fees/${id}/receipt`,
  
  // --- ANALYTICS ---
  // GET /api/fees/analytics/summary
  getAnalytics: () => api.get("/fees/analytics/summary").then(res => res.data),
  
  // GET /api/fees/analytics/monthly
  getMonthlyAnalytics: () => api.get("/fees/analytics/monthly").then(res => res.data),
  
  // GET /api/fees/analytics/by-type
  getByTypeAnalytics: () => api.get("/fees/analytics/by-type").then(res => res.data),
};

export default feeService;