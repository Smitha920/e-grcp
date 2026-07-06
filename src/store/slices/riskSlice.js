import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { riskService } from '../../services/riskService'

export const fetchRisks = createAsyncThunk('risk/fetchRisks', async (params, { rejectWithValue }) => {
  try { return await riskService.getRisks(params) }
  catch (error) { return rejectWithValue(error.message) }
})

export const fetchRiskStats = createAsyncThunk('risk/fetchStats', async (_, { rejectWithValue }) => {
  try { return await riskService.getRiskStats() }
  catch (error) { return rejectWithValue(error.message) }
})

export const fetchRiskMatrix = createAsyncThunk('risk/fetchMatrix', async (_, { rejectWithValue }) => {
  try { return await riskService.getRiskMatrix() }
  catch (error) { return rejectWithValue(error.message) }
})

const riskSlice = createSlice({
  name: 'risk',
  initialState: {
    risks: [],
    stats: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
    matrixData: [],
    trendData: [],
    distributionData: [],
    filters: { severity: 'all', category: 'all', status: 'all', search: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setRiskFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRisks.pending, (state) => { state.loading = true })
      .addCase(fetchRisks.fulfilled, (state, action) => { state.loading = false; state.risks = action.payload })
      .addCase(fetchRisks.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchRiskStats.fulfilled, (state, action) => { state.stats = action.payload })
      .addCase(fetchRiskMatrix.fulfilled, (state, action) => { state.matrixData = action.payload })
  },
})

export const { setRiskFilters, clearError } = riskSlice.actions

export const selectRisks = (state) => state.risk.risks
export const selectRiskStats = (state) => state.risk.stats
export const selectRiskMatrix = (state) => state.risk.matrixData
export const selectRiskLoading = (state) => state.risk.loading

export default riskSlice.reducer
