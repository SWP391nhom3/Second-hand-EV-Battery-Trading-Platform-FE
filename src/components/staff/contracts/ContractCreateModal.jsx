import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { contractCreateSchema } from '@/lib/validations/contract.validation'
import ContractTemplateSelector from './ContractTemplateSelector'
import ContractEditor from './ContractEditor'
import staffContractService from '@/api/services/staffContract.service'
import staffLeadService from '@/api/services/staffLead.service'
import { toast } from 'sonner'

/**
 * ContractCreateModal Component
 * Modal form để tạo hợp đồng từ mẫu (UC43)
 */
export default function ContractCreateModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templates, setTemplates] = useState([])
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [contractContent, setContractContent] = useState('')

  const form = useForm({
    resolver: zodResolver(contractCreateSchema),
    defaultValues: {
      leadId: '',
      contractTemplateId: 0,
      contractContent: ''
    }
  })

  // Load templates và leads khi modal mở
  useEffect(() => {
    if (isOpen) {
      loadTemplates()
      loadLeads()
      form.reset({
        leadId: '',
        contractTemplateId: 0,
        contractContent: ''
      })
      setSelectedTemplate(null)
      setSelectedLead(null)
      setContractContent('')
    }
  }, [isOpen])

  // Load templates
  const loadTemplates = async () => {
    try {
      const response = await staffContractService.getContractTemplates()
      if (response?.success && Array.isArray(response.data)) {
        const activeTemplates = response.data.filter(t => t.isActive)
        setTemplates(activeTemplates)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  // Load leads (chỉ các Lead đã chốt giao dịch - SUCCESSFUL)
  const loadLeads = async () => {
    try {
      setLoadingLeads(true)
      const response = await staffLeadService.getLeads({
        pageNumber: 1,
        pageSize: 100, // Load nhiều để có đủ lựa chọn
        status: 'SUCCESSFUL' // Chỉ lấy Lead đã chốt giao dịch
      })
      if (response?.success && response?.data?.data) {
        setLeads(response.data.data)
      }
    } catch (error) {
      console.error('Error loading leads:', error)
      toast.error('Không thể tải danh sách Leads')
    } finally {
      setLoadingLeads(false)
    }
  }

  // Helper function để format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return ''
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price)
    } catch (error) {
      return price.toString()
    }
  }

  // Helper function để replace placeholders
  const replacePlaceholders = (template, leadInfo) => {
    if (!template || !leadInfo) return template || ''
    
    let result = template
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
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), placeholders[key])
    })

    return result
  }

  // Lấy thông tin Lead từ chi tiết (đầy đủ hơn)
  const getLeadInfoFromDetail = (lead) => {
    if (!lead) return null
    
    // Debug: Log để xem cấu trúc dữ liệu
    console.log('Extracting lead info from:', {
      leadId: lead.leadId || lead.id,
      buyerName: lead.buyerName,
      sellerName: lead.sellerName,
      sellerId: lead.sellerId,
      postTitle: lead.postTitle,
      postPrice: lead.postPrice,
      finalPrice: lead.finalPrice,
      hasPost: !!lead.post,
      hasPostUser: !!lead.post?.user,
      postUserId: lead.post?.userId,
      postUserFullName: lead.post?.user?.fullName
    })
    
    return {
      leadId: lead.leadId || lead.id || lead.LeadId || '',
      // Buyer info - ưu tiên từ DTO response (camelCase), fallback về nested object
      buyerName: lead.buyerName || lead.BuyerName || lead.buyer?.fullName || lead.buyer?.FullName || lead.buyer?.email || lead.buyer?.Email || '',
      buyerEmail: lead.buyerEmail || lead.BuyerEmail || lead.buyer?.email || lead.buyer?.Email || '',
      buyerPhone: lead.buyerPhone || lead.BuyerPhone || lead.buyer?.phoneNumber || lead.buyer?.PhoneNumber || '',
      buyerAddress: lead.buyerAddress || lead.BuyerAddress || lead.buyer?.address || lead.buyer?.Address || '',
      // Seller info - ưu tiên từ DTO response (camelCase), fallback về nested object
      // Người bán là người tạo Post (Post.UserId = Post.User.Id)
      sellerName: lead.sellerName || lead.SellerName || lead.post?.user?.fullName || lead.post?.user?.FullName || lead.post?.user?.email || lead.post?.user?.Email || '',
      sellerEmail: lead.sellerEmail || lead.SellerEmail || lead.post?.user?.email || lead.post?.user?.Email || '',
      sellerPhone: lead.sellerPhone || lead.SellerPhone || lead.post?.user?.phoneNumber || lead.post?.user?.PhoneNumber || '',
      sellerAddress: lead.sellerAddress || lead.SellerAddress || lead.post?.user?.address || lead.post?.user?.Address || '',
      // Post info - ưu tiên từ DTO response (camelCase), fallback về nested object
      postTitle: lead.postTitle || lead.PostTitle || lead.post?.title || lead.post?.Title || '',
      postDescription: lead.postDescription || lead.PostDescription || lead.post?.description || lead.post?.Description || '',
      postBrand: lead.postBrand || lead.PostBrand || lead.post?.brand || lead.post?.Brand || '',
      postModel: lead.postModel || lead.PostModel || lead.post?.model || lead.post?.Model || '',
      postPrice: lead.postPrice || lead.PostPrice || lead.finalPrice || lead.FinalPrice || lead.post?.price || lead.post?.Price || 0
    }
  }

  // Khi chọn template
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    form.setValue('contractTemplateId', template.templateId)
    
    // Nếu đã chọn Lead, tự động fill content với thông tin Lead
    if (selectedLead) {
      const leadInfo = getLeadInfoFromDetail(selectedLead)
      if (leadInfo) {
        const newContent = replacePlaceholders(template.templateContent, leadInfo)
        setContractContent(newContent)
        form.setValue('contractContent', newContent)
        toast.success('Đã tự động điền thông tin Lead vào hợp đồng')
      } else {
        // Nếu không lấy được leadInfo, chỉ set template content
        setContractContent(template.templateContent)
        form.setValue('contractContent', template.templateContent)
      }
    } else {
      // Chưa chọn Lead, chỉ set template content
      setContractContent(template.templateContent)
      form.setValue('contractContent', template.templateContent)
    }
  }

  // Khi chọn lead - Load chi tiết Lead để có đầy đủ thông tin
  const handleSelectLead = async (leadId) => {
    form.setValue('leadId', leadId)
    
    // Tìm lead trong danh sách trước
    const leadFromList = leads.find(l => l.leadId === leadId)
    setSelectedLead(leadFromList)
    
    // Load chi tiết Lead từ API để có đầy đủ thông tin
    try {
      const response = await staffLeadService.getLeadById(leadId)
      if (response?.success && response.data) {
        const leadDetail = response.data
        console.log('Lead Detail Response:', leadDetail) // Debug log
        setSelectedLead(leadDetail)
        
        // Lấy thông tin Lead đầy đủ
        const leadInfo = getLeadInfoFromDetail(leadDetail)
        console.log('Lead Info Extracted:', leadInfo) // Debug log
        
        // Nếu đã chọn template, tự động fill lại content với thông tin Lead
        if (selectedTemplate && selectedTemplate.templateContent) {
          const newContent = replacePlaceholders(selectedTemplate.templateContent, leadInfo)
          setContractContent(newContent)
          form.setValue('contractContent', newContent)
          toast.success('Đã tự động điền thông tin Lead vào hợp đồng')
        } else if (contractContent) {
          // Nếu đã có content (từ template), fill thông tin Lead vào
          const newContent = replacePlaceholders(contractContent, leadInfo)
          setContractContent(newContent)
          form.setValue('contractContent', newContent)
          toast.success('Đã tự động điền thông tin Lead vào hợp đồng')
        }
      }
    } catch (error) {
      console.error('Error loading lead detail:', error)
      toast.error('Không thể tải chi tiết Lead. Vui lòng thử lại.')
      // Vẫn sử dụng lead từ danh sách nếu không load được chi tiết
    }
  }


  // Khi nội dung hợp đồng thay đổi
  const handleContentChange = (content) => {
    setContractContent(content)
    form.setValue('contractContent', content)
  }

  // Submit form
  const handleSubmit = async (data) => {
    if (!selectedTemplate) {
      toast.error('Vui lòng chọn mẫu hợp đồng')
      return
    }

    if (!data.leadId) {
      toast.error('Vui lòng chọn Lead')
      return
    }

    setIsSubmitting(true)
    try {
      const requestData = {
        leadId: data.leadId,
        contractTemplateId: data.contractTemplateId,
        contractContent: data.contractContent || undefined
      }

      const response = await staffContractService.createContract(requestData)
      
      if (response?.success) {
        toast.success('Tạo hợp đồng thành công!')
        form.reset()
        setSelectedTemplate(null)
        setSelectedLead(null)
        setContractContent('')
        onSubmit?.(response.data)
        onClose()
      } else {
        toast.error(response?.message || 'Không thể tạo hợp đồng')
      }
    } catch (error) {
      console.error('Error creating contract:', error)
      toast.error('Có lỗi xảy ra khi tạo hợp đồng')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lấy thông tin Lead để điền vào hợp đồng (từ danh sách)
  const getLeadInfo = () => {
    if (!selectedLead) return null
    return getLeadInfoFromDetail(selectedLead)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo hợp đồng mới</DialogTitle>
          <DialogDescription>
            Tạo hợp đồng từ mẫu cho Lead đã chốt giao dịch
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Chọn Lead */}
            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleSelectLead(value)
                    }}
                    value={field.value}
                    disabled={loadingLeads || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Lead đã chốt giao dịch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingLeads ? (
                        <SelectItem value="loading" disabled>
                          Đang tải...
                        </SelectItem>
                      ) : leads.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Không có Lead nào đã chốt giao dịch
                        </SelectItem>
                      ) : (
                        leads.map((lead) => (
                          <SelectItem key={lead.leadId} value={lead.leadId}>
                            {lead.postTitle || 'Lead'} - {lead.buyerName || 'N/A'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Chọn Lead đã chốt giao dịch (status: SUCCESSFUL) để tạo hợp đồng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chọn Template */}
            <FormField
              control={form.control}
              name="contractTemplateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mẫu hợp đồng *</FormLabel>
                  <FormControl>
                    <ContractTemplateSelector
                      selectedTemplateId={field.value}
                      onSelectTemplate={handleSelectTemplate}
                    />
                  </FormControl>
                  <FormDescription>
                    Chọn mẫu hợp đồng bạn muốn sử dụng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Editor nội dung hợp đồng */}
            {selectedTemplate && (
              <FormField
                control={form.control}
                name="contractContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung hợp đồng *</FormLabel>
                    <FormControl>
                      <ContractEditor
                        templateContent={selectedTemplate.templateContent}
                        contractContent={contractContent}
                        onChange={handleContentChange}
                        leadInfo={getLeadInfo()}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {selectedLead 
                        ? 'Nội dung hợp đồng đã được tự động điền từ mẫu và thông tin Lead. Bạn có thể chỉnh sửa nếu cần.'
                        : 'Nội dung hợp đồng đã được tự động điền từ mẫu. Vui lòng chọn Lead để tự động điền thông tin người mua, người bán và sản phẩm.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Thông báo khi chưa chọn Lead */}
            {selectedTemplate && !selectedLead && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Lưu ý:</strong> Vui lòng chọn Lead để tự động điền thông tin người mua, người bán và sản phẩm vào hợp đồng.
                </p>
              </div>
            )}
            
            {/* Hiển thị thông tin Lead đã chọn */}
            {selectedLead && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  ✅ Đã chọn Lead: {selectedLead.postTitle || selectedLead.leadId}
                </p>
                <div className="text-xs text-green-700 space-y-1">
                  <p><strong>Người mua:</strong> {getLeadInfo()?.buyerName || 'N/A'}</p>
                  <p><strong>Người bán:</strong> {getLeadInfo()?.sellerName || 'N/A'}</p>
                  <p><strong>Sản phẩm:</strong> {getLeadInfo()?.postTitle || 'N/A'} - {getLeadInfo()?.postBrand || ''} {getLeadInfo()?.postModel || ''}</p>
                  <p><strong>Giá:</strong> {getLeadInfo()?.postPrice ? formatPrice(getLeadInfo().postPrice) : 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedTemplate || !selectedLead}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo hợp đồng
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

