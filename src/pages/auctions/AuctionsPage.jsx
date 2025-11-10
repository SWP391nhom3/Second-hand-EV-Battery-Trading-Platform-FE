import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Search, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import AuctionList from '@/components/auction/AuctionList'
import postsService from '@/api/services/posts.service'

/**
 * Auctions Page
 * Trang danh sách các đấu giá đang diễn ra
 */
export default function AuctionsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchAuctions()
  }, [pageNumber])

  const fetchAuctions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await postsService.searchPosts({
        pageNumber,
        pageSize: 12,
        keyword: searchKeyword || undefined,
        auctionOnly: true, // Chỉ lấy bài đăng có đấu giá
        sortBy: 'CreatedAt',
        sortDirection: 'DESC'
      })

      console.log('Auctions API Response:', response);

      // PagedResponse structure: { success, data: [...], pageNumber, pageSize, totalCount, totalPages }
      if (response.success && response.data) {
        // response.data is already an array, not an object with items property
        const postsData = Array.isArray(response.data) ? response.data : [];
        setPosts(postsData);
        setTotalPages(response.totalPages || 1);
        console.log('Auctions loaded:', postsData.length, 'items');
      } else {
        console.error('Failed to load auctions:', response);
        setError(response.message || 'Không thể tải danh sách đấu giá')
      }
    } catch (err) {
      console.error('Error fetching auctions:', err)
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải danh sách đấu giá')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPageNumber(1)
    fetchAuctions()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Đấu giá</h1>
              <p className="text-muted-foreground">Danh sách các sản phẩm đang đấu giá</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm sản phẩm đấu giá..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="py-4">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Auction List */}
        <AuctionList posts={posts} loading={loading} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {pageNumber} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


