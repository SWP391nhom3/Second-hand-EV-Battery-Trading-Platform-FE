import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Zap, Mail, Phone, MapPin, HeadphonesIcon, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import TransactionFilters from '@/components/member/transactions/TransactionFilters';
import TransactionList from '@/components/member/transactions/TransactionList';
import TransactionDetailModal from '@/components/member/transactions/TransactionDetailModal';
import ExportButton from '@/components/member/transactions/ExportButton';
import orderService from '@/api/services/order.service';
import userService from '@/api/services/user.service';
import { formatOrderSearchRequest } from '@/lib/validations/transaction.validations';

/**
 * TransactionHistory Page
 * Lịch sử Giao dịch cho Member - UC05
 * Module 3: Lịch sử Giao dịch
 */
export default function TransactionHistory() {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [keyword, setKeyword] = useState('');
  const [transactionType, setTransactionType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTransactions();
    }
  }, [pageNumber, pageSize, transactionType, status, fromDate, toDate, currentUser]);

  // Debounce keyword search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageNumber === 1) {
        loadTransactions();
      } else {
        setPageNumber(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  const loadCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      if (response?.success && response?.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      setIsLoading(true);

      const params = formatOrderSearchRequest({
        pageNumber,
        pageSize,
        transactionType: transactionType !== 'ALL' ? transactionType : null,
        status: status !== 'ALL' ? status : null,
        fromDate: fromDate || null,
        toDate: toDate || null,
        keyword: keyword.trim() || null,
        sortBy: 'createdat',
        sortDirection: 'desc',
      });

      const response = await orderService.getMyOrders(params);

      if (response?.success && response?.data) {
        setTransactions(response.data.data || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        toast.error(response?.message || 'Không thể tải lịch sử giao dịch');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
      if (response?.success && response?.data) {
        setSelectedTransaction(response.data);
        setIsDetailModalOpen(true);
      } else {
        toast.error(response?.message || 'Không thể tải chi tiết giao dịch');
      }
    } catch (error) {
      console.error('Error loading transaction detail:', error);
      toast.error('Không thể tải chi tiết giao dịch. Vui lòng thử lại sau.');
    }
  };

  const handleFilterReset = () => {
    setKeyword('');
    setTransactionType('ALL');
    setStatus('ALL');
    setFromDate('');
    setToDate('');
    setPageNumber(1);
  };

  const handleExport = () => {
    // TODO: Implement export functionality when backend API is ready
    toast.info('Tính năng xuất báo cáo sẽ sớm được cập nhật');
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPrevious = pageNumber > 1;
  const hasNext = pageNumber < totalPages;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử Giao dịch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Xem lịch sử các giao dịch mua/bán của bạn
          </p>
        </div>

      {/* Filters */}
      <TransactionFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        transactionType={transactionType}
        onTransactionTypeChange={setTransactionType}
        status={status}
        onStatusChange={setStatus}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        onReset={handleFilterReset}
      />

      {/* Export Button */}
      <div className="mb-4 flex justify-end">
        <ExportButton onExport={handleExport} disabled={isLoading} />
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        loading={isLoading}
        onViewDetail={handleViewDetail}
        currentUserId={currentUser?.id}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {((pageNumber - 1) * pageSize) + 1} đến{' '}
            {Math.min(pageNumber * pageSize, totalCount)} trong tổng số {totalCount} giao dịch
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={!hasPrevious || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <span className="text-sm text-gray-700">
              Trang {pageNumber} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={!hasNext || isLoading}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
        currentUserId={currentUser?.id}
      />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-white">EVehicle</span>
              </div>
              <p className="text-sm leading-relaxed">
                Nền tảng C2C hàng đầu cho xe điện và pin tại Việt Nam. 
                Giao dịch an toàn, minh bạch với sự hỗ trợ của đội ngũ môi giới chuyên nghiệp.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-lg bg-slate-800 hover:bg-primary transition-colors flex items-center justify-center">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Về chúng tôi */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Về chúng tôi</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Cách thức hoạt động
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Hỗ trợ */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Hỗ trợ</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/faq" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/dispute" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Giải quyết tranh chấp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Liên hệ */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Liên hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@evehicle.vn" className="hover:text-primary transition-colors">
                    support@evehicle.vn
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a href="tel:1900xxxx" className="hover:text-primary transition-colors">
                    Hotline: 1900-xxxx
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Hà Nội, Việt Nam</span>
                </li>
                <li className="flex items-start gap-2">
                  <HeadphonesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Hỗ trợ 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-slate-400">
                &copy; 2025 EVehicle Marketplace. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/terms" className="text-slate-400 hover:text-primary transition-colors">
                  Điều khoản
                </Link>
                <Link to="/privacy" className="text-slate-400 hover:text-primary transition-colors">
                  Bảo mật
                </Link>
                <Link to="/cookies" className="text-slate-400 hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

