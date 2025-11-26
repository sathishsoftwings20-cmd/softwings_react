import axios from "axios";

export const API = axios.create({
  baseURL: "https://softwings-backend.onrender.com/", // your Render backend
  // withCredentials: true, // uncomment if you use cookies for auth
});

// 🔐 Auto attach token for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
