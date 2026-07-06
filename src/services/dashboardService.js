import requestsData from '../mocks/requests.json'
import vendorsData from '../mocks/vendors.json'
import riskData from '../mocks/riskData.json'

const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const dashboardService = {
  async getStats() {
    await simulateDelay()
    const total = requestsData.length
    const pending = requestsData.filter((r) => r.status === 'pending').length
    const approved = requestsData.filter((r) => r.status === 'approved').length
    const rejected = requestsData.filter((r) => r.status === 'rejected').length
    const vendors = vendorsData.length
    const activeRisks = riskData.risks.filter((r) => r.status === 'open').length
    const criticalRisks = riskData.risks.filter((r) => r.severity === 'critical').length

    return {
      totalRequests: total,
      pendingRequests: pending,
      approvedRequests: approved,
      rejectedRequests: rejected,
      totalVendors: vendors,
      activeRisks,
      criticalRisks,
      complianceIssues: 7,
      openAudits: 3,
    }
  },

  async getActivityFeed() {
    await simulateDelay(400)
    return [
      { id: 1, type: 'approval', user: 'Michael Chen', action: 'approved PR-2024-001', timestamp: '2024-01-15T10:30:00Z', icon: 'CheckCircle', color: 'success' },
      { id: 2, type: 'risk', user: 'Laura Kim', action: 'raised new risk R-004', timestamp: '2024-01-15T09:15:00Z', icon: 'Warning', color: 'warning' },
      { id: 3, type: 'vendor', user: 'Sarah Johnson', action: 'onboarded vendor TechSupply Corp', timestamp: '2024-01-14T16:00:00Z', icon: 'Business', color: 'info' },
      { id: 4, type: 'compliance', user: 'Laura Kim', action: 'flagged expired GDPR doc for v002', timestamp: '2024-01-14T14:30:00Z', icon: 'Error', color: 'error' },
      { id: 5, type: 'request', user: 'Emily Rodriguez', action: 'submitted PR-2024-004', timestamp: '2024-01-14T09:30:00Z', icon: 'Assignment', color: 'primary' },
    ]
  },

  async getChartData() {
    await simulateDelay(600)
    return {
      procurementTrend: [
        { month: 'Aug', requests: 32, approved: 28, rejected: 4 },
        { month: 'Sep', requests: 45, approved: 38, rejected: 7 },
        { month: 'Oct', requests: 38, approved: 31, rejected: 7 },
        { month: 'Nov', requests: 52, approved: 43, rejected: 9 },
        { month: 'Dec', requests: 29, approved: 24, rejected: 5 },
        { month: 'Jan', requests: 5, approved: 1, rejected: 1 },
      ],
      riskTrend: riskData.trendData,
      complianceTrend: [
        { month: 'Aug', compliant: 88, violations: 12 },
        { month: 'Sep', compliant: 85, violations: 15 },
        { month: 'Oct', compliant: 90, violations: 10 },
        { month: 'Nov', compliant: 82, violations: 18 },
        { month: 'Dec', compliant: 86, violations: 14 },
        { month: 'Jan', compliant: 83, violations: 17 },
      ],
      departmentSpending: [
        { department: 'IT', amount: 520000 },
        { department: 'Finance', amount: 180000 },
        { department: 'HR', amount: 95000 },
        { department: 'Marketing', amount: 145000 },
        { department: 'Operations', amount: 320000 },
        { department: 'Legal', amount: 75000 },
      ],
    }
  },
}
