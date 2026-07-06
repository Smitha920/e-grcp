import riskData from '../mocks/riskData.json'
const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

export const riskService = {
  async getRisks() {
    await simulateDelay()
    return riskData.risks
  },
  async getRiskStats() {
    await simulateDelay(300)
    const risks = riskData.risks
    return {
      total: risks.length,
      critical: risks.filter(r => r.severity === 'critical').length,
      high: risks.filter(r => r.severity === 'high').length,
      medium: risks.filter(r => r.severity === 'medium').length,
      low: risks.filter(r => r.severity === 'low').length,
      open: risks.filter(r => r.status === 'open').length,
      inProgress: risks.filter(r => r.status === 'in_progress').length,
    }
  },
  async getRiskMatrix() {
    await simulateDelay(300)
    return riskData.matrixData
  },
  async getTrendData() {
    await simulateDelay(300)
    return riskData.trendData
  },
  async getDistribution() {
    await simulateDelay(300)
    return riskData.distributionData
  },
}
