import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import StaffDashboardStats from '@/components/staff/dashboard/StaffDashboardStats'
import AssignedLeadsList from '@/components/staff/dashboard/AssignedLeadsList'
import UpcomingAppointmentsList from '@/components/staff/dashboard/UpcomingAppointmentsList'
import staffDashboardService from '@/api/services/staffDashboard.service'

/**
 * StaffDashboard Page
 * Dashboard cho Staff - UC39
 * Module 1: Dashboard Staff
 */
export default function StaffDashboard() {
  const [statistics, setStatistics] = useState(null)
  const [leads, setLeads] = useState([])
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load statistics và data song song
      const [statsData, leadsData, appointmentsData] = await Promise.all([
        staffDashboardService.getDashboardStatistics(),
        staffDashboardService.getAssignedLeads({ pageNumber: 1, pageSize: 10 }),
        staffDashboardService.getUpcomingAppointments({ pageNumber: 1, pageSize: 10 })
      ])

      // Set statistics
      setStatistics(statsData)

      // Set leads
      // Response structure: { success, data: { data: LeadResponse[], totalCount, ... } }
      if (leadsData?.success && leadsData?.data?.data) {
        setLeads(leadsData.data.data)
      }

      // Set appointments
      // Response structure: { success, data: { data: AppointmentResponse[], totalCount, ... } }
      if (appointmentsData?.success && appointmentsData?.data?.data) {
        setAppointments(appointmentsData.data.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Tổng quan công việc của bạn
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <StaffDashboardStats statistics={statistics} isLoading={isLoading} />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Leads List */}
        <AssignedLeadsList leads={leads} isLoading={isLoading} limit={5} />

        {/* Upcoming Appointments List */}
        <UpcomingAppointmentsList
          appointments={appointments}
          isLoading={isLoading}
          limit={5}
        />
      </div>
    </div>
  )
}
