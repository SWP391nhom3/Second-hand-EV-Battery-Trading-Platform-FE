import { useState, useRef } from 'react'
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

/**
 * MessageInput Component
 * Input để nhập và gửi tin nhắn
 */
export default function MessageInput({ onSendMessage, disabled = false }) {
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const handleSend = () => {
    if (disabled) return
    
    // Nếu có file, gửi file
    if (file) {
      const messageType = file.type.startsWith('image/') ? 'IMAGE' : 'FILE'
      onSendMessage({
        content: content || file.name,
        messageType,
        file
      })
      setFile(null)
      setContent('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (imageInputRef.current) imageInputRef.current.value = ''
    } else if (content.trim()) {
      // Gửi text message
      onSendMessage({
        content: content.trim(),
        messageType: 'TEXT'
      })
      setContent('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (selectedFile.type.startsWith('image/')) {
        // Nếu là image, có thể hiển thị preview
      }
    }
  }

  const handleImageSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
    }
  }

  return (
    <div className="border-t bg-white p-4">
      {/* File preview */}
      {file && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 flex-1 truncate">
            {file.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
              if (imageInputRef.current) imageInputRef.current.value = ''
            }}
          >
            ✕
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* File upload buttons */}
        <div className="flex gap-1">
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
            title="Gửi hình ảnh"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title="Gửi file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        {/* Text input */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          disabled={disabled}
          className="min-h-[60px] max-h-[120px] resize-none"
          rows={2}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!content.trim() && !file)}
          size="icon"
          className="h-[60px] w-[60px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

