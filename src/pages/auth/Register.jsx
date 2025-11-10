import { Link } from 'react-router-dom'
import RegisterForm from '@/components/auth/RegisterForm'
import SocialLogin from '@/components/auth/SocialLogin'
import { Car, ShoppingCart, Battery, CheckCircle } from 'lucide-react'

/**
 * Register Page - UI đẹp với bố cục mạch lạc
 */
export default function Register() {
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
                  Tham gia cộng đồng<br />
                  <span className="text-primary">Xe điện</span> hàng đầu
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Mua bán xe điện và pin xe điện dễ dàng, an toàn với EVehicle
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hơn 10,000+ xe điện</h3>
                    <p className="text-sm text-gray-600">Đang được giao dịch mỗi ngày</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Battery className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Pin chất lượng cao</h3>
                    <p className="text-sm text-gray-600">Bảo hành rõ ràng, an tâm sử dụng</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Kiểm định chuyên nghiệp</h3>
                    <p className="text-sm text-gray-600">Đội ngũ kỹ thuật giàu kinh nghiệm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7 border border-gray-100">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-5">
                  <Link to="/" className="inline-flex items-center gap-2 text-primary">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Car className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold">EVehicle</span>
                  </Link>
                </div>

                {/* Form Header */}
                <div className="text-center mb-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Đăng ký tài khoản
                  </h2>
                  <p className="text-xs text-gray-600">
                    Tạo tài khoản để bắt đầu mua bán xe điện
                  </p>
                </div>

                {/* Register Form */}
                <RegisterForm />

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Hoặc đăng ký với</span>
                  </div>
                </div>

                {/* Social Login */}
                <SocialLogin />

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 mt-5">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
