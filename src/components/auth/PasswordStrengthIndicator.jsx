import { checkPasswordStrength } from '@/lib/validations/auth.validations'
import { cn } from '@/lib/utils'

export default function PasswordStrengthIndicator({ password }) {
  if (!password) return null

  const { score, feedback } = checkPasswordStrength(password)

  const getColor = () => {
    if (score < 2) return 'bg-red-500'
    if (score < 3) return 'bg-orange-500'
    if (score < 4) return 'bg-yellow-500'
    if (score < 5) return 'bg-green-500'
    return 'bg-green-600'
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index < score ? getColor() : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{feedback}</p>
    </div>
  )
}
