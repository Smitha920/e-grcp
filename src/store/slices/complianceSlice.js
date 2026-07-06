import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { complianceService } from '../../services/complianceService'

export const fetchComplianceItems = createAsyncThunk('compliance/fetchItems', async (params, { rejectWithValue }) => {
  try { return await complianceService.getComplianceItems(params) }
  catch (error) { return rejectWithValue(error.message) }
})

export const fetchComplianceStats = createAsyncThunk('compliance/fetchStats', async (_, { rejectWithValue }) => {
  try { return await complianceService.getStats() }
  catch (error) { return rejectWithValue(error.message) }
})

const complianceSlice = createSlice({
  name: 'compliance',
  initialState: {
    items: [],
    violations: [],
    missingDocuments: [],
    expiredCertifications: [],
    stats: { total: 0, compliant: 0, violations: 0, expiredCerts: 0, missingDocs: 0 },
    filters: { status: 'all', category: 'all', search: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setComplianceFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceItems.pending, (state) => { state.loading = true })
      .addCase(fetchComplianceItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.violations = action.payload.violations || []
        state.missingDocuments = action.payload.missingDocuments || []
        state.expiredCertifications = action.payload.expiredCertifications || []
      })
      .addCase(fetchComplianceItems.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchComplianceStats.fulfilled, (state, action) => { state.stats = action.payload })
  },
})

export const { setComplianceFilters, clearError } = complianceSlice.actions

export const selectComplianceItems = (state) => state.compliance.items
export const selectComplianceStats = (state) => state.compliance.stats
export const selectComplianceLoading = (state) => state.compliance.loading
export const selectViolations = (state) => state.compliance.violations

export default complianceSlice.reducer
