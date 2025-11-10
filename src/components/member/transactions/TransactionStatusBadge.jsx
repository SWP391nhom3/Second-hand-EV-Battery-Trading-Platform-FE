import { Badge } from '@/components/ui/badge';

/**
 * TransactionStatusBadge Component
 * Hiển thị badge trạng thái đơn hàng với màu sắc khác nhau
 */
export default function TransactionStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    if (!status) return { label: 'N/A', variant: 'secondary' };

    const statusMap = {
      PENDING_PAYMENT: { label: 'Chờ thanh toán', variant: 'default' },
      PAID: { label: 'Đã thanh toán', variant: 'default' },
      CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
      SHIPPING: { label: 'Đang vận chuyển', variant: 'default' },
      DELIVERED: { label: 'Đã giao hàng', variant: 'default' },
      COMPLETED: { label: 'Hoàn thành', variant: 'default' },
      CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
    };

    return statusMap[status.toUpperCase()] || { label: status, variant: 'secondary' };
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}


