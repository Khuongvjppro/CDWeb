import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  getUsers: () => api.get("/auth/users"),
};

export const productAPI = {
  getAll: () => api.get("/products"),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/details/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default api;
