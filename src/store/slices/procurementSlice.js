import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { procurementService } from '../../services/procurementService'

export const fetchRequests = createAsyncThunk(
  'procurement/fetchRequests',
  async (params, { rejectWithValue }) => {
    try {
      return await procurementService.getRequests(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRequestById = createAsyncThunk(
  'procurement/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await procurementService.getRequestById(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createRequest = createAsyncThunk(
  'procurement/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await procurementService.createRequest(payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateRequest = createAsyncThunk(
  'procurement/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await procurementService.updateRequest(id, payload)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    requests: [],
    selectedRequest: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
    filters: { status: 'all', department: 'all', dateRange: null, search: '' },
    sort: { field: 'createdAt', order: 'desc' },
    loading: false,
    error: null,
    submitSuccess: false,
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    setSort: (state, action) => { state.sort = action.payload },
    setPagination: (state, action) => { state.pagination = { ...state.pagination, ...action.payload } },
    clearSelectedRequest: (state) => { state.selectedRequest = null },
    clearSubmitSuccess: (state) => { state.submitSuccess = false },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false
        state.requests = action.payload.data
        state.pagination.total = action.payload.total
      })
      .addCase(fetchRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchRequestById.pending, (state) => { state.loading = true })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedRequest = action.payload
      })
      .addCase(fetchRequestById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createRequest.pending, (state) => { state.loading = true })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false
        state.requests.unshift(action.payload)
        state.submitSuccess = true
      })
      .addCase(createRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateRequest.fulfilled, (state, action) => {
        const idx = state.requests.findIndex(r => r.id === action.payload.id)
        if (idx !== -1) state.requests[idx] = action.payload
        if (state.selectedRequest?.id === action.payload.id) state.selectedRequest = action.payload
      })
  },
})

export const { setFilters, setSort, setPagination, clearSelectedRequest, clearSubmitSuccess, clearError } = procurementSlice.actions

export const selectRequests = (state) => state.procurement.requests
export const selectSelectedRequest = (state) => state.procurement.selectedRequest
export const selectProcurementLoading = (state) => state.procurement.loading
export const selectProcurementFilters = (state) => state.procurement.filters
export const selectProcurementPagination = (state) => state.procurement.pagination

export default procurementSlice.reducer
