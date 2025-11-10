import { useState, useEffect } from 'react'
import ChatRoomList from './ChatRoomList'
import ChatWindow from './ChatWindow'
import staffChatService from '@/api/services/staffChat.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { getImageUrl } from '@/utils/imageHelper'

/**
 * ChatLayout Component
 * Layout: Sidebar (ChatRoomList) + Main (ChatWindow)
 * Responsive design
 */
export default function ChatLayout() {
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load chat rooms on mount
  useEffect(() => {
    loadChatRooms()
  }, [])

  const loadChatRooms = async () => {
    try {
      setLoading(true)
      const response = await staffChatService.getChatRooms({
        pageNumber: 1,
        pageSize: 50
      })

      if (response.success && response.data) {
        let roomsData = []
        if (Array.isArray(response.data)) {
          roomsData = response.data
        } else if (Array.isArray(response.data.data)) {
          roomsData = response.data.data
        } else if (Array.isArray(response.data.items)) {
          roomsData = response.data.items
        }

        const normalizedRooms = roomsData.map(room => ({
          ...room,
          postThumbnail: room.postThumbnail ? getImageUrl(room.postThumbnail) : null
        }))

        setRooms(normalizedRooms)
        
        // Auto select first room if available
        if (roomsData.length > 0 && !selectedRoomId) {
          const firstRoom = normalizedRooms[0]
          setSelectedRoomId(firstRoom.roomId)
          setSelectedRoom(firstRoom)
        }
      } else {
        toast.error(response.message || 'Không thể tải danh sách phòng chat')
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error)
      toast.error('Đã xảy ra lỗi khi tải danh sách phòng chat')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoom = async (roomId) => {
    if (roomId === selectedRoomId) return

    setSelectedRoomId(roomId)
    
    // Load room details
    try {
      const response = await staffChatService.getChatRoom(roomId)
      if (response.success && response.data) {
        const room = {
          ...response.data,
          postThumbnail: response.data.postThumbnail ? getImageUrl(response.data.postThumbnail) : null
        }
        setSelectedRoom(room)
      }
    } catch (error) {
      console.error('Error loading room details:', error)
      // Fallback to room from list
      const room = rooms.find(r => r.roomId === roomId)
      if (room) {
        setSelectedRoom(room)
      }
    }
  }

  const handleViewLead = (leadId) => {
    // Navigate to lead detail page
    window.open(`/staff/leads?leadId=${leadId}`, '_blank')
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gray-50 rounded-lg shadow overflow-hidden">
      {/* Sidebar - Chat Room List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tin nhắn</h2>
          <button
            onClick={loadChatRooms}
            className="text-sm text-blue-600 hover:text-blue-700"
            title="Làm mới"
          >
            🔄
          </button>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="p-2 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChatRoomList
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={handleSelectRoom}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Main - Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow 
          room={selectedRoom} 
          onViewLead={handleViewLead}
        />
      </div>
    </div>
  )
}


