import ChatLayout from '@/components/staff/chat/ChatLayout'

/**
 * Chat Page for Staff
 * UC35: Gửi Tin nhắn
 * UC36: Xem Lịch sử Chat
 */
export default function Chat() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chat với Buyer và Seller trong phòng chat 3 người
        </p>
      </div>

      {/* Chat Layout */}
      <ChatLayout />
    </div>
  )
}


