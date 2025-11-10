import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Zap, 
  Menu, 
  User, 
  LogIn, 
  UserPlus,
  Bell,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Search,
  Shield,
  LayoutDashboard,
  Receipt,
  Calendar,
  MessageSquare,
  CreditCard,
  Wallet,
  FileText
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import authService from '@/api/services/auth.service';
import notificationService from '@/api/services/notification.service';
import packageService from '@/api/services/package.service';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = authService.getUserData();
        setUser(userData);
      } else {
        setNotifications([]);
        setUnreadCount(0);
        setTotalCredits(0);
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingNotifications(true);
      const [notificationsResponse, unreadCountResponse] = await Promise.all([
        notificationService.getNotifications({
          pageNumber: 1,
          pageSize: 5,
          isRead: false,
          sortBy: 'CreatedAt',
          sortOrder: 'DESC'
        }),
        notificationService.getUnreadCount()
      ]);

      if (notificationsResponse.success && notificationsResponse.data) {
        // PagedResponse structure: { success, data: [...], pageNumber, pageSize, totalCount }
        // Check if data is array (PagedResponse) or object with data property
        let notificationsData = [];
        if (Array.isArray(notificationsResponse.data)) {
          notificationsData = notificationsResponse.data;
        } else if (notificationsResponse.data.data && Array.isArray(notificationsResponse.data.data)) {
          notificationsData = notificationsResponse.data.data;
        } else if (notificationsResponse.data.items && Array.isArray(notificationsResponse.data.items)) {
          notificationsData = notificationsResponse.data.items;
        }
        setNotifications(notificationsData);
      }

      if (unreadCountResponse.success && unreadCountResponse.data !== undefined) {
        setUnreadCount(unreadCountResponse.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [isAuthenticated]);

  // Load credits
  const loadCredits = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await packageService.getMyCredits();
      if (response.success && response.data && Array.isArray(response.data)) {
        // Calculate total credits from all packages
        const total = response.data.reduce((sum, pkg) => sum + (pkg.creditsRemaining || 0), 0);
        setTotalCredits(total);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  }, [isAuthenticated]);

  // Load notifications and credits when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadCredits();
      
      // Poll for notifications every 30 seconds
      const notificationsInterval = setInterval(() => {
        loadNotifications();
      }, 30000);
      
      return () => clearInterval(notificationsInterval);
    }
  }, [isAuthenticated, loadNotifications, loadCredits]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications(); // Reload to update list
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể đánh dấu thông báo đã đọc');
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications(); // Reload to update list
      toast.success('Đã đánh dấu tất cả thông báo đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Không thể đánh dấu tất cả thông báo đã đọc');
    }
  };

  // Get notification type label
  const getNotificationTypeLabel = (type) => {
    const labels = {
      NEW_MESSAGE: 'Tin nhắn mới',
      NEW_BID: 'Đấu giá mới',
      ORDER_UPDATE: 'Cập nhật đơn hàng',
      PRICE_CHANGE: 'Thay đổi giá',
      NEW_LEAD: 'Lead mới',
      APPOINTMENT: 'Lịch hẹn',
      CONTRACT_READY: 'Hợp đồng sẵn sàng',
      PAYMENT_SUCCESS: 'Thanh toán thành công',
      PAYMENT_FAILED: 'Thanh toán thất bại'
    };
    return labels[type] || type;
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Đấu giá', href: '/auctions' },
    { name: 'Gói tin', href: '/packages' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hidden sm:block">EVehicle</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Button - Desktop */}
            <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
              <Link to="/posts">
                <Search className="h-4 w-4" />
                <span>Tìm kiếm</span>
              </Link>
            </Button>

            {isAuthenticated ? (
              <>
                {/* Chat */}
                <Button variant="ghost" size="icon" className="hidden md:flex relative" asChild>
                  <Link to="/member/chat">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Credits Display */}
                {totalCredits > 0 && (
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2" asChild>
                    <Link to="/member/credits">
                      <Wallet className="h-4 w-4" />
                      <span className="font-medium">{totalCredits}</span>
                    </Link>
                  </Button>
                )}

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={handleMarkAllAsRead}
                        >
                          Đánh dấu tất cả đã đọc
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-sm text-muted-foreground">Đang tải...</div>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-sm text-muted-foreground text-center">
                            Không có thông báo mới
                          </div>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.notificationId || notification.id}
                            className="flex flex-col items-start py-3 cursor-pointer"
                            onClick={() => {
                              if (!notification.isRead) {
                                handleMarkAsRead(notification.notificationId || notification.id);
                              }
                              // Navigate based on notification type
                              if (notification.relatedId) {
                                if (notification.notificationType === 'NEW_MESSAGE') {
                                  navigate('/member/chat');
                                } else if (notification.notificationType === 'NEW_BID') {
                                  navigate(`/auctions/${notification.relatedId}`);
                                } else if (notification.notificationType === 'CONTRACT_READY') {
                                  navigate(`/contracts/${notification.relatedId}`);
                                } else if (notification.notificationType === 'CONTRACT_SIGNED') {
                                  navigate(`/contracts/${notification.relatedId}`);
                                } else if (notification.notificationType === 'NEW_LEAD') {
                                  navigate('/member/leads');
                                }
                              } else {
                                // Navigate to notifications page if no relatedId
                                navigate('/member/notifications');
                              }
                            }}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{notification.title}</div>
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.content}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                      addSuffix: true,
                                      locale: vi
                                    })}
                                  </span>
                                  {notification.notificationType && (
                                    <Badge variant="secondary" className="text-xs">
                                      {getNotificationTypeLabel(notification.notificationType)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-primary ml-2 flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/member/notifications" className="w-full cursor-pointer text-center justify-center">
                        Xem tất cả thông báo
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Favorites */}
                <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                  <Link to="/favorites">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || user?.phoneNumber || ''}
                        </p>
                        {user?.role && (
                          <Badge variant="secondary" className="w-fit mt-1 text-xs">
                            {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'STAFF' ? 'Nhân viên' : 'Người dùng'}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Admin/Staff Dashboard */}
                    {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to={user.role === 'ADMIN' ? '/admin' : '/staff'} className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-posts" className="cursor-pointer">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Tin đăng của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/transactions" className="cursor-pointer">
                        <Receipt className="mr-2 h-4 w-4" />
                        Lịch sử giao dịch
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/payment-history" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Lịch sử thanh toán
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/member/leads" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Leads của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/member/contracts" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        Hợp đồng của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/member/chat" className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Tin nhắn
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/member/credits" className="cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        Credits của tôi
                        {totalCredits > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {totalCredits}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Yêu thích
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/packages" className="cursor-pointer">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Gói tin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Post Button */}
                <Button size="sm" className="hidden md:flex" asChild>
                  <Link to="/posts/create">
                    Đăng tin
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {/* Login/Register Buttons */}
                <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                  <Link to="/auth/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Link>
                </Button>
                <Button size="sm" className="hidden md:flex" asChild>
                  <Link to="/auth/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Đăng ký
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-3 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/posts/create"
                      className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng tin
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Trang cá nhân
                    </Link>
                    <Link
                      to="/my-posts"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Tin đăng của tôi
                    </Link>
                    <Link
                      to="/transactions"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Receipt className="h-4 w-4" />
                      Lịch sử giao dịch
                    </Link>
                    <Link
                      to="/payment-history"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <CreditCard className="h-4 w-4" />
                      Lịch sử thanh toán
                    </Link>
                    <Link
                      to="/member/leads"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      Leads của tôi
                    </Link>
                    <Link
                      to="/member/contracts"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="h-4 w-4" />
                      Hợp đồng của tôi
                    </Link>
                    <Link
                      to="/member/chat"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Tin nhắn
                    </Link>
                    <Link
                      to="/member/credits"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Wallet className="h-4 w-4" />
                      Credits của tôi
                      {totalCredits > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {totalCredits}
                        </Badge>
                      )}
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      Yêu thích
                    </Link>
                    <Link
                      to="/packages"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Gói tin
                    </Link>
                    <Link
                      to="/member/notifications"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Bell className="h-4 w-4" />
                      Thông báo
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-primary text-primary-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
