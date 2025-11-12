import { useState, useEffect } from 'react'
import { Users, FileText, UserCheck, TrendingUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import StatsCard from '@/components/admin/dashboard/StatsCard'
import PendingPostsWidget from '@/components/admin/dashboard/PendingPostsWidget'
import RecentLeadsWidget from '@/components/admin/dashboard/RecentLeadsWidget'
import PostsStatisticsWidget from '@/components/admin/dashboard/PostsStatisticsWidget'
import ActivityTimeline from '@/components/admin/dashboard/ActivityTimeline'
import adminDashboardService from '@/api/services/adminDashboard.service'
import adminPostService from '@/api/services/adminPost.service'
import adminUserService from '@/api/services/adminUser.service'
import adminService from '@/api/services/admin.service'

/**
 * AdminDashboard Component
 * Trang tổng quan admin với thống kê và biểu đồ
 * Module 7: Dashboard Admin
 */
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [stats, setStats] = useState([])
  const [pendingPosts, setPendingPosts] = useState([])
  const [recentLeads, setRecentLeads] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Thử fetch từ dashboard endpoint trước
      try {
        const response = await adminDashboardService.getDashboardData()
        if (response?.success && response?.data) {
          setDashboardData(response.data)
          // Set data từ dashboard response
          setPendingPosts(response.data.pendingPostsList || [])
          setRecentLeads(response.data.recentLeads || [])
          setRecentActivities(response.data.recentActivities || [])
          
          // Tính toán stats từ dashboard data
          calculateStatsFromDashboard(response.data)
          setLoading(false)
          return
        }
      } catch (error) {
        // Dashboard endpoint chưa có, fallback về các API riêng lẻ
        console.log('Dashboard endpoint chưa có, sử dụng các API riêng lẻ:', error.message)
      }

      // Fallback: Fetch từ các API riêng lẻ
      await fetchDataFromIndividualAPIs()
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Không thể tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchDataFromIndividualAPIs = async () => {
    try {
      // Fetch data từ các API riêng lẻ
      const [pendingPostsRes, leadsRes, usersRes] = await Promise.allSettled([
        adminPostService.getPendingPosts({ pageNumber: 1, pageSize: 5 }),
        adminService.getLeads({ pageNumber: 1, pageSize: 5, sortBy: 'createdAt', sortDirection: 'desc' }),
        adminUserService.getUsers({ pageNumber: 1, pageSize: 1 })
      ])

      // Xử lý pending posts
      if (pendingPostsRes.status === 'fulfilled') {
        const response = pendingPostsRes.value
        let posts = []
        
        // Kiểm tra format response từ API
        if (response?.success && response?.data) {
          posts = Array.isArray(response.data) ? response.data : []
        } else if (Array.isArray(response)) {
          posts = response
        } else if (response?.data) {
          posts = Array.isArray(response.data) ? response.data : response.data.items || []
        }
        
        setPendingPosts(posts.slice(0, 5))
      }

      // Xử lý recent leads
      if (leadsRes.status === 'fulfilled') {
        const response = leadsRes.value
        let leads = []
        
        // Kiểm tra format response từ API
        if (response?.success && response?.data) {
          leads = Array.isArray(response.data) ? response.data : []
        } else if (Array.isArray(response)) {
          leads = response
        } else if (response?.data) {
          leads = Array.isArray(response.data) ? response.data : response.data.items || []
        }
        
        setRecentLeads(leads.slice(0, 5))
      }

      // Tính toán stats từ các API response
      calculateStatsFromIndividualAPIs(pendingPostsRes, leadsRes, usersRes)

      // Tạo mock activities từ data thực tế
      generateActivitiesFromData(pendingPostsRes, leadsRes)
    } catch (error) {
      console.error('Error fetching individual APIs:', error)
    }
  }

  const calculateStatsFromDashboard = (data) => {
    const newStats = [
      {
        label: 'Tổng người dùng',
        value: formatNumber(data.totalUsers || 0),
        change: calculateChange(data.totalUsers, data.previousTotalUsers),
        changeType: getChangeType(data.totalUsers, data.previousTotalUsers),
        icon: Users,
        color: 'purple'
      },
      {
        label: 'Tổng bài đăng',
        value: formatNumber(data.totalPosts || 0),
        change: calculateChange(data.totalPosts, data.previousTotalPosts),
        changeType: getChangeType(data.totalPosts, data.previousTotalPosts),
        icon: FileText,
        color: 'orange'
      },
      {
        label: 'Bài đăng chờ duyệt',
        value: formatNumber(data.pendingPosts || 0),
        change: null,
        changeType: 'neutral',
        icon: AlertCircle,
        color: 'red'
      },
      {
        label: 'Tổng Lead',
        value: formatNumber(data.totalLeads || 0),
        change: calculateChange(data.totalLeads, data.previousTotalLeads),
        changeType: getChangeType(data.totalLeads, data.previousTotalLeads),
        icon: UserCheck,
        color: 'blue'
      },
      {
        label: 'Lead mới',
        value: formatNumber(data.newLeads || 0),
        change: null,
        changeType: 'neutral',
        icon: UserCheck,
        color: 'green'
      }
    ]
    setStats(newStats)
  }

  const calculateStatsFromIndividualAPIs = (pendingPostsRes, leadsRes, usersRes) => {
    // Tính pending posts count
    let pendingCount = 0
    if (pendingPostsRes.status === 'fulfilled') {
      const response = pendingPostsRes.value
      if (response?.success && response?.totalCount !== undefined) {
        pendingCount = response.totalCount
      } else if (response?.data) {
        pendingCount = Array.isArray(response.data) 
          ? response.data.length 
          : response.data.totalCount || 0
      }
    }

    // Tính leads count
    let leadsCount = 0
    if (leadsRes.status === 'fulfilled') {
      const response = leadsRes.value
      if (response?.success && response?.totalCount !== undefined) {
        leadsCount = response.totalCount
      } else if (response?.data) {
        leadsCount = Array.isArray(response.data)
          ? response.data.length
          : response.data.totalCount || 0
      }
    }

    // Tính users count
    let usersCount = 0
    if (usersRes.status === 'fulfilled') {
      const response = usersRes.value
      if (response?.success && response?.totalCount !== undefined) {
        usersCount = response.totalCount
      } else if (response?.data) {
        usersCount = Array.isArray(response.data)
          ? response.data.length
          : response.data.totalCount || 0
      }
    }

    // Mock stats (sẽ được thay thế bằng data thực tế từ backend)
    const newStats = [
      {
        label: 'Tổng người dùng',
        value: formatNumber(usersCount || 0),
        change: null,
        changeType: 'neutral',
        icon: Users,
        color: 'purple'
      },
      {
        label: 'Bài đăng chờ duyệt',
        value: formatNumber(pendingCount),
        change: null,
        changeType: 'neutral',
        icon: FileText,
        color: 'orange'
      },
      {
        label: 'Tổng Lead',
        value: formatNumber(leadsCount),
        change: null,
        changeType: 'neutral',
        icon: UserCheck,
        color: 'blue'
      }
    ]
    setStats(newStats)
  }

  const generateActivitiesFromData = (pendingPostsRes, leadsRes) => {
    const activities = []

    // Thêm activities từ pending posts
    if (pendingPostsRes.status === 'fulfilled') {
      const response = pendingPostsRes.value
      let posts = []
      
      if (response?.success && response?.data) {
        posts = Array.isArray(response.data) ? response.data : []
      } else if (response?.data) {
        posts = Array.isArray(response.data)
          ? response.data
          : response.data.items || []
      }
      
      posts.slice(0, 3).forEach(post => {
        if (post?.id && post?.title) {
          activities.push({
            id: `post-${post.id}`,
            type: 'post',
            message: `Bài đăng "${post.title}" cần được duyệt`,
            createdAt: post.createdAt || new Date().toISOString(),
            timestamp: post.createdAt || new Date().toISOString()
          })
        }
      })
    }

    // Thêm activities từ leads
    if (leadsRes.status === 'fulfilled') {
      const response = leadsRes.value
      let leads = []
      
      if (response?.success && response?.data) {
        leads = Array.isArray(response.data) ? response.data : []
      } else if (response?.data) {
        leads = Array.isArray(response.data)
          ? response.data
          : response.data.items || []
      }
      
      leads.slice(0, 2).forEach(lead => {
        if (lead?.id) {
          activities.push({
            id: `lead-${lead.id}`,
            type: 'lead',
            message: `Lead mới từ ${lead.buyerName || lead.buyer?.fullName || 'Khách hàng'}`,
            createdAt: lead.createdAt || new Date().toISOString(),
            timestamp: lead.createdAt || new Date().toISOString()
          })
        }
      })
    }

    // Sắp xếp theo thời gian
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setRecentActivities(activities.slice(0, 10))
  }

  // Helper functions
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0'
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null
    const change = ((current - previous) / previous) * 100
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  const getChangeType = (current, previous) => {
    if (!previous || previous === 0) return 'neutral'
    if (current > previous) return 'increase'
    if (current < previous) return 'decrease'
    return 'neutral'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống EVehicle</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PendingPostsWidget 
            posts={pendingPosts} 
            loading={loading}
          />
          <RecentLeadsWidget 
            leads={recentLeads} 
            loading={loading}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PostsStatisticsWidget 
            loading={loading}
          />
          <ActivityTimeline 
            activities={recentActivities} 
            loading={loading}
          />
        </div>
      </div>

      {/* Info Banner */}
      {!loading && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Hệ thống hoạt động tốt</h3>
              <p className="text-sm text-gray-600 mt-1">
                {dashboardData 
                  ? 'Dữ liệu dashboard được cập nhật từ backend'
                  : 'Đang sử dụng dữ liệu từ các API riêng lẻ. Dashboard endpoint chưa được implement ở backend.'}
              </p>
              {!dashboardData && (
                <div className="flex gap-3 mt-3">
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    Cần implement GET /api/admin/dashboard
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
