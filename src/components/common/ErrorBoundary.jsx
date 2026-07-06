import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // In production: send to error tracking (e.g., Sentry)
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', bgcolor: 'background.default', p: 3,
          }}
        >
          <Paper sx={{ p: 5, maxWidth: 520, textAlign: 'center' }}>
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected error occurred. The team has been notified.
              Try refreshing the page or contact support if the problem persists.
            </Typography>
            {import.meta.env.DEV && this.state.error && (
              <Box
                sx={{
                  p: 2, mb: 3, bgcolor: 'error.light', borderRadius: 1,
                  textAlign: 'left', overflow: 'auto', maxHeight: 150,
                }}
              >
                <Typography variant="caption" fontFamily="monospace" color="error.dark">
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" startIcon={<Refresh />} onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="outlined" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </Box>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
