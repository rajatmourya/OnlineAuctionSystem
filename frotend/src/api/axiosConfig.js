import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      try {
        const user = JSON.parse(loggedUser);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing loggedUser from localStorage', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear localStorage and redirect to login
      localStorage.removeItem('loggedUser');
      localStorage.removeItem('role');
      window.location.href = '/user-login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
