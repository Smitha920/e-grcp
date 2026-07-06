import usersData from '../mocks/users.json'

const simulateDelay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

const generateToken = (user) => {
  // Simulate JWT-like token (not real JWT — mock only)
  return btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))
}

export const authService = {
  async login({ email, password }) {
    await simulateDelay()
    const user = usersData.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) {
      throw new Error('Invalid email or password. Please try again.')
    }
    if (user.status !== 'active') {
      throw new Error('Your account has been deactivated. Contact your administrator.')
    }
    const { password: _pwd, ...safeUser } = user
    return {
      user: safeUser,
      token: generateToken(safeUser),
    }
  },

  async logout() {
    await simulateDelay(200)
    return true
  },

  async forgotPassword(email) {
    await simulateDelay()
    const user = usersData.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      throw new Error('No account found with this email address.')
    }
    return { message: `Password reset link sent to ${email}` }
  },

  async resetPassword({ token, password }) {
    await simulateDelay()
    // In real app, validate token server-side
    if (!token || !password) {
      throw new Error('Invalid reset request.')
    }
    return { message: 'Password successfully reset.' }
  },

  async refreshToken(token) {
    await simulateDelay(200)
    return { token: token + '_refreshed' }
  },
}
