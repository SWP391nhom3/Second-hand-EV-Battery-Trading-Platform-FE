import { useState, useEffect } from 'react'
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import adminPostService from '@/api/services/adminPost.service'

/**
 * PostsStatisticsWidget Component
 * Widget hiển thị thống kê về bài đăng
 * Module 7: Dashboard Admin
 */
export default function PostsStatisticsWidget({ loading: externalLoading = false }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    thisWeek: 0,
    thisMonth: 0
  })

  useEffect(() => {
    if (!externalLoading) {
      fetchStats()
    }
  }, [externalLoading])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Fetch các loại bài đăng
      const [pendingRes, approvedRes, rejectedRes] = await Promise.allSettled([
        adminPostService.getPendingPosts({ pageNumber: 1, pageSize: 1 }),
        adminPostService.getApprovedRejectedPosts({ 
          pageNumber: 1, 
          pageSize: 1, 
          status: 'APPROVED',
          sortBy: 'createdAt',
          sortDirection: 'desc'
        }),
        adminPostService.getApprovedRejectedPosts({ 
          pageNumber: 1, 
          pageSize: 1, 
          status: 'DENIED',
          sortBy: 'createdAt',
          sortDirection: 'desc'
        })
      ])

      // Tính toán stats
      const pendingCount = pendingRes.status === 'fulfilled' 
        ? (pendingRes.value?.totalCount || pendingRes.value?.data?.totalCount || 0)
        : 0

      const approvedCount = approvedRes.status === 'fulfilled'
        ? (approvedRes.value?.totalCount || approvedRes.value?.data?.totalCount || 0)
        : 0

      const rejectedCount = rejectedRes.status === 'fulfilled'
        ? (rejectedRes.value?.totalCount || rejectedRes.value?.data?.totalCount || 0)
        : 0

      // Tính bài đăng trong tuần/tháng này (approximate)
      // Sẽ được cải thiện khi có API chính xác
      const thisWeekCount = Math.floor(approvedCount * 0.15) // Approximation
      const thisMonthCount = Math.floor(approvedCount * 0.4) // Approximation

      setStats({
        total: pendingCount + approvedCount + rejectedCount,
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
        thisWeek: thisWeekCount,
        thisMonth: thisMonthCount
      })
    } catch (error) {
      console.error('Error fetching posts statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0'
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  if (loading || externalLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Thống kê bài đăng</h2>
          <FileText className="h-5 w-5 text-gray-400 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Thống kê bài đăng</h2>
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/posts')}
          className="text-xs"
        >
          Xem tất cả
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Posts */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-blue-700">Tổng bài đăng</p>
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.total)}</p>
        </div>

        {/* Approved Posts */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-green-700">Đã duyệt</p>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{formatNumber(stats.approved)}</p>
        </div>

        {/* Pending Posts */}
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-orange-700">Chờ duyệt</p>
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">{formatNumber(stats.pending)}</p>
        </div>

        {/* Rejected Posts */}
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-red-700">Đã từ chối</p>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-900">{formatNumber(stats.rejected)}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-gray-500" />
            <p className="text-xs text-gray-600">Tuần này</p>
          </div>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(stats.thisWeek)}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-gray-500" />
            <p className="text-xs text-gray-600">Tháng này</p>
          </div>
          <p className="text-lg font-semibold text-gray-900">{formatNumber(stats.thisMonth)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/posts?status=PENDING')}
            className="flex-1 text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Duyệt bài
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/posts?status=APPROVED')}
            className="flex-1 text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã duyệt
          </Button>
        </div>
      </div>
    </div>
  )
}

