import api from "../configs/axios";

const postRequestService = {
  // GET /api/PostRequest - Get all post requests
  getPostRequests: async (params = {}) => {
    const response = await api.get("/api/PostRequest", { params });
    return response.data;
  },

  // POST /api/PostRequest - Create new post request
  createPostRequest: async (requestData) => {
    const response = await api.post("/api/PostRequest", requestData);
    return response.data;
  },

  // GET /api/PostRequest/{id} - Get post request by ID
  getPostRequestById: async (id) => {
    const response = await api.get(`/api/PostRequest/${id}`);
    return response.data;
  },

  // PUT /api/PostRequest/{id} - Update post request
  updatePostRequest: async (id, requestData) => {
    const response = await api.put(`/api/PostRequest/${id}`, requestData);
    return response.data;
  },

  // DELETE /api/PostRequest/{id} - Delete post request
  deletePostRequest: async (id) => {
    const response = await api.delete(`/api/PostRequest/${id}`);
    return response.data;
  },

  // GET /api/PostRequest/post/{postId} - Get requests for a post
  getRequestsByPost: async (postId) => {
    const response = await api.get(`/api/PostRequest/post/${postId}`);
    return response.data;
  },

  // GET /api/PostRequest/buyer/{buyerId} - Get requests by buyer
  getRequestsByBuyer: async (buyerId) => {
    const response = await api.get(`/api/PostRequest/buyer/${buyerId}`);
    return response.data;
  },

  // GET /api/PostRequest/status/{status} - Get requests by status
  getRequestsByStatus: async (status) => {
    const response = await api.get(`/api/PostRequest/status/${status}`);
    return response.data;
  },

  // PUT /api/PostRequest/{id}/status - Update request status
  updateRequestStatus: async (id, statusData) => {
    const response = await api.put(`/api/PostRequest/${id}/status`, statusData);
    return response.data;
  },

  // PUT /api/PostRequest/{id}/accept - Accept request
  acceptRequest: async (id) => {
    const response = await api.put(`/api/PostRequest/${id}/accept`);
    return response.data;
  },

  // PUT /api/PostRequest/{id}/reject - Reject request
  rejectRequest: async (id) => {
    const response = await api.put(`/api/PostRequest/${id}/reject`);
    return response.data;
  },

  // GET /api/PostRequest/statistics - Get request statistics
  getRequestStatistics: async () => {
    const response = await api.get("/api/PostRequest/statistics");
    return response.data;
  },

  // GET /api/PostRequest/negotiations/{postId} - Get negotiations for a post
  getNegotiationsByPost: async (postId) => {
    const response = await api.get(`/api/PostRequest/negotiations/${postId}`);
    return response.data;
  },
};

export default postRequestService;
