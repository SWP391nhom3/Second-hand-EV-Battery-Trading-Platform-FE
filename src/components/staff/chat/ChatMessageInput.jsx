import { useState, useRef } from 'react'
import { Send, Image as ImageIcon, Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

/**
 * ChatMessageInput Component
 * Input để nhập và gửi tin nhắn
 */
export default function ChatMessageInput({ 
  roomId, 
  onSendMessage, 
  disabled = false 
}) {
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [messageType, setMessageType] = useState('TEXT')
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Kiểm tra kích thước file (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('File không được vượt quá 10MB')
      return
    }

    // Xác định loại tin nhắn
    if (file.type.startsWith('image/')) {
      setMessageType('IMAGE')
      setSelectedFile(file)
      setContent('') // Clear text content
    } else {
      setMessageType('FILE')
      setSelectedFile(file)
      setContent(file.name) // Set file name as content
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setMessageType('TEXT')
    setContent('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    if (disabled || !roomId) return

    // Validate
    if (messageType === 'TEXT' && !content.trim()) {
      toast.error('Vui lòng nhập nội dung tin nhắn')
      return
    }

    if ((messageType === 'IMAGE' || messageType === 'FILE') && !selectedFile) {
      toast.error('Vui lòng chọn file')
      return
    }

    try {
      await onSendMessage({
        roomId,
        content: messageType === 'TEXT' ? content : (messageType === 'FILE' ? selectedFile.name : ''),
        messageType,
        file: selectedFile
      })

      // Reset form
      setContent('')
      setSelectedFile(null)
      setMessageType('TEXT')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyDown = (e) => {
    // Enter để gửi, Shift+Enter để xuống dòng
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e) => {
    setContent(e.target.value)
    // Auto resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          {messageType === 'IMAGE' ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <Paperclip className="h-5 w-5 text-gray-600" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* File Upload Buttons */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || messageType === 'IMAGE'}
            title="Gửi hình ảnh"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || messageType === 'FILE'}
            title="Gửi file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleFileSelect}
        />

        {/* Text Input */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              messageType === 'TEXT'
                ? 'Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)'
                : 'Nhập mô tả (tùy chọn)...'
            }
            disabled={disabled || messageType !== 'TEXT'}
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (messageType === 'TEXT' && !content.trim()) || (messageType !== 'TEXT' && !selectedFile)}
          size="icon"
          className="h-9 w-9"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


