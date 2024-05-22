import axios from "axios";
// 
// const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://sophonserver.onrender.com/";
// const API_BASE_URL = "https://sophon-server.vercel.app/";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to include token with every request
instance.interceptors.request.use(
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

export default instance;
