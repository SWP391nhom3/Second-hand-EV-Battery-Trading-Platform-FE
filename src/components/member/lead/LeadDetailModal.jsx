import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Loader2,
  Eye,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import leadService from '@/api/services/lead.service';
import { toast } from 'sonner';

/**
 * LeadDetailModal Component
 * Hiển thị chi tiết Lead cho Member
 * 
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onOpenChange - Handle open change
 * @param {string} props.leadId - Lead ID
 */
export default function LeadDetailModal({ open, onOpenChange, leadId }) {
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState(null);

  useEffect(() => {
    if (open && leadId) {
      fetchLeadDetail();
    }
  }, [open, leadId]);

  const fetchLeadDetail = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(leadId);
      
      if (response.success) {
        setLead(response.data);
      } else {
        toast.error(response.message || 'Không thể tải chi tiết Lead');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error fetching lead detail:', error);
      toast.error('Có lỗi xảy ra khi tải chi tiết Lead');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: { label: 'Mới', variant: 'default', icon: Clock },
      ASSIGNED: { label: 'Đã gán Staff', variant: 'secondary', icon: User },
      CONTACTED: { label: 'Đã liên hệ', variant: 'secondary', icon: MessageSquare },
      SCHEDULED: { label: 'Đã đặt lịch', variant: 'default', icon: Calendar },
      SUCCESSFUL: { label: 'Thành công', variant: 'default', className: 'bg-green-500 text-white', icon: CheckCircle2 },
      FAILED: { label: 'Thất bại', variant: 'destructive', icon: XCircle },
    };

    const config = statusConfig[status] || { label: status, variant: 'default', icon: Clock };
    const Icon = config.icon || Clock;

    return (
      <Badge 
        variant={config.variant} 
        className={config.className || ''}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Lead</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về Lead của bạn
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : lead ? (
          <div className="space-y-6">
            {/* Status and Type */}
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(lead.status)}
              <Badge variant="outline">
                {lead.leadType === 'SCHEDULE_VIEW' ? 'Đặt lịch xem' : 'Đấu giá'}
              </Badge>
            </div>

            {/* Post Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Thông tin sản phẩm</h3>
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">{lead.postTitle}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Giá:</span>
                    <span className="ml-2 font-semibold text-primary">
                      {formatPrice(lead.postPrice)}
                    </span>
                  </div>
                  {lead.postBrand && (
                    <div>
                      <span className="text-muted-foreground">Thương hiệu:</span>
                      <span className="ml-2 font-medium">{lead.postBrand}</span>
                    </div>
                  )}
                  {lead.postModel && (
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <span className="ml-2 font-medium">{lead.postModel}</span>
                    </div>
                  )}
                </div>
                {lead.postDescription && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {lead.postDescription}
                  </p>
                )}
                {lead.postId && (
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link to={`/posts/${lead.postId}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem bài đăng
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Seller Information */}
            {lead.sellerName && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Thông tin người bán</h3>
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{lead.sellerName}</span>
                  </div>
                  {lead.sellerEmail && (
                    <div className="text-sm text-muted-foreground">
                      Email: {lead.sellerEmail}
                    </div>
                  )}
                  {lead.sellerPhone && (
                    <div className="text-sm text-muted-foreground">
                      Điện thoại: {lead.sellerPhone}
                    </div>
                  )}
                  {lead.sellerAddress && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{lead.sellerAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Staff Information */}
            {lead.staffName && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Staff hỗ trợ</h3>
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{lead.staffName}</span>
                  </div>
                  {lead.assignedAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Đã gán: {formatDate(lead.assignedAt)} ({formatDistanceToNow(new Date(lead.assignedAt), { addSuffix: true, locale: vi })})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Notes */}
            {lead.notes && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Ghi chú</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Thông tin thời gian</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tạo lúc:</span>
                  <span className="font-medium">
                    {formatDate(lead.createdAt)} ({formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: vi })})
                  </span>
                </div>
                {lead.assignedAt && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Đã gán lúc:</span>
                    <span className="font-medium">
                      {formatDate(lead.assignedAt)} ({formatDistanceToNow(new Date(lead.assignedAt), { addSuffix: true, locale: vi })})
                    </span>
                  </div>
                )}
                {lead.closedAt && (
                  <div className="flex items-center gap-2">
                    {lead.status === 'SUCCESSFUL' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-muted-foreground">Đóng lúc:</span>
                    <span className="font-medium">
                      {formatDate(lead.closedAt)} ({formatDistanceToNow(new Date(lead.closedAt), { addSuffix: true, locale: vi })})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy thông tin Lead</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


