import vendorsData from '../mocks/vendors.json'

const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

export const vendorService = {
  async getVendors({ status = 'all', riskLevel = 'all', search = '', page = 0, pageSize = 10 } = {}) {
    await simulateDelay()
    let filtered = [...vendorsData]
    if (status !== 'all') filtered = filtered.filter((v) => v.status === status)
    if (riskLevel !== 'all') filtered = filtered.filter((v) => v.riskLevel === riskLevel)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((v) => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q))
    }
    const total = filtered.length
    const data = filtered.slice(page * pageSize, page * pageSize + pageSize)
    return { data, total }
  },

  async getVendorById(id) {
    await simulateDelay()
    const vendor = vendorsData.find((v) => v.id === id)
    if (!vendor) throw new Error(`Vendor ${id} not found`)
    return vendor
  },

  async getVendorStats() {
    await simulateDelay(300)
    return {
      total: vendorsData.length,
      active: vendorsData.filter((v) => v.status === 'active').length,
      inactive: vendorsData.filter((v) => v.status === 'inactive').length,
      underReview: vendorsData.filter((v) => v.status === 'under_review').length,
      highRisk: vendorsData.filter((v) => v.riskLevel === 'high').length,
      mediumRisk: vendorsData.filter((v) => v.riskLevel === 'medium').length,
      lowRisk: vendorsData.filter((v) => v.riskLevel === 'low').length,
    }
  },
}
