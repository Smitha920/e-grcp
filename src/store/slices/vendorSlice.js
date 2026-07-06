import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { vendorService } from '../../services/vendorService'

export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (params, { rejectWithValue }) => {
    try {
      return await vendorService.getVendors(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorById(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchVendorStats = createAsyncThunk(
  'vendor/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorStats()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    selectedVendor: null,
    stats: { total: 0, active: 0, inactive: 0, highRisk: 0 },
    pagination: { page: 0, pageSize: 10, total: 0 },
    filters: { status: 'all', riskLevel: 'all', category: 'all', search: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setVendorFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    setPagination: (state, action) => { state.pagination = { ...state.pagination, ...action.payload } },
    clearSelectedVendor: (state) => { state.selectedVendor = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => { state.loading = true })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false
        state.vendors = action.payload.data
        state.pagination.total = action.payload.total
      })
      .addCase(fetchVendors.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchVendorById.pending, (state) => { state.loading = true })
      .addCase(fetchVendorById.fulfilled, (state, action) => { state.loading = false; state.selectedVendor = action.payload })
      .addCase(fetchVendorById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchVendorStats.fulfilled, (state, action) => { state.stats = action.payload })
  },
})

export const { setVendorFilters, setPagination, clearSelectedVendor, clearError } = vendorSlice.actions

export const selectVendors = (state) => state.vendor.vendors
export const selectSelectedVendor = (state) => state.vendor.selectedVendor
export const selectVendorStats = (state) => state.vendor.stats
export const selectVendorLoading = (state) => state.vendor.loading
export const selectVendorFilters = (state) => state.vendor.filters

export default vendorSlice.reducer
