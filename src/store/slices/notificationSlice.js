import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationService } from '../../services/notificationService'

export const fetchNotifications = createAsyncThunk('notification/fetch', async (_, { rejectWithValue }) => {
  try { return await notificationService.getNotifications() }
  catch (error) { return rejectWithValue(error.message) }
})

export const markAsRead = createAsyncThunk('notification/markRead', async (id, { rejectWithValue }) => {
  try { return await notificationService.markAsRead(id) }
  catch (error) { return rejectWithValue(error.message) }
})

export const markAllAsRead = createAsyncThunk('notification/markAllRead', async (_, { rejectWithValue }) => {
  try { return await notificationService.markAllAsRead() }
  catch (error) { return rejectWithValue(error.message) }
})

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) state.unreadCount += 1
    },
    clearAll: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.read).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find(n => n.id === action.payload)
        if (n && !n.read) {
          n.read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.read = true })
        state.unreadCount = 0
      })
  },
})

export const { addNotification, clearAll } = notificationSlice.actions

export const selectNotifications = (state) => state.notification.notifications
export const selectUnreadCount = (state) => state.notification.unreadCount
export const selectNotificationLoading = (state) => state.notification.loading

export default notificationSlice.reducer
