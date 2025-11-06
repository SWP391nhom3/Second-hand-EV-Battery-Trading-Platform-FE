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

  // ===== ADMIN ENDPOINTS =====
  // GET /api/post/admin/pending - Get pending posts for admin
  getAdminPendingPosts: async () => {
    const response = await api.get("/api/post/admin/pending");
    return response.data;
  },

  // GET /api/post/admin/all?status=PENDING - Get all posts with filters for admin
  getAdminAllPosts: async (params = {}) => {
    const response = await api.get("/api/post/admin/all", { params });
    return response.data;
  },

  // PATCH /api/post/admin/{id}/approve - Approve post with optional packageId
  approvePost: async (id, packageId = null) => {
    const body = packageId ? { packageId } : {};
    const response = await api.patch(`/api/post/admin/${id}/approve`, body);
    return response.data;
  },

  // PATCH /api/post/admin/{id}/reject - Reject post
  rejectPost: async (id) => {
    const response = await api.patch(`/api/post/admin/${id}/reject`);
    return response.data;
  },
};

export default postService;
