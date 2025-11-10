import { Link } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm'
import SocialLogin from '@/components/auth/SocialLogin'
import { Car, FileText, MessageCircle, Star } from 'lucide-react'

/**
 * Login Page - UI đẹp với bố cục mạch lạc
 */
export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Branding */}
            <div className="hidden lg:block space-y-8">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-3 text-primary">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Car className="h-8 w-8" />
                </div>
                <span className="text-3xl font-bold">EVehicle</span>
              </Link>

              {/* Hero Content */}
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Chào mừng<br />
                  <span className="text-primary">trở lại!</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Đăng nhập để tiếp tục mua bán xe điện và pin xe điện
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quản lý tin đăng</h3>
                    <p className="text-sm text-gray-600">Đăng bán xe và pin dễ dàng</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Nhắn tin trực tiếp</h3>
                    <p className="text-sm text-gray-600">Chat với người mua/bán</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lịch sử giao dịch</h3>
                    <p className="text-sm text-gray-600">Theo dõi đơn hàng của bạn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <Link to="/" className="inline-flex items-center gap-2 text-primary">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Car className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold">EVehicle</span>
                  </Link>
                </div>

                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Đăng nhập
                  </h2>
                  <p className="text-gray-600">
                    Nhập thông tin để tiếp tục
                  </p>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập với</span>
                  </div>
                </div>

                {/* Social Login */}
                <SocialLogin />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
