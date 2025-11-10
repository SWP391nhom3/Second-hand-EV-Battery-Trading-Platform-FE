import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MyLeadsList from '@/components/member/lead/MyLeadsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Package, Loader2 } from 'lucide-react';
import leadService from '@/api/services/lead.service';
import { toast } from 'sonner';

/**
 * Leads Page
 * UC23: Trang quản lý Leads của Member (Đặt lịch xem / Yêu cầu Môi giới)
 */
export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    status: null,
    leadType: null,
    pageNumber: 1,
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getMyLeads({
        pageNumber: filters.pageNumber || 1,
        pageSize: pagination.pageSize || 10,
        status: filters.status,
        leadType: filters.leadType,
        sortBy: 'CreatedAt',
        sortOrder: 'DESC',
      });

      console.log('Leads API Response:', response);

      if (response.success && response.data) {
        // Backend returns BaseResponse<PagedResponse<LeadResponse>>
        // So the structure is: { success: true, data: { data: [...], pageNumber, pageSize, totalCount } }
        const leadsData = response.data.data || [];
        setLeads(leadsData);
        setPagination({
          pageNumber: response.data.pageNumber || 1,
          pageSize: response.data.pageSize || 10,
          totalCount: response.data.totalCount || 0,
        });
        console.log('Leads loaded:', leadsData.length, 'items');
      } else {
        console.error('Failed to load leads:', response);
        toast.error(response.message || 'Không thể tải danh sách Leads');
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Có lỗi xảy ra khi tải danh sách Leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, pageNumber: newPage });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Calculate stats
  const stats = {
    total: pagination.totalCount || 0,
    new: leads.filter(l => l.status === 'NEW').length,
    assigned: leads.filter(l => l.status === 'ASSIGNED').length,
    scheduled: leads.filter(l => l.status === 'SCHEDULED').length,
    successful: leads.filter(l => l.status === 'SUCCESSFUL').length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Quản lý Leads</h1>
            <p className="text-muted-foreground">
              Xem và quản lý các yêu cầu đặt lịch xem và môi giới của bạn
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng số Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mới
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đã gán Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.assigned}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đã đặt lịch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Thành công
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
              </CardContent>
            </Card>
          </div>

          {/* Leads List */}
          <MyLeadsList
            leads={leads}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}


