import axios from "axios";

const API_URL = "http://localhost:5000/api/community";

export const communityService = {
  // Get all posts with optional type filter
  getPosts: async (type?: string) => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { type },
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
      const response = await axios.get(`${API_URL}/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  // Get featured posts
  getFeaturedPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/featured`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/events`);
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      const response = await axios.put(`${API_URL}/posts/${postId}`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      const response = await axios.delete(`${API_URL}/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Like/unlike a post
  likePost: async (postId: string) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },
}; 