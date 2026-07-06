import requestsData from '../mocks/requests.json'

const simulateDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms))
let localRequests = [...requestsData]

export const procurementService = {
  async getRequests({ status = 'all', search = '', page = 0, pageSize = 10 } = {}) {
    await simulateDelay()
    let filtered = [...localRequests]
    if (status !== 'all') filtered = filtered.filter((r) => r.status === status)
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      )
    }
    const total = filtered.length
    const data = filtered.slice(page * pageSize, page * pageSize + pageSize)
    return { data, total }
  },

  async getRequestById(id) {
    await simulateDelay()
    const req = localRequests.find((r) => r.id === id)
    if (!req) throw new Error(`Request ${id} not found`)
    return req
  },

  async createRequest(payload) {
    await simulateDelay(800)
    const newReq = {
      ...payload,
      id: `PR-2024-${String(localRequests.length + 1).padStart(3, '0')}`,
      status: 'pending',
      approvals: [],
      comments: [],
      auditLogs: [{ action: 'CREATED', user: payload.requestedBy?.name, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    localRequests.unshift(newReq)
    return newReq
  },

  async updateRequest(id, payload) {
    await simulateDelay()
    const idx = localRequests.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Request ${id} not found`)
    localRequests[idx] = { ...localRequests[idx], ...payload, updatedAt: new Date().toISOString() }
    return localRequests[idx]
  },

  async approveRequest(id, { approver, comments }) {
    await simulateDelay(600)
    return this.updateRequest(id, {
      status: 'approved',
      approvals: [{ level: 1, approver, status: 'approved', date: new Date().toISOString(), comments }],
    })
  },

  async rejectRequest(id, { approver, comments }) {
    await simulateDelay(600)
    return this.updateRequest(id, {
      status: 'rejected',
      approvals: [{ level: 1, approver, status: 'rejected', date: new Date().toISOString(), comments }],
    })
  },
}
