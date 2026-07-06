import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    themeMode: 'light',
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    globalAlert: null,         // { type, message }
    confirmDialog: null,       // { title, message, onConfirm }
    pageLoading: false,
    breadcrumbs: [],
  },
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action) => {
      state.themeMode = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    toggleMobileSidebar: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen
    },
    setMobileSidebarOpen: (state, action) => {
      state.sidebarMobileOpen = action.payload
    },
    showAlert: (state, action) => {
      state.globalAlert = action.payload  // { type: 'success'|'error'|'warning'|'info', message }
    },
    clearAlert: (state) => {
      state.globalAlert = null
    },
    showConfirmDialog: (state, action) => {
      state.confirmDialog = action.payload
    },
    closeConfirmDialog: (state) => {
      state.confirmDialog = null
    },
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    },
  },
})

export const {
  toggleTheme, setTheme,
  toggleSidebar, setSidebarCollapsed,
  toggleMobileSidebar, setMobileSidebarOpen,
  showAlert, clearAlert,
  showConfirmDialog, closeConfirmDialog,
  setPageLoading, setBreadcrumbs,
} = uiSlice.actions

export const selectThemeMode = (state) => state.ui.themeMode
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed
export const selectSidebarMobileOpen = (state) => state.ui.sidebarMobileOpen
export const selectGlobalAlert = (state) => state.ui.globalAlert
export const selectConfirmDialog = (state) => state.ui.confirmDialog
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs

export default uiSlice.reducer
