import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import messageService from '@/api/services/message.service'
import authService from '@/api/services/auth.service'
import { toast } from 'sonner'
import { Loader2, MessageSquare, User } from 'lucide-react'

const PAGE_SIZE = 20

const extractRooms = (response) => {
  if (!response) return []
  if (Array.isArray(response)) return response
  if (Array.isArray(response.items)) return response.items
  if (Array.isArray(response.data)) return response.data
  if (response.data && Array.isArray(response.data.items)) return response.data.items
  return []
}

const extractMessages = (response) => {
  if (!response) return []
  if (Array.isArray(response)) return response
  if (response.items && Array.isArray(response.items)) return response.items
  if (response.data && Array.isArray(response.data)) return response.data
  if (response.data && response.data.items && Array.isArray(response.data.items)) return response.data.items
  return []
}

/**
 * Component chat trực tiếp với người bán (không cần Staff)
 * Chỉ dành cho bài đăng Pin có package
 */
export default function SellerChatDialog({
  postId,
  postTitle,
  sellerName,
  open,
  onOpenChange
}) {
  const [room, setRoom] = useState(null)
  const [loadingRoom, setLoadingRoom] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messages, setMessages] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const resetState = useCallback(() => {
    setRoom(null)
    setMessages([])
    setPageNumber(1)
    setHasMore(false)
    setLoadingMessages(false)
    setSending(false)
    setError(null)
  }, [])

  const loadMessages = useCallback(
    async (roomId, page = 1, replace = false) => {
      if (!roomId) return

      try {
        setLoadingMessages(true)
        const response = await messageService.getChatHistory(roomId, {
          pageNumber: page,
          pageSize: PAGE_SIZE
        })

        if (!response.success) {
          toast.error(response.message || 'Không thể tải tin nhắn')
          return
        }

        const items = extractMessages(response.data || response)
        const reversed = items.slice().reverse()

        setMessages((prev) => (page === 1 || replace ? reversed : [...reversed, ...prev]))
        setHasMore(items.length === PAGE_SIZE)
        setPageNumber(page)
      } catch (err) {
        console.error('Error loading messages:', err)
        toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi tải tin nhắn')
      } finally {
        setLoadingMessages(false)
      }
    },
    []
  )

  const reloadRoom = useCallback(async () => {
    try {
      const roomsResponse = await messageService.getChatRooms({
        pageNumber: 1,
        pageSize: 50
      })

      if (!roomsResponse.success) return

      const rooms = extractRooms(roomsResponse.data || roomsResponse)
      const matchedRoom = rooms.find((item) =>
        item?.postId?.toString().toLowerCase() === postId?.toString().toLowerCase()
      )

      if (matchedRoom) {
        setRoom(matchedRoom)
        await loadMessages(matchedRoom.roomId, 1, true)
      }
    } catch (err) {
      console.error('Error reloading room:', err)
    }
  }, [postId, loadMessages])

  const handleSendMessage = useCallback(
    async (messageData) => {
      if (!authService.isAuthenticated()) {
        toast.error('Vui lòng đăng nhập để gửi tin nhắn')
        return
      }

      try {
        setSending(true)
        // Nếu chưa có room, gửi với postId để hệ thống tự động tạo room
        const payload = {
          ...messageData,
          roomId: room?.roomId,
          postId: room?.roomId ? undefined : postId
        }

        const response = await messageService.sendMessage(payload)

        if (!response.success || !response.data) {
          toast.error(response.message || 'Không thể gửi tin nhắn')
          return
        }

        const message = response.data

        // Thêm tin nhắn vào state ngay lập tức để hiển thị ngay
        setMessages((prev) => [...prev, message])

        // Nếu chưa có room, reload để lấy room mới tạo
        // Room sẽ được tạo tự động bởi backend khi gửi tin nhắn với postId
        if (!room) {
          // Đợi một chút để backend tạo room và lưu message
          await new Promise((resolve) => setTimeout(resolve, 800))
          await reloadRoom()
          // reloadRoom sẽ load messages từ server và replace toàn bộ (không duplicate)
        }
      } catch (err) {
        console.error('Error sending message:', err)
        toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi gửi tin nhắn')
      } finally {
        setSending(false)
      }
    },
    [postId, reloadRoom, room]
  )

  useEffect(() => {
    if (!open) {
      return
    }

    if (!postId) {
      setError('Không tìm thấy thông tin bài đăng để khởi tạo cuộc trò chuyện')
      return
    }

    const ensureRoom = async () => {
      try {
        setLoadingRoom(true)
        setError(null)

        const roomsResponse = await messageService.getChatRooms({
          pageNumber: 1,
          pageSize: 50
        })

        if (!roomsResponse.success) {
          setError(roomsResponse.message || 'Không thể tải thông tin cuộc trò chuyện')
          resetState()
          return
        }

        const rooms = extractRooms(roomsResponse.data || roomsResponse)
        const matchedRoom = rooms.find((item) =>
          item?.postId?.toString().toLowerCase() === postId?.toString().toLowerCase()
        )

        if (matchedRoom) {
          setRoom(matchedRoom)
          await loadMessages(matchedRoom.roomId, 1, true)
        } else {
          // Chưa có room, sẽ được tạo khi gửi tin nhắn đầu tiên
          resetState()
        }
      } catch (err) {
        console.error('Error loading chat room:', err)
        if (err.response?.status === 404) {
          resetState()
        } else {
          setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải cuộc trò chuyện')
        }
      } finally {
        setLoadingRoom(false)
      }
    }

    ensureRoom()
  }, [loadMessages, open, postId, resetState])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMessages && room?.roomId) {
      loadMessages(room.roomId, pageNumber + 1)
    }
  }, [hasMore, loadMessages, loadingMessages, pageNumber, room?.roomId])

  const displaySellerName = useMemo(() => {
    if (room?.sellerName) return room.sellerName
    if (sellerName) return sellerName
    return 'Người bán'
  }, [room?.sellerName, sellerName])

  const renderBody = () => {
    if (loadingRoom) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Đang tải phòng chat...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    // Nếu chưa có room, hiển thị hướng dẫn và cho phép gửi tin nhắn đầu tiên
    if (!room) {
      return (
        <div className="flex flex-col h-[60vh]">
          <Alert className="mb-4">
            <AlertTitle>Bắt đầu cuộc trò chuyện</AlertTitle>
            <AlertDescription>
              Gửi tin nhắn đầu tiên để bắt đầu trao đổi với người bán về sản phẩm này.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col flex-1 overflow-hidden rounded-lg border bg-background">
            <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
              <div>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Chưa có tin nhắn nào</p>
                <p className="text-xs mt-2">Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện</p>
              </div>
            </div>
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={sending}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-[60vh]">
        <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold">Chat với người bán</p>
              <p className="text-muted-foreground text-xs">{displaySellerName}</p>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex flex-col flex-1 overflow-hidden rounded-lg border bg-background">
          <MessageList
            messages={messages}
            loading={loadingMessages}
            onLoadMore={handleLoadMore}
          />
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={sending}
          />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) {
        resetState()
      }
      onOpenChange?.(value)
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chat với người bán</DialogTitle>
          <DialogDescription>
            Trao đổi trực tiếp với người bán về sản phẩm <strong>{postTitle}</strong>.
          </DialogDescription>
        </DialogHeader>

        {renderBody()}
      </DialogContent>
    </Dialog>
  )
}

