import axios from "axios";

const api = axios.create({
  baseURL: "http://3.237.41.244:8080",
});

// Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;