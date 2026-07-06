import requestsData from '../mocks/requests.json'
const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

const buildAuditLogs = () => {
  const logs = []
  requestsData.forEach((req) => {
    req.auditLogs?.forEach((log) => {
      logs.push({ id: `${req.id}-${log.action}`, requestId: req.id, ...log })
    })
  })
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const auditService = {
  async getAuditLogs({ page = 0, pageSize = 20 } = {}) {
    await simulateDelay()
    const logs = buildAuditLogs()
    return {
      data: logs.slice(page * pageSize, page * pageSize + pageSize),
      total: logs.length,
    }
  },
  async getUserActivities() {
    await simulateDelay()
    return [
      { id: 1, user: 'Sarah Johnson', action: 'Logged In', module: 'Auth', timestamp: '2024-01-15T09:30:00Z', ip: '192.168.1.10' },
      { id: 2, user: 'Michael Chen', action: 'Approved Request', module: 'Procurement', resourceId: 'PR-2024-001', timestamp: '2024-01-15T10:30:00Z', ip: '192.168.1.22' },
      { id: 3, user: 'Laura Kim', action: 'Created Risk', module: 'Risk', resourceId: 'R-004', timestamp: '2024-01-15T09:15:00Z', ip: '192.168.1.31' },
      { id: 4, user: 'Emily Rodriguez', action: 'Submitted Request', module: 'Procurement', resourceId: 'PR-2024-004', timestamp: '2024-01-14T09:30:00Z', ip: '192.168.1.45' },
    ]
  },
  async generateReport(params) {
    await simulateDelay(1500)
    return {
      id: `AUDIT-RPT-${Date.now()}`,
      title: `Audit Report - ${new Date().toLocaleDateString()}`,
      generatedAt: new Date().toISOString(),
      ...params,
    }
  },
}
