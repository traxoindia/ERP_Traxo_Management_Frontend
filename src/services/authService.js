import api from "./api";


export const login = async (email, password) => {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const register = async (email, password, roles) => {
  const response = await api.post("/api/auth/register", {
    email,
    password,
    roles,
  });

  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/api/auth/refresh", {
    refreshToken,
  });

  return response.data;
};