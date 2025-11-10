import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Eye,
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * LeadCard Component
 * Hiển thị thông tin một Lead trong danh sách
 * 
 * @param {Object} props
 * @param {Object} props.lead - Lead object từ API
 * @param {Function} props.onViewDetail - Callback khi click xem chi tiết
 */
export default function LeadCard({ lead, onViewDetail }) {
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

  const getLeadTypeLabel = (leadType) => {
    return leadType === 'SCHEDULE_VIEW' ? 'Đặt lịch xem' : 'Đấu giá';
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {lead.postTitle || 'Không có tiêu đề'}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(lead.status)}
              <Badge variant="outline">
                {getLeadTypeLabel(lead.leadType)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Giá sản phẩm:</span>
            <span className="font-semibold text-primary">
              {formatPrice(lead.postPrice)}
            </span>
          </div>
          
          {lead.postBrand && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Thương hiệu:</span>
              <span className="font-medium">{lead.postBrand}</span>
            </div>
          )}

          {lead.postModel && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium">{lead.postModel}</span>
            </div>
          )}
        </div>

        {/* Staff Info */}
        {lead.staffName && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Staff hỗ trợ:</span>
              <span className="font-medium">{lead.staffName}</span>
            </div>
          </div>
        )}

        {/* Seller Info */}
        {lead.sellerName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Người bán:</span>
            <span className="font-medium">{lead.sellerName}</span>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              <span className="font-medium">Ghi chú: </span>
              {lead.notes}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="pt-2 border-t space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Tạo: {formatDistanceToNow(new Date(lead.createdAt), { 
                addSuffix: true, 
                locale: vi 
              })}
            </span>
          </div>
          
          {lead.assignedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>
                Đã gán: {formatDistanceToNow(new Date(lead.assignedAt), { 
                  addSuffix: true, 
                  locale: vi 
                })}
              </span>
            </div>
          )}

          {lead.closedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {lead.status === 'SUCCESSFUL' ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              <span>
                Đóng: {formatDistanceToNow(new Date(lead.closedAt), { 
                  addSuffix: true, 
                  locale: vi 
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetail && onViewDetail(lead)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Xem chi tiết
        </Button>
        
        {lead.postId && (
          <Button
            variant="outline"
            className="flex-1"
            asChild
          >
            <Link to={`/posts/${lead.postId}`}>
              <Eye className="h-4 w-4 mr-2" />
              Xem bài đăng
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


