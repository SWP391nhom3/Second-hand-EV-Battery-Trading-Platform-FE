import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ReviewList from '@/components/member/review/ReviewList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, MessageSquare, TrendingUp, Filter } from 'lucide-react'
import ratingService from '@/api/services/rating.service'
import authService from '@/api/services/auth.service'

/**
 * UserReviews Page
 * Trang xem đánh giá của một user
 */
export default function UserReviews() {
  const { userId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    rateeId: userId || '',
    rateeRole: searchParams.get('role') || undefined,
    minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')) : undefined,
    maxScore: searchParams.get('maxScore') ? parseInt(searchParams.get('maxScore')) : undefined
  })
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageScore: 0,
    scoreDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  })
  const [loading, setLoading] = useState(true)

  const currentUser = authService.getUserData()
  const isCurrentUser = currentUser?.userId === userId

  useEffect(() => {
    if (userId) {
      setFilters(prev => ({ ...prev, rateeId: userId }))
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchStats()
    }
  }, [userId, filters.rateeRole])

  const fetchStats = async () => {
    if (!userId) return
    
    try {
      setLoading(true)

      // Fetch all ratings to calculate stats
      const response = await ratingService.getRatings({
        rateeId: userId,
        rateeRole: filters.rateeRole,
        pageNumber: 1,
        pageSize: 1000 // Get all for stats
      })

      if (response.success && response.data.items) {
        const ratings = response.data.items
        const total = ratings.length
        const sum = ratings.reduce((acc, r) => acc + r.score, 0)
        const avg = total > 0 ? sum / total : 0

        // Calculate score distribution
        const distribution = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
        ratings.forEach((r) => {
          distribution[r.score] = (distribution[r.score] || 0) + 1
        })

        setStats({
          totalRatings: total,
          averageScore: avg,
          scoreDistribution: distribution
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams)
    if (value) {
      newSearchParams.set(key, value)
    } else {
      newSearchParams.delete(key)
    }
    setSearchParams(newSearchParams)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            <h1 className="text-3xl font-bold">Đánh giá</h1>
          </div>
          <p className="text-muted-foreground">
            {isCurrentUser
              ? 'Xem tất cả đánh giá về bạn'
              : 'Xem đánh giá về người dùng này'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRatings}</div>
              <p className="text-xs text-muted-foreground">đánh giá</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '0.0'}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <p className="text-xs text-muted-foreground">
                  / 5.0 sao
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phân bố điểm</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((score) => {
                  const count = stats.scoreDistribution[score] || 0
                  const percentage =
                    stats.totalRatings > 0
                      ? ((count / stats.totalRatings) * 100).toFixed(0)
                      : 0
                  return (
                    <div key={score} className="flex items-center gap-2">
                      <span className="text-xs w-8">{score} sao</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Bộ lọc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ratee Role Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loại đánh giá</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={filters.rateeRole || ''}
                    onChange={(e) =>
                      handleFilterChange('rateeRole', e.target.value || undefined)
                    }
                  >
                    <option value="">Tất cả</option>
                    <option value="SELLER">Đánh giá người bán</option>
                    <option value="BUYER">Đánh giá người mua</option>
                  </select>
                </div>

                {/* Score Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Điểm số</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={filters.minScore ? `${filters.minScore}-${filters.maxScore}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [min, max] = e.target.value.split('-').map(Number)
                        handleFilterChange('minScore', min)
                        handleFilterChange('maxScore', max)
                      } else {
                        handleFilterChange('minScore', undefined)
                        handleFilterChange('maxScore', undefined)
                      }
                    }}
                  >
                    <option value="">Tất cả</option>
                    <option value="5-5">5 sao</option>
                    <option value="4-5">4-5 sao</option>
                    <option value="3-5">3-5 sao</option>
                    <option value="1-2">1-2 sao</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <ReviewList filters={filters} pageSize={10} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

