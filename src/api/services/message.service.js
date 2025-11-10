import axiosInstance from '../axios.config'

/**
 * Message Service (Member)
 * Xử lý tất cả API calls liên quan đến Chat cho Member (UC35, UC36)
 */
class MessageService {
  /**
   * UC35: Gửi tin nhắn
   * @param {Object} data - MessageCreateRequest
   * @param {string} data.roomId - UUID của phòng chat (optional nếu có postId)
   * @param {string} data.postId - UUID của bài đăng (optional nếu có roomId)
   * @param {string} data.content - Nội dung tin nhắn (required cho TEXT)
   * @param {string} data.messageType - Loại tin nhắn (TEXT, IMAGE, FILE)
   * @param {File} data.file - File đính kèm (required cho IMAGE/FILE)
   * @returns {Promise<Object>} BaseResponse<MessageResponse>
   */
  async sendMessage(data) {
    const formData = new FormData()
    
    if (data.roomId) {
      formData.append('roomId', data.roomId)
    }
    if (data.postId) {
      formData.append('postId', data.postId)
    }
    if (data.content) {
      formData.append('content', data.content)
    }
    formData.append('messageType', data.messageType || 'TEXT')
    if (data.file) {
      formData.append('file', data.file)
    }

    const response = await axiosInstance.post('/chats/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  /**
   * UC36: Lấy lịch sử chat
   * @param {string} roomId - UUID của phòng chat
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 20)
   * @returns {Promise<Object>} PagedResponse<MessageResponse>
   */
  async getChatHistory(roomId, params = {}) {
    const response = await axiosInstance.get(`/chats/rooms/${roomId}/messages`, {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20
      }
    })
    return response.data
  }

  /**
   * Lấy danh sách phòng chat của Member
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Số trang (default: 1)
   * @param {number} params.pageSize - Số item mỗi trang (default: 20)
   * @returns {Promise<Object>} PagedResponse<ChatRoomResponse>
   */
  async getChatRooms(params = {}) {
    const response = await axiosInstance.get('/chats/rooms', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20
      }
    })
    return response.data
  }

  /**
   * Lấy thông tin chi tiết phòng chat
   * @param {string} roomId - UUID của phòng chat
   * @returns {Promise<Object>} BaseResponse<ChatRoomResponse>
   */
  async getChatRoom(roomId) {
    const response = await axiosInstance.get(`/chats/rooms/${roomId}`)
    return response.data
  }
}

export default new MessageService()

