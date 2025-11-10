import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText, Check } from 'lucide-react'
import staffContractService from '@/api/services/staffContract.service'
import { toast } from 'sonner'

/**
 * ContractTemplateSelector Component
 * Component hiển thị danh sách mẫu hợp đồng và cho phép chọn
 */
export default function ContractTemplateSelector({ 
  selectedTemplateId, 
  onSelectTemplate,
  categoryId 
}) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [categoryId])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await staffContractService.getContractTemplates({ categoryId })
      if (response?.success && Array.isArray(response.data)) {
        // Chỉ hiển thị templates đang active
        const activeTemplates = response.data.filter(t => t.isActive)
        setTemplates(activeTemplates)
      } else {
        toast.error('Không thể tải danh sách mẫu hợp đồng')
      }
    } catch (error) {
      console.error('Error loading contract templates:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách mẫu hợp đồng')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Đang tải mẫu hợp đồng...</span>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-500">Không có mẫu hợp đồng nào</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.templateId}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedTemplateId === template.templateId
              ? 'ring-2 ring-blue-500 border-blue-500'
              : ''
          }`}
          onClick={() => onSelectTemplate(template)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{template.templateName}</CardTitle>
                {template.categoryName && (
                  <CardDescription className="mt-1">
                    {template.categoryName}
                  </CardDescription>
                )}
              </div>
              {selectedTemplateId === template.templateId && (
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={template.isActive ? 'default' : 'secondary'}>
                {template.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
              <Button
                variant={selectedTemplateId === template.templateId ? 'default' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectTemplate(template)
                }}
              >
                {selectedTemplateId === template.templateId ? 'Đã chọn' : 'Chọn mẫu'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


