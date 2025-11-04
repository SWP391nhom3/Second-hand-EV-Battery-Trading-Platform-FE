import api from "../configs/axios";

const postService = {
  // GET /api/Post - Get all posts with pagination and filters
  getPosts: async (params = {}) => {
    const response = await api.get("/api/Post", { params });
    return response.data;
  },

  // POST /api/Post - Create new post
  createPost: async (postData) => {
    const response = await api.post("/api/Post", postData);
    return response.data;
  },

  // GET /api/Post/{id} - Get post by ID
  getPostById: async (id) => {
    const response = await api.get(`/api/Post/${id}`);
    return response.data;
  },

  // PUT /api/Post/{id} - Update post
  updatePost: async (id, postData) => {
    const response = await api.put(`/api/Post/${id}`, postData);
    return response.data;
  },

  // DELETE /api/Post/{id} - Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/api/Post/${id}`);
    return response.data;
  },

  // GET /api/Post/member/{memberId} - Get posts by member
  getPostsByMember: async (memberId) => {
    const response = await api.get(`/api/Post/member/${memberId}`);
    return response.data;
  },

  // PUT /api/Post/{postId}/assign-staff/{staffId} - Assign staff to post
  assignStaff: async (postId, staffId) => {
    const response = await api.put(`/api/Post/${postId}/assign-staff/${staffId}`);
    return response.data;
  },

  // GET /api/Post/featured - Get featured posts
  getFeaturedPosts: async () => {
    const response = await api.get("/api/Post/featured");
    return response.data;
  },

  // GET /api/Post/direct - Get direct transaction posts
  getDirectPosts: async () => {
    const response = await api.get("/api/Post/direct");
    return response.data;
  },

  // GET /api/Post/staff-assisted - Get staff-assisted posts
  getStaffAssistedPosts: async () => {
    const response = await api.get("/api/Post/staff-assisted");
    return response.data;
  },
};

export default postService;
