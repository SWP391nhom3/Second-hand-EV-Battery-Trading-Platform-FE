import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatRoomList from '@/components/member/chat/ChatRoomList'
import ChatRoom from '@/components/member/chat/ChatRoom'
import messageService from '@/api/services/message.service'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'
import { getImageUrl } from '@/utils/imageHelper'

/**
 * Chat Page
 * Trang chat cho Member
 */
export default function Chat() {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadChatRooms()
  }, [])

  const loadChatRooms = async (page = 1) => {
    try {
      setLoading(true)
      const response = await messageService.getChatRooms({
        pageNumber: page,
        pageSize: 20
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

        const pageRooms = normalizedRooms
        if (page === 1) {
          setRooms(pageRooms)
        } else {
          setRooms((prev) => [...prev, ...pageRooms])
        }
        setHasMore(pageRooms.length === 20)
        setPageNumber(page)
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error)
      toast.error('Không thể tải danh sách cuộc trò chuyện')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoom = async (roomId) => {
    try {
      const response = await messageService.getChatRoom(roomId)
      if (response.success && response.data) {
        const room = {
          ...response.data,
          postThumbnail: response.data.postThumbnail ? getImageUrl(response.data.postThumbnail) : null
        }
        setSelectedRoom(room)
      }
    } catch (error) {
      console.error('Error loading chat room:', error)
      toast.error('Không thể tải thông tin cuộc trò chuyện')
    }
  }

  const handleBack = () => {
    setSelectedRoom(null)
    // Reload rooms to update unread count
    loadChatRooms(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tin nhắn</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và trò chuyện với người bán, người mua và Staff
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Chat Room List - Hidden on mobile when room is selected */}
          <div className={`lg:col-span-1 ${selectedRoom ? 'hidden lg:block' : 'block'}`}>
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Cuộc trò chuyện</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatRoomList
                  rooms={rooms}
                  selectedRoomId={selectedRoom?.roomId}
                  onSelectRoom={handleSelectRoom}
                  loading={loading}
                />
              </div>
            </Card>
          </div>

          {/* Chat Room - Full width on mobile when selected */}
          <div className={`lg:col-span-2 ${selectedRoom ? 'block' : 'hidden lg:block'}`}>
            <Card className="h-full flex flex-col">
              {selectedRoom ? (
                <ChatRoom room={selectedRoom} onBack={handleBack} />
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Chọn một cuộc trò chuyện
                    </h3>
                    <p className="text-sm text-gray-500">
                      Chọn một cuộc trò chuyện từ danh sách để bắt đầu
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

