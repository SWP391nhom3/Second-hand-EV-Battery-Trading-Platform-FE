import api from "../configs/axios";

const memberService = {
  // GET /api/Member - Get all members
  getMembers: async (params = {}) => {
    const response = await api.get("/api/Member", { params });
    return response.data;
  },

  // POST /api/Member - Create new member
  createMember: async (memberData) => {
    const response = await api.post("/api/Member", memberData);
    return response.data;
  },

  // GET /api/Member/{id} - Get member by ID
  getMemberById: async (id) => {
    const response = await api.get(`/api/Member/${id}`);
    return response.data;
  },

  // PUT /api/Member/{id} - Update member
  updateMember: async (id, memberData) => {
    const response = await api.put(`/api/Member/${id}`, memberData);
    return response.data;
  },

  // DELETE /api/Member/{id} - Delete member
  deleteMember: async (id) => {
    const response = await api.delete(`/api/Member/${id}`);
    return response.data;
  },

  // GET /api/Member/top-rated - Get top-rated members
  getTopRatedMembers: async () => {
    const response = await api.get("/api/Member/top-rated");
    return response.data;
  },
};

export default memberService;
