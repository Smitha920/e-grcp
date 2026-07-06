import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
  passwordResetSent: false,
  passwordResetSuccess: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    clearPasswordReset: (state) => {
      state.passwordResetSent = false
      state.passwordResetSuccess = false
    },
    sessionExpired: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.role = null
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        return initialState
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null })
      .addCase(forgotPassword.fulfilled, (state) => { state.loading = false; state.passwordResetSent = true })
      .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      // Reset Password
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null })
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false; state.passwordResetSuccess = true })
      .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearError, clearPasswordReset, sessionExpired, updateProfile } = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserRole = (state) => state.auth.role
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
