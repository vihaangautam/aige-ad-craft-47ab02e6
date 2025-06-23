import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access', access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/token/`, {
      username,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access');
  },

  getToken: () => {
    return localStorage.getItem('access');
  },
};

export const scenesAPI = {
  list: () => apiClient.get('/scenes/'),
  create: (data: any) => apiClient.post('/scenes/', data),
  update: (id: string, data: any) => apiClient.patch(`/scenes/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/scenes/${id}/`),
};

export const configsAPI = {
  list: () => apiClient.get('/configs/'),
  create: (data: any) => apiClient.post('/configs/', data),
};

export const scriptAPI = {
  generate: (config: any, flow: any) => 
    apiClient.post('/generate-script/', { config, flow }),
};

export default apiClient;