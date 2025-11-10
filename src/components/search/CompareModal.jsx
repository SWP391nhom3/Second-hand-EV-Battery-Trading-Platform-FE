import React, { useState, useEffect } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import postsService from '@/api/services/posts.service'
import { getImageUrl } from '@/utils/imageHelper'
import { useToast } from '@/components/ui/use-toast'

/**
 * CompareModal Component
 * Modal so sánh tối đa 3-5 sản phẩm
 */
export default function CompareModal({ open, onOpenChange, postIds = [] }) {
  const [loading, setLoading] = useState(false)
  const [compareData, setCompareData] = useState(null)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open && postIds.length >= 2) {
      fetchCompareData()
    } else {
      setCompareData(null)
      setError(null)
    }
  }, [open, postIds])

  const fetchCompareData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await postsService.comparePosts(postIds)
      
      if (response.success && response.data) {
        setCompareData(response.data)
      } else {
        setError(response.message || 'Không thể so sánh sản phẩm')
      }
    } catch (err) {
      console.error('Error comparing posts:', err)
      setError(err.message || 'Đã xảy ra lỗi khi so sánh sản phẩm')
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: err.message || 'Không thể so sánh sản phẩm'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>So sánh sản phẩm</DialogTitle>
          <DialogDescription>
            So sánh {postIds.length} sản phẩm đã chọn
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Đang tải dữ liệu so sánh...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium">{error}</p>
            <Button onClick={fetchCompareData} className="mt-4">
              Thử lại
            </Button>
          </div>
        ) : compareData && compareData.products ? (
          <div className="space-y-4">
            {/* Products Header */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareData.products.length}, 1fr)` }}>
              <div></div>
              {compareData.products.map((product) => (
                <div key={product.postId} className="text-center space-y-2">
                  {product.thumbnailImageUrl && (
                    <img
                      src={getImageUrl(product.thumbnailImageUrl)}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                  <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Thông số</TableHead>
                    {compareData.products.map((product) => (
                      <TableHead key={product.postId} className="text-center">
                        {product.brand} {product.model}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Danh mục</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.categoryName}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Thương hiệu</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.brand}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Model</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.model}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Giá</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center font-semibold">
                        {formatPrice(product.price)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Năm sản xuất</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.productionYear}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dung lượng pin (SOH)</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.batteryCapacityCurrent} kWh
                      </TableCell>
                    ))}
                  </TableRow>
                  {compareData.products.some(p => p.mileage != null) && (
                    <TableRow>
                      <TableCell className="font-medium">Số km đã đi</TableCell>
                      {compareData.products.map((product) => (
                        <TableCell key={product.postId} className="text-center">
                          {product.mileage ? `${product.mileage.toLocaleString()} km` : 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                  {compareData.products.some(p => p.chargeCount != null) && (
                    <TableRow>
                      <TableCell className="font-medium">Số lần sạc</TableCell>
                      {compareData.products.map((product) => (
                        <TableCell key={product.postId} className="text-center">
                          {product.chargeCount ? product.chargeCount.toLocaleString() : 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Tình trạng</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.condition}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Địa điểm</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.location || 'N/A'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Đấu giá</TableCell>
                    {compareData.products.map((product) => (
                      <TableCell key={product.postId} className="text-center">
                        {product.auctionEnabled ? (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Có
                          </Badge>
                        ) : (
                          <Badge variant="outline">Không</Badge>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}


