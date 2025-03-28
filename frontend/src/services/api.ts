import axios from 'axios';
import { featuredItems } from '@/components/FeaturedSection';

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
  token?: string;
  user: {
    id: string;
    username: string;
    email: string;
    isVerified: boolean;
  };
  needsVerification?: boolean;
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
  posts?: Post[];
  isVerified: boolean;
}

export interface Post {
  _id?: string;  // MongoDB ID
  id?: string;   // Frontend ID
  title: string;
  content: string;
  contentType: 'story' | 'blog' | 'photo' | 'event';
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  featured: boolean;
  images?: string[];
  location?: string;
  eventDate?: string;
}

export interface NewPost {
  title: string;
  content: string;
  contentType: 'story' | 'blog' | 'photo' | 'event';
  location?: string;
  eventDate?: string;
  images?: File[];
}

export interface Event {
  id: string;
  _id?: string; // MongoDB ID from backend
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
  createdBy?: string;
}

export interface NewEvent {
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
    // Note: No token is stored here - user must verify email first
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

  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
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

  getEventById: async (eventId: string) => {
    const response = await api.get(`/user/events/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData: NewEvent) => {
    const response = await api.post('/user/events', eventData);
    return response.data;
  },

  updateEvent: async (eventId: string, eventData: Partial<NewEvent>) => {
    console.log('Sending update request for event ID:', eventId, 'with data:', eventData);
    try {
      const response = await api.put(`/user/events/${eventId}`, eventData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error updating event:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId: string) => {
    console.log('Sending delete request for event ID:', eventId);
    try {
      const response = await api.delete(`/user/events/${eventId}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error deleting event:', error);
      throw error;
    }
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

// Heritage service for cultural items
export const heritageService = {
  // Get featured items
  getFeaturedItems: async () => {
    // This would fetch from an API in a real app
    // For now we're using the local data
    return featuredItems;
  },

  // Get item details by ID
  getItemById: async (itemId: string) => {
    // This would be an API call in a real implementation
    const item = featuredItems.find(item => item.title === itemId);
    return item;
  },

  // Get bookmarked items with details
  getBookmarkedItems: async () => {
    try {
      // Get user's bookmarks
      const bookmarkIds = await dashboardService.getBookmarks();

      // Get details for each bookmark
      const bookmarkedItems = [];
      for (const id of bookmarkIds) {
        const item = await heritageService.getItemById(id);
        if (item) {
          bookmarkedItems.push(item);
        }
      }

      return bookmarkedItems;
    } catch (error) {
      console.error('Error fetching bookmarked items:', error);
      throw error;
    }
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };
};

// Community service
export const communityService = {
  // Get all posts with optional type filter
  getPosts: async (type?: string) => {
    try {
      const response = await axios.get(`${API_URL}/community/posts`, {
        params: { type },
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Get a single post by ID
  getPost: async (postId: string) => {
    try {
      const response = await axios.get(`${API_URL}/community/posts/${postId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  // Get featured posts
  getFeaturedPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/community/posts/featured`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/community/posts/events`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/community/posts`, postData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update a post
  updatePost: async (postId: string, postData: FormData) => {
    try {
      const response = await axios.put(`${API_URL}/community/posts/${postId}`, postData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await axios.delete(`${API_URL}/community/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error deleting post:", error);
      if (error.response?.status === 401) {
        throw new Error('Please log in to delete posts');
      }
      if (error.response?.status === 403) {
        throw new Error('You are not authorized to delete this post');
      }
      if (error.response?.status === 404) {
        throw new Error('Post not found');
      }
      throw error;
    }
  },

  // Like/unlike a post
  likePost: async (postId: string) => {
    try {
      const response = await axios.post(`${API_URL}/community/posts/${postId}/like`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },
}; 