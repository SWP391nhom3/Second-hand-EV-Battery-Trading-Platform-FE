import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { bidCreateSchema } from '@/lib/validations/auction.validations'
import bidService from '@/api/services/bid.service'
import { Gavel, Loader2 } from 'lucide-react'

/**
 * BidForm Component
 * Form đặt giá đấu
 */
export default function BidForm({ postId, currentHighestBid, startingBid, onBidSuccess }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [minBidAmount, setMinBidAmount] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(bidCreateSchema),
    defaultValues: {
      postId: postId,
      bidAmount: 0
    }
  })

  useEffect(() => {
    // Set minimum bid amount
    const minAmount = currentHighestBid 
      ? currentHighestBid + 10000 // Tăng tối thiểu 10,000 VND
      : (startingBid || 0)
    setMinBidAmount(minAmount)
    setValue('bidAmount', minAmount)
  }, [currentHighestBid, startingBid, setValue])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      // Validate bid amount
      if (data.bidAmount < minBidAmount) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: `Giá đấu phải tối thiểu ${formatPrice(minBidAmount)}`
        })
        return
      }

      const response = await bidService.createBid({
        postId: postId,
        bidAmount: data.bidAmount
      })

      if (response.success) {
        toast({
          title: 'Thành công',
          description: 'Đặt giá đấu thành công!'
        })
        reset()
        if (onBidSuccess) {
          onBidSuccess(response.data)
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: response.message || 'Không thể đặt giá đấu'
        })
      }
    } catch (error) {
      console.error('Error creating bid:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Đã xảy ra lỗi khi đặt giá đấu'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5" />
          Đặt giá đấu
        </CardTitle>
        <CardDescription>
          {currentHighestBid ? (
            <>Giá cao nhất hiện tại: <strong>{formatPrice(currentHighestBid)}</strong></>
          ) : (
            <>Giá khởi điểm: <strong>{formatPrice(startingBid || 0)}</strong></>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Giá đấu (VND)</Label>
            <Input
              id="bidAmount"
              type="number"
              step="1000"
              min={minBidAmount}
              placeholder={formatPrice(minBidAmount)}
              {...register('bidAmount', {
                valueAsNumber: true
              })}
              className={errors.bidAmount ? 'border-destructive' : ''}
            />
            {errors.bidAmount && (
              <p className="text-sm text-destructive">{errors.bidAmount.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Giá đấu tối thiểu: <strong>{formatPrice(minBidAmount)}</strong>
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Gavel className="h-4 w-4 mr-2" />
                Đặt giá
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

