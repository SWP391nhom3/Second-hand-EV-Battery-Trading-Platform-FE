import React from 'react'
import { useRouteError, useNavigate } from 'react-router-dom'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Error Page Component
 * Displays when a route-level error occurs
 */
const ErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  console.error('Route error:', error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Có lỗi xảy ra
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error?.statusText || error?.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'}
        </p>

        {/* Show error details in development mode */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm font-semibold text-red-800 mb-2">
              Chi tiết lỗi (development only):
            </p>
            <pre className="text-xs text-red-700 overflow-auto max-h-40">
              {error.stack || JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Trang chủ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
