import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/**
 * CountdownTimer Component
 * Hiển thị countdown timer đến khi kết thúc đấu giá
 */
export default function CountdownTimer({ endTime, onExpired }) {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!endTime) {
      setTimeLeft(null)
      return
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const difference = end - now

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onExpired) {
          onExpired()
        }
        return null
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    // Calculate immediately
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft)
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, onExpired])

  if (!endTime || !timeLeft) {
    return null
  }

  if (isExpired) {
    return (
      <Badge variant="destructive" className="gap-2">
        <Clock className="h-4 w-4" />
        Đã kết thúc
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-orange-600" />
      <div className="flex items-center gap-1 text-sm font-semibold">
        {timeLeft.days > 0 && (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
            {timeLeft.days} ngày
          </span>
        )}
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
          {String(timeLeft.hours).padStart(2, '0')}:
        </span>
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
          {String(timeLeft.minutes).padStart(2, '0')}:
        </span>
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}


