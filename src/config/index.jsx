import axios from "axios";
// 
// const API_BASE_URL = "http://192.168.0.113:3001"; // Replace 172.20.10.7 with your backend's IP address
// const API_BASE_URL = "http://localhost:3001"; // Replace 172.20.10.7 with your backend's IP address
const API_BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:3001"
  : "http://192.168.0.111:3001"; // Replace with your backend's IP address

// const API_BASE_URL = "https://sophonserver.onrender.com/";

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
