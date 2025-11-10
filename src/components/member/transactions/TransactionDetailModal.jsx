import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, DollarSign, Clock, Package, MapPin, CreditCard } from 'lucide-react';
import TransactionStatusBadge from './TransactionStatusBadge';

/**
 * TransactionDetailModal Component
 * Modal hiển thị chi tiết giao dịch (Order)
 */
export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  currentUserId,
}) {
  if (!transaction) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return 'N/A';
    }
  };

  const getTransactionType = () => {
    if (!currentUserId) return { label: 'N/A', color: 'text-gray-600' };
    if (transaction.buyerId === currentUserId) {
      return { label: 'Mua', color: 'text-blue-600' };
    }
    if (transaction.sellerId === currentUserId) {
      return { label: 'Bán', color: 'text-green-600' };
    }
    return { label: 'N/A', color: 'text-gray-600' };
  };

  const transactionType = getTransactionType();
  const isBuyer = transaction.buyerId === currentUserId;
  const isSeller = transaction.sellerId === currentUserId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Giao dịch</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về giao dịch và đơn hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status và Transaction Type */}
          <div className="flex gap-2 flex-wrap items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <TransactionStatusBadge status={transaction.status} />
              <Badge variant="outline" className={transactionType.color}>
                {transactionType.label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Thông tin đơn hàng */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-medium">{transaction.orderId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tiêu đề bài đăng</p>
                <p className="font-medium">{transaction.postTitle || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giá cuối cùng</p>
                <p className="font-medium text-green-600">
                  {formatPrice(transaction.finalPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin người mua */}
          {isSeller && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin người mua
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên người mua</p>
                    <p className="font-medium">{transaction.buyerName || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin người bán */}
          {isBuyer && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin người bán
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên người bán</p>
                    <p className="font-medium">{transaction.sellerName || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Thông tin thanh toán */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">{transaction.paymentMethod || 'N/A'}</p>
              </div>
              {transaction.paidAt && (
                <div>
                  <p className="text-sm text-gray-500">Ngày thanh toán</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatDate(transaction.paidAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          {transaction.shippingAddress && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </h3>
                <p className="text-gray-700">{transaction.shippingAddress}</p>
              </div>
            </>
          )}

          {/* Thông tin Staff */}
          {transaction.staffName && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Staff hỗ trợ
                </h3>
                <p className="text-gray-700">{transaction.staffName}</p>
              </div>
            </>
          )}

          {/* Thời gian hoàn thành */}
          {transaction.completedAt && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Thời gian hoàn thành
                </h3>
                <p className="text-gray-700">{formatDate(transaction.completedAt)}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


