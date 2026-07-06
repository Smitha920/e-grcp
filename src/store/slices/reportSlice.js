import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reportService } from '../../services/reportService'

export const fetchReports = createAsyncThunk('report/fetchReports', async (params, { rejectWithValue }) => {
  try { return await reportService.getReports(params) }
  catch (error) { return rejectWithValue(error.message) }
})

export const generateReport = createAsyncThunk('report/generate', async (config, { rejectWithValue }) => {
  try { return await reportService.generateReport(config) }
  catch (error) { return rejectWithValue(error.message) }
})

export const exportReport = createAsyncThunk('report/export', async ({ id, format }, { rejectWithValue }) => {
  try { return await reportService.exportReport(id, format) }
  catch (error) { return rejectWithValue(error.message) }
})

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    reports: [],
    savedReports: [],
    activeReport: null,
    generating: false,
    exporting: false,
    loading: false,
    error: null,
    filters: { type: 'all', dateRange: null },
  },
  reducers: {
    setActiveReport: (state, action) => { state.activeReport = action.payload },
    setReportFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.loading = true })
      .addCase(fetchReports.fulfilled, (state, action) => { state.loading = false; state.reports = action.payload })
      .addCase(fetchReports.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(generateReport.pending, (state) => { state.generating = true })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.generating = false
        state.activeReport = action.payload
        state.reports.unshift(action.payload)
      })
      .addCase(generateReport.rejected, (state, action) => { state.generating = false; state.error = action.payload })
      .addCase(exportReport.pending, (state) => { state.exporting = true })
      .addCase(exportReport.fulfilled, (state) => { state.exporting = false })
      .addCase(exportReport.rejected, (state, action) => { state.exporting = false; state.error = action.payload })
  },
})

export const { setActiveReport, setReportFilters, clearError } = reportSlice.actions

export const selectReports = (state) => state.report.reports
export const selectActiveReport = (state) => state.report.activeReport
export const selectReportGenerating = (state) => state.report.generating
export const selectReportLoading = (state) => state.report.loading

export default reportSlice.reducer
