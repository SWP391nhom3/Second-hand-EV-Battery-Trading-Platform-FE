import { Battery, Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * BatteryManagement Component
 * Quản lý danh sách pin điện
 */
export default function BatteryManagement() {
  // Mock data
  const batteries = [
    { id: 1, brand: 'Panasonic', capacity: '60kWh', voltage: '400V', price: '180,000,000', status: 'Đang bán', seller: 'Nguyễn Văn E' },
    { id: 2, brand: 'LG Chem', capacity: '75kWh', voltage: '350V', price: '220,000,000', status: 'Chờ kiểm định', seller: 'Trần Văn F' },
    { id: 3, brand: 'CATL', capacity: '50kWh', voltage: '380V', price: '150,000,000', status: 'Đã bán', seller: 'Lê Thị G' },
    { id: 4, brand: 'Samsung SDI', capacity: '80kWh', voltage: '400V', price: '250,000,000', status: 'Đang bán', seller: 'Phạm Văn H' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý pin điện</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả pin điện trên hệ thống</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm pin mới
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Tìm kiếm theo hãng, dung lượng, chủ sở hữu..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dung lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điện áp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ sở hữu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batteries.map((battery) => (
                <tr key={battery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Battery className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{battery.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {battery.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {battery.voltage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {battery.price}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      battery.status === 'Đang bán' ? 'bg-green-100 text-green-800' :
                      battery.status === 'Chờ kiểm định' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {battery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {battery.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">Chi tiết</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Hiển thị 1-4 trong tổng số 4 pin</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Trước</Button>
          <Button variant="outline" size="sm">Sau</Button>
        </div>
      </div>
    </div>
  )
}
