import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auditService } from '../../services/auditService'

export const fetchAuditLogs = createAsyncThunk('audit/fetchLogs', async (params, { rejectWithValue }) => {
  try { return await auditService.getAuditLogs(params) }
  catch (error) { return rejectWithValue(error.message) }
})

export const fetchUserActivities = createAsyncThunk('audit/fetchUserActivities', async (params, { rejectWithValue }) => {
  try { return await auditService.getUserActivities(params) }
  catch (error) { return rejectWithValue(error.message) }
})

export const generateAuditReport = createAsyncThunk('audit/generateReport', async (params, { rejectWithValue }) => {
  try { return await auditService.generateReport(params) }
  catch (error) { return rejectWithValue(error.message) }
})

const auditSlice = createSlice({
  name: 'audit',
  initialState: {
    logs: [],
    userActivities: [],
    systemLogs: [],
    reports: [],
    pagination: { page: 0, pageSize: 20, total: 0 },
    filters: { action: 'all', module: 'all', dateRange: null, userId: null },
    loading: false,
    reportGenerating: false,
    error: null,
  },
  reducers: {
    setAuditFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    setPagination: (state, action) => { state.pagination = { ...state.pagination, ...action.payload } },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => { state.loading = true })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload.data
        state.pagination.total = action.payload.total
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchUserActivities.fulfilled, (state, action) => { state.userActivities = action.payload })
      .addCase(generateAuditReport.pending, (state) => { state.reportGenerating = true })
      .addCase(generateAuditReport.fulfilled, (state, action) => {
        state.reportGenerating = false
        state.reports.unshift(action.payload)
      })
      .addCase(generateAuditReport.rejected, (state, action) => { state.reportGenerating = false; state.error = action.payload })
  },
})

export const { setAuditFilters, setPagination, clearError } = auditSlice.actions

export const selectAuditLogs = (state) => state.audit.logs
export const selectUserActivities = (state) => state.audit.userActivities
export const selectAuditLoading = (state) => state.audit.loading
export const selectAuditFilters = (state) => state.audit.filters

export default auditSlice.reducer
