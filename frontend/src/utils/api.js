import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  getUsers: () => api.get("/auth/users"),
};

export const productAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  search: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getAll: () => api.get("/orders"),
  getUserOrders: () => api.get("/orders/user"),
  getById: (id) => api.get(`/orders/details/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const aiAPI = {
  chat: (message, history) => api.post("/ai/chat", { message, history }),
};

export default api;
