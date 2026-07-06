import { authService } from '../../services/authService'

describe('authService', () => {
  it('should return user and token on valid login', async () => {
    const result = await authService.login({ email: 'sarah.johnson@company.com', password: 'Admin@123' })
    expect(result.user).toBeDefined()
    expect(result.user.email).toBe('sarah.johnson@company.com')
    expect(result.user.role).toBe('admin')
    expect(result.token).toBeTruthy()
    // Password must not be exposed
    expect(result.user.password).toBeUndefined()
  })

  it('should throw on invalid credentials', async () => {
    await expect(authService.login({ email: 'wrong@email.com', password: 'wrongpwd' }))
      .rejects.toThrow('Invalid email or password')
  })

  it('should throw on wrong password', async () => {
    await expect(authService.login({ email: 'sarah.johnson@company.com', password: 'wrong' }))
      .rejects.toThrow()
  })

  it('should resolve forgot password for valid email', async () => {
    const result = await authService.forgotPassword('sarah.johnson@company.com')
    expect(result.message).toContain('reset link sent')
  })

  it('should throw forgot password for unknown email', async () => {
    await expect(authService.forgotPassword('nobody@nowhere.com'))
      .rejects.toThrow('No account found')
  })

  it('should resolve reset password with valid token', async () => {
    const result = await authService.resetPassword({ token: 'valid-token', password: 'NewPass@123' })
    expect(result.message).toContain('successfully reset')
  })
})
