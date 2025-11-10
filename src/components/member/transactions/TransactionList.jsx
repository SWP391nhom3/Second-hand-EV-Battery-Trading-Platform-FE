import { Eye, Calendar, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TransactionStatusBadge from './TransactionStatusBadge';
import TransactionListSkeleton from './TransactionListSkeleton';

/**
 * TransactionList Component
 * Component hiển thị danh sách giao dịch (Orders) của Member
 */
export default function TransactionList({
  transactions = [],
  loading,
  onViewDetail,
  currentUserId,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'N/A';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return null;
    try {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      if (isNaN(numPrice)) return null;
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(numPrice);
    } catch (error) {
      console.error('Error formatting price:', error, price);
      return null;
    }
  };

  const getTransactionType = (transaction) => {
    if (!currentUserId) return 'N/A';
    if (transaction.buyerId === currentUserId) {
      return { label: 'Mua', color: 'text-blue-600' };
    }
    if (transaction.sellerId === currentUserId) {
      return { label: 'Bán', color: 'text-green-600' };
    }
    return { label: 'N/A', color: 'text-gray-600' };
  };

  if (loading) {
    return <TransactionListSkeleton />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Không có giao dịch</h3>
        <p className="mt-1 text-sm text-gray-500">Bạn chưa có giao dịch nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const transactionType = getTransactionType(transaction);
        return (
          <Card key={transaction.orderId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transaction.postTitle || 'N/A'}
                    </h3>
                    <span className={`text-sm font-medium ${transactionType.color}`}>
                      {transactionType.label}
                    </span>
                    <TransactionStatusBadge status={transaction.status} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {transaction.buyerId === currentUserId
                      ? `Người bán: ${transaction.sellerName || 'N/A'}`
                      : `Người mua: ${transaction.buyerName || 'N/A'}`}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-gray-900">
                        {formatPrice(transaction.finalPrice) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(transaction.orderId)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


