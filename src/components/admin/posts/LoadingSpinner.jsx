import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * LoadingSpinner Component
 * Spinner loading với animation mượt
 */
export default function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3 py-12",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-gray-500 animate-pulse">{text}</p>
      )}
    </div>
  )
}

