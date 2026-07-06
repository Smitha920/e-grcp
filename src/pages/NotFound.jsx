import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { SearchOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2, textAlign: 'center' }}>
      <SearchOff sx={{ fontSize: 72, color: 'text.disabled' }} />
      <Typography variant="h3" fontWeight={800} color="text.secondary">404</Typography>
      <Typography variant="h6" fontWeight={600}>Page Not Found</Typography>
      <Typography variant="body2" color="text.secondary">The page you are looking for does not exist or has been moved.</Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </Box>
  )
}

export default NotFound
