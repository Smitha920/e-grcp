import notificationsData from '../mocks/notifications.json'
const simulateDelay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
let localNotifications = [...notificationsData]

export const notificationService = {
  async getNotifications() {
    await simulateDelay()
    return [...localNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  async markAsRead(id) {
    await simulateDelay(200)
    const n = localNotifications.find((n) => n.id === id)
    if (n) n.read = true
    return id
  },
  async markAllAsRead() {
    await simulateDelay(300)
    localNotifications.forEach((n) => { n.read = true })
    return true
  },
}
