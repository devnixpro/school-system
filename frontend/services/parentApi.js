import axios from "axios";

const parentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Automatically attach JWT token
parentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("devnixedu-parent-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired sessions
parentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("devnixedu-parent-token");
      localStorage.removeItem("devnixedu-parent-user");
    }

    return Promise.reject(error);
  }
);

const getData = (response) => {
  const body = response.data;

  if (body.success === false) {
    throw new Error(body.message || "Request failed");
  }

  return body.data ?? body;
};

// Authentication
export const parentAuth = {
  async login(email, password) {
    const response = await parentApi.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    const body = response.data;

    if (!body.success || !body.token || !body.data) {
      throw new Error(body.message || "Login failed");
    }

    if (body.data.role !== "parent") {
      throw new Error("This account is not a parent account.");
    }

    localStorage.setItem("devnixedu-parent-token", body.token);
    localStorage.setItem(
      "devnixedu-parent-user",
      JSON.stringify(body.data)
    );

    return body.data;
  },

  async me() {
    const user = getData(await parentApi.get("/auth/me"));

    if (user.role !== "parent") {
      throw new Error("This account is not a parent account.");
    }

    return user;
  },

  logout() {
    localStorage.removeItem("devnixedu-parent-token");
    localStorage.removeItem("devnixedu-parent-user");
  },
};

// Parent dashboard APIs
export const parentData = {
  async children() {
    const data = getData(await parentApi.get("/parent/children"));
    return Array.isArray(data) ? data : [];
  },

  async summary(childId) {
    return getData(
      await parentApi.get(`/parent/children/${childId}/summary`)
    );
  },

  async attendance(childId, month) {
    const response = await parentApi.get(
      `/parent/children/${childId}/attendance`,
      month ? { params: { month } } : {}
    );

    return getData(response);
  },

  async fees(childId) {
    return getData(
      await parentApi.get(`/parent/children/${childId}/fees`)
    );
  },

  async results(childId) {
    return getData(
      await parentApi.get(`/parent/children/${childId}/results`)
    );
  },

  async homework(childId) {
    return getData(
      await parentApi.get(`/parent/children/${childId}/homework`)
    );
  },

  async timetable(child) {
    const response = await parentApi.get("/timetable", {
      params: {
        className: child.className || child.class || child.classId,
        section: child.section,
      },
    });

    return getData(response);
  },

  async notices() {
    return getData(
      await parentApi.get("/notices", {
        params: { targetAudience: "Parents" },
      })
    );
  },
};

export default parentApi;