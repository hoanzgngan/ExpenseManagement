import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
});

// Tự động gắn token vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
