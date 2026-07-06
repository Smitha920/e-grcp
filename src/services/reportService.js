import reportsData from '../mocks/reports.json'
const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

export const reportService = {
  async getReports() {
    await simulateDelay()
    return [...reportsData]
  },
  async generateReport(config) {
    await simulateDelay(2000)
    return {
      id: `RPT-${Date.now()}`,
      title: config.title || `${config.type} Report - ${new Date().toLocaleDateString()}`,
      type: config.type,
      generatedBy: config.user,
      generatedAt: new Date().toISOString(),
      status: 'ready',
      filters: config.filters,
      summary: {},
    }
  },
  async exportReport(id, format) {
    await simulateDelay(1000)
    // Simulate file download trigger
    const blob = new Blob([`Report ${id} exported as ${format}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${id}.${format}`
    a.click()
    URL.revokeObjectURL(url)
    return { success: true }
  },
}
