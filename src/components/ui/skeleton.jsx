import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 * Sử dụng để hiển thị loading state với animation mượt mà
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-skeleton-pulse rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

