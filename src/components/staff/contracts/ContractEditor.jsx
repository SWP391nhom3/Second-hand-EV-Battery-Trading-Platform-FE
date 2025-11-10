import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Edit } from 'lucide-react'

/**
 * ContractEditor Component
 * Component để chỉnh sửa nội dung hợp đồng
 * Tự động điền thông tin từ Template và cho phép chỉnh sửa
 */
export default function ContractEditor({
  templateContent,
  contractContent,
  onChange,
  leadInfo,
  disabled = false
}) {
  const [content, setContent] = useState(contractContent || templateContent || '')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Nếu có contractContent từ parent, luôn ưu tiên sử dụng nó (đã được fill sẵn)
    // Đây là content đã được fill từ parent với thông tin Lead
    if (contractContent) {
      if (contractContent !== content) {
        setContent(contractContent)
      }
      return
    }
    
    // Nếu có templateContent và chưa có contractContent, tạo content mới
    if (templateContent) {
      let newContent = templateContent
      
      // Thay thế placeholders nếu có leadInfo
      if (leadInfo) {
        newContent = replacePlaceholders(newContent, leadInfo)
      }
      
      if (newContent !== content) {
        setContent(newContent)
        onChange?.(newContent)
      }
    }
  }, [templateContent, contractContent, leadInfo, content, onChange])

  const replacePlaceholders = (text, leadInfo) => {
    if (!text || !leadInfo) return text || ''
    
    let result = text
    // Thay thế các placeholders - hỗ trợ cả format {BuyerName} và {{BUYER_NAME}}
    const placeholders = {
      // Format {BuyerName}
      '{BuyerName}': leadInfo.buyerName || '',
      '{BuyerEmail}': leadInfo.buyerEmail || '',
      '{BuyerPhone}': leadInfo.buyerPhone || '',
      '{BuyerAddress}': leadInfo.buyerAddress || '',
      '{SellerName}': leadInfo.sellerName || '',
      '{SellerEmail}': leadInfo.sellerEmail || '',
      '{SellerPhone}': leadInfo.sellerPhone || '',
      '{SellerAddress}': leadInfo.sellerAddress || '',
      '{PostTitle}': leadInfo.postTitle || '',
      '{PostDescription}': leadInfo.postDescription || '',
      '{PostBrand}': leadInfo.postBrand || '',
      '{PostModel}': leadInfo.postModel || '',
      '{PostPrice}': leadInfo.postPrice ? formatPrice(leadInfo.postPrice) : '',
      '{LeadId}': leadInfo.leadId || '',
      '{Date}': new Date().toLocaleDateString('vi-VN'),
      // Format {{BUYER_NAME}} (backend format)
      '{{BUYER_NAME}}': leadInfo.buyerName || '',
      '{{BUYER_EMAIL}}': leadInfo.buyerEmail || '',
      '{{BUYER_PHONE}}': leadInfo.buyerPhone || '',
      '{{BUYER_ADDRESS}}': leadInfo.buyerAddress || '',
      '{{SELLER_NAME}}': leadInfo.sellerName || '',
      '{{SELLER_EMAIL}}': leadInfo.sellerEmail || '',
      '{{SELLER_PHONE}}': leadInfo.sellerPhone || '',
      '{{SELLER_ADDRESS}}': leadInfo.sellerAddress || '',
      '{{PRODUCT_TITLE}}': leadInfo.postTitle || '',
      '{{PRODUCT_DESCRIPTION}}': leadInfo.postDescription || '',
      '{{PRODUCT_BRAND}}': leadInfo.postBrand || '',
      '{{PRODUCT_MODEL}}': leadInfo.postModel || '',
      '{{PRODUCT_PRICE}}': leadInfo.postPrice ? leadInfo.postPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
      '{{CONTRACT_DATE}}': new Date().toLocaleDateString('vi-VN')
    }

    Object.keys(placeholders).forEach(key => {
      // Escape special regex characters
      const escapedKey = key.replace(/[{}]/g, '\\$&')
      result = result.replace(new RegExp(escapedKey, 'g'), placeholders[key])
    })

    return result
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return ''
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    } catch (error) {
      return price
    }
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange?.(newContent)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nội dung hợp đồng</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Xem trước
              </>
            )}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Xem trước hợp đồng</CardTitle>
            <CardDescription>
              Nội dung hợp đồng sẽ được hiển thị như thế này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none whitespace-pre-wrap">
              {content || 'Chưa có nội dung'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Textarea
          value={content}
          onChange={handleContentChange}
          disabled={disabled}
          placeholder="Nội dung hợp đồng sẽ được tự động điền từ mẫu. Bạn có thể chỉnh sửa nội dung tại đây."
          className="min-h-[400px] font-mono text-sm"
          rows={20}
        />
      )}

      <div className="text-sm text-gray-500">
        <p>💡 Mẹo: Bạn có thể chỉnh sửa nội dung hợp đồng. Các placeholders như {'{BuyerName}'}, {'{SellerName}'} đã được tự động thay thế.</p>
      </div>
    </div>
  )
}

