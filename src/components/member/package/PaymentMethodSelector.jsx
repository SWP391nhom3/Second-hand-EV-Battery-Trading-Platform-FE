import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, Smartphone, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * PaymentMethodSelector Component
 * Chọn phương thức thanh toán
 */
export default function PaymentMethodSelector({ value, onChange }) {
  const paymentMethods = [
    {
      id: 'PAYOS',
      name: 'PayOS',
      description: 'Thanh toán qua PayOS',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ]

  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {paymentMethods.map((method) => {
        const Icon = method.icon
        const isSelected = value === method.id
        return (
          <Label
            key={method.id}
            htmlFor={method.id}
            className={cn(
              "flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all",
              isSelected 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-muted/50"
            )}
          >
            <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
            <div className={cn("p-3 rounded-lg", method.bgColor)}>
              <Icon className={cn("h-6 w-6", method.color)} />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{method.name}</div>
              <div className="text-sm text-muted-foreground">
                {method.description}
              </div>
            </div>
          </Label>
        )
      })}
    </RadioGroup>
  )
}

