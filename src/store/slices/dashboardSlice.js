import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardService } from '../../services/dashboardService'

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getStats()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchActivityFeed = createAsyncThunk(
  'dashboard/fetchActivity',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getActivityFeed()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchCharts',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getChartData()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
      totalVendors: 0,
      activeRisks: 0,
      complianceIssues: 0,
      openAudits: 0,
    },
    activityFeed: [],
    chartData: {
      procurementTrend: [],
      riskTrend: [],
      complianceTrend: [],
      departmentSpending: [],
    },
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearDashboardError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchActivityFeed.fulfilled, (state, action) => {
        state.activityFeed = action.payload
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData = action.payload
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions

export const selectDashboardStats = (state) => state.dashboard.stats
export const selectActivityFeed = (state) => state.dashboard.activityFeed
export const selectChartData = (state) => state.dashboard.chartData
export const selectDashboardLoading = (state) => state.dashboard.loading

export default dashboardSlice.reducer
