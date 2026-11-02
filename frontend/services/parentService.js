import api from './api';

const childPath = (childId) => `/parent/children/${encodeURIComponent(childId)}`;

export const parentService = {
  getChildren: async () => (await api.get('/parent/children')).data.data,
  getSummary: async (childId) => (await api.get(`${childPath(childId)}/summary`)).data.data,
  getAttendance: async (childId, month) =>
    (await api.get(`${childPath(childId)}/attendance`, { params: month ? { month } : {} })).data.data,
  getResults: async (childId) => (await api.get(`${childPath(childId)}/results`)).data.data,
  getFees: async (childId) => (await api.get(`${childPath(childId)}/fees`)).data.data,
  getHomework: async (childId) => (await api.get(`${childPath(childId)}/homework`)).data.data,
  downloadReceipt: async (childId, feeId) =>
    (await api.get(`${childPath(childId)}/fees/${encodeURIComponent(feeId)}/receipt`, {
      responseType: 'blob',
    })).data,
};
