import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/common/ErrorBoundary'
import PageLoader from './components/common/PageLoader'
import { lightTheme, darkTheme } from './theme'

function App() {
  const themeMode = useSelector((state) => state.ui.themeMode)
  const theme = themeMode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
