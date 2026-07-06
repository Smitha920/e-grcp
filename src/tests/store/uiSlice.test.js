import uiReducer, { toggleTheme, setTheme, toggleSidebar, showAlert, clearAlert, setBreadcrumbs } from '../../store/slices/uiSlice'

const initialState = {
  themeMode: 'light', sidebarCollapsed: false, sidebarMobileOpen: false,
  globalAlert: null, confirmDialog: null, pageLoading: false, breadcrumbs: [],
}

describe('uiSlice', () => {
  it('should have correct initial state', () => {
    expect(uiReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('should toggle theme from light to dark', () => {
    const result = uiReducer(initialState, toggleTheme())
    expect(result.themeMode).toBe('dark')
  })

  it('should toggle theme from dark to light', () => {
    const darkState = { ...initialState, themeMode: 'dark' }
    const result = uiReducer(darkState, toggleTheme())
    expect(result.themeMode).toBe('light')
  })

  it('should set theme explicitly', () => {
    const result = uiReducer(initialState, setTheme('dark'))
    expect(result.themeMode).toBe('dark')
  })

  it('should toggle sidebar collapsed state', () => {
    const result = uiReducer(initialState, toggleSidebar())
    expect(result.sidebarCollapsed).toBe(true)
    const result2 = uiReducer(result, toggleSidebar())
    expect(result2.sidebarCollapsed).toBe(false)
  })

  it('should show and clear global alert', () => {
    const alert = { type: 'success', message: 'Saved!' }
    const withAlert = uiReducer(initialState, showAlert(alert))
    expect(withAlert.globalAlert).toEqual(alert)
    const cleared = uiReducer(withAlert, clearAlert())
    expect(cleared.globalAlert).toBeNull()
  })

  it('should set breadcrumbs', () => {
    const crumbs = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Procurement' }]
    const result = uiReducer(initialState, setBreadcrumbs(crumbs))
    expect(result.breadcrumbs).toEqual(crumbs)
  })
})
