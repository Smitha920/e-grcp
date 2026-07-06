import { createTheme } from '@mui/material/styles'

const baseTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  h1: { fontWeight: 700, fontSize: '2rem' },
  h2: { fontWeight: 700, fontSize: '1.75rem' },
  h3: { fontWeight: 600, fontSize: '1.5rem' },
  h4: { fontWeight: 600, fontSize: '1.25rem' },
  h5: { fontWeight: 600, fontSize: '1.1rem' },
  h6: { fontWeight: 600, fontSize: '1rem' },
  body1: { fontSize: '0.875rem' },
  body2: { fontSize: '0.8125rem' },
  caption: { fontSize: '0.75rem' },
}

const baseComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 6,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        fontSize: '0.75rem',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: { main: '#2E7D32', light: '#4CAF50' },
    warning: { main: '#E65100', light: '#FF9800' },
    error: { main: '#C62828', light: '#EF5350' },
    info: { main: '#0277BD', light: '#29B6F6' },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#5A6478',
      disabled: '#9AA3AF',
    },
    divider: '#E5E8ED',
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: baseTypography,
  components: baseComponents,
  shape: { borderRadius: 8 },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#42A5F5',
      light: '#90CAF9',
      dark: '#1565C0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#29B6F6',
      light: '#81D4FA',
      dark: '#0277BD',
    },
    success: { main: '#66BB6A', light: '#A5D6A7' },
    warning: { main: '#FFA726', light: '#FFCC80' },
    error: { main: '#EF5350', light: '#FFCDD2' },
    info: { main: '#29B6F6', light: '#B3E5FC' },
    background: {
      default: '#0F1117',
      paper: '#1A1D27',
    },
    text: {
      primary: '#E8EAF0',
      secondary: '#9AA3AF',
    },
    divider: '#2D3142',
  },
  typography: baseTypography,
  components: {
    ...baseComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: { borderRadius: 8 },
})
