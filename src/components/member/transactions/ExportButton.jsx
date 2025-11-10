import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ExportButton Component
 * Button để export lịch sử giao dịch (PDF/Excel)
 * Note: Export functionality chưa được implement ở backend
 */
export default function ExportButton({ onExport, disabled = false }) {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // TODO: Implement export functionality when backend API is ready
      console.log('Export functionality not yet implemented');
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Xuất báo cáo
    </Button>
  );
}


