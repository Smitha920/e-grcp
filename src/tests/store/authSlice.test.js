import authReducer, { clearError, sessionExpired, updateProfile } from '../../store/slices/authSlice'

const initialState = {
  user: null, token: null, isAuthenticated: false, role: null,
  loading: false, error: null, passwordResetSent: false, passwordResetSuccess: false,
}

describe('authSlice', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('should clear error', () => {
    const stateWithError = { ...initialState, error: 'Login failed' }
    const result = authReducer(stateWithError, clearError())
    expect(result.error).toBeNull()
  })

  it('should expire session and clear auth', () => {
    const authedState = {
      ...initialState,
      user: { id: 'u001', name: 'Test', role: 'admin' },
      token: 'abc123',
      isAuthenticated: true,
      role: 'admin',
    }
    const result = authReducer(authedState, sessionExpired())
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBeNull()
    expect(result.token).toBeNull()
  })

  it('should update profile', () => {
    const authedState = {
      ...initialState,
      user: { id: 'u001', name: 'Old Name', role: 'employee' },
      isAuthenticated: true,
    }
    const result = authReducer(authedState, updateProfile({ name: 'New Name' }))
    expect(result.user.name).toBe('New Name')
    expect(result.user.role).toBe('employee') // preserved
  })

  it('should set loading on login pending', () => {
    const action = { type: 'auth/login/pending' }
    const result = authReducer(initialState, action)
    expect(result.loading).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should set user on login fulfilled', () => {
    const user = { id: 'u001', name: 'Sarah Johnson', role: 'admin' }
    const action = { type: 'auth/login/fulfilled', payload: { user, token: 'tok123' } }
    const result = authReducer(initialState, action)
    expect(result.isAuthenticated).toBe(true)
    expect(result.user).toEqual(user)
    expect(result.token).toBe('tok123')
    expect(result.role).toBe('admin')
  })

  it('should set error on login rejected', () => {
    const action = { type: 'auth/login/rejected', payload: 'Invalid credentials' }
    const result = authReducer(initialState, action)
    expect(result.error).toBe('Invalid credentials')
    expect(result.loading).toBe(false)
  })
})
