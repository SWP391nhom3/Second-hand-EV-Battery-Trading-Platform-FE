import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import LeadCard from './LeadCard';
import LeadDetailModal from './LeadDetailModal';
import { 
  Calendar, 
  Package, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

/**
 * MyLeadsList Component
 * UC23: Hiển thị danh sách Leads của Member với filters và pagination
 * 
 * @param {Object} props
 * @param {Array} props.leads - Danh sách Leads
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.pagination - Pagination info (pageNumber, pageSize, totalCount)
 * @param {Function} props.onPageChange - Callback khi đổi trang
 * @param {Function} props.onFilterChange - Callback khi thay đổi filter
 * @param {Object} props.filters - Current filters
 */
export default function MyLeadsList({
  leads = [],
  loading,
  pagination = {},
  onPageChange,
  onFilterChange,
  filters = {},
}) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleViewDetail = (lead) => {
    setSelectedLead(lead);
    setDetailModalOpen(true);
  };

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filters, [key]: value, pageNumber: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const totalPages = pagination.totalCount 
    ? Math.ceil(pagination.totalCount / (pagination.pageSize || 10))
    : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold">Không có Lead nào</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Bạn chưa tạo Lead nào. Hãy đặt lịch xem sản phẩm bạn quan tâm.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Trạng thái</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('status', value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="NEW">Mới</SelectItem>
                  <SelectItem value="ASSIGNED">Đã gán Staff</SelectItem>
                  <SelectItem value="CONTACTED">Đã liên hệ</SelectItem>
                  <SelectItem value="SCHEDULED">Đã đặt lịch</SelectItem>
                  <SelectItem value="SUCCESSFUL">Thành công</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Loại Lead</label>
              <Select
                value={filters.leadType || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('leadType', value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="SCHEDULE_VIEW">Đặt lịch xem</SelectItem>
                  <SelectItem value="AUCTION_WINNER">Đấu giá</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  if (onFilterChange) {
                    onFilterChange({ pageNumber: 1 });
                  }
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <LeadCard
            key={lead.leadId}
            lead={lead}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(pagination.pageNumber - 1) * (pagination.pageSize || 10) + 1} -{' '}
            {Math.min(
              pagination.pageNumber * (pagination.pageSize || 10),
              pagination.totalCount || 0
            )}{' '}
            trong tổng số {pagination.totalCount || 0} Lead
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="text-sm text-muted-foreground">
              Trang {pagination.pageNumber} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= totalPages}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          leadId={selectedLead.leadId}
        />
      )}
    </div>
  );
}


