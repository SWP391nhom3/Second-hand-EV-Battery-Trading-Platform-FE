import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/lib/validations/auth.validations'
import authService from '@/api/services/auth.service'

/**
 * UC02: LoginForm Component
 * Form đăng nhập với UI đẹp và mạch lạc
 */
export default function LoginForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const response = await authService.login(data)
      
      authService.saveAuthData(response)

      toast.success('✨ Đăng nhập thành công!')
      
      // Redirect based on role
      if (response.role === 'ADMIN') {
        navigate('/admin')
      } else if (response.role === 'STAFF') {
        navigate('/staff')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)

      // Xử lý hiển thị lỗi chi tiết
      if (error.response) {
        // Lỗi từ server
        const errorMessage = error.response.data?.message || 
                            error.response.data?.title ||
                            error.response.data?.error ||
                            'Tài khoản hoặc mật khẩu không chính xác'
        
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-center'
        })
      } else if (error.request) {
        // Không nhận được response từ server
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.', {
          duration: 4000,
          position: 'top-center'
        })
      } else {
        // Lỗi khác
        toast.error('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.', {
          duration: 4000,
          position: 'top-center'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email or Phone Field */}
        <FormField
          control={form.control}
          name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Email hoặc Số điện thoại <span className="text-red-500">*</span>
                </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="example@email.com hoặc 0987654321"
                    className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...field}
                    disabled={isLoading}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </FormLabel>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...field}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </Button>

        {/* Link to Register */}
        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link 
            to="/auth/register" 
            className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </Form>
  )
}
