import vendorsData from '../mocks/vendors.json'
const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

const buildComplianceItems = () => {
  const items = []
  const violations = []
  const missingDocuments = []
  const expiredCertifications = []

  vendorsData.forEach((vendor) => {
    vendor.documents.forEach((doc) => {
      const item = { id: doc.id, vendor: vendor.name, vendorId: vendor.id, ...doc }
      items.push(item)
      if (doc.status === 'expired') {
        violations.push(item)
        if (doc.type === 'certification') expiredCertifications.push(item)
        else missingDocuments.push(item)
      }
    })
  })
  return { items, violations, missingDocuments, expiredCertifications }
}

export const complianceService = {
  async getComplianceItems() {
    await simulateDelay()
    return buildComplianceItems()
  },
  async getStats() {
    await simulateDelay(300)
    const { items, violations } = buildComplianceItems()
    return {
      total: items.length,
      compliant: items.filter(i => i.status === 'valid').length,
      violations: violations.length,
      expiredCerts: items.filter(i => i.status === 'expired' && i.type === 'certification').length,
      missingDocs: items.filter(i => i.status === 'expired').length,
    }
  },
}
