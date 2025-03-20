import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  interests: string[];
  bookmarks: string[];
  contributions: string[];
  badges: string[];
  avatar?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
}

export interface Activity {
  id: string;
  type: 'bookmark' | 'comment' | 'share';
  item: string;
  date: string;
}

// Auth service
export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Dashboard service
export const dashboardService = {
  getUserProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateUserProfile: async (data: any) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/user/events');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/user/activities');
    return response.data;
  },

  addBookmark: async (itemId: string) => {
    const response = await api.post('/user/bookmarks', { itemId });
    return response.data;
  },

  removeBookmark: async (itemId: string) => {
    const response = await api.delete(`/user/bookmarks/${itemId}`);
    return response.data;
  },

  getBookmarks: async () => {
    const response = await api.get('/user/bookmarks');
    return response.data;
  },
}; 