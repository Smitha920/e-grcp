import React from 'react'
import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import { AccessTime } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function SessionExpired() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#EEF2F7', p: 2 }}>
      <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <AccessTime sx={{ fontSize: 56, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>Session Expired</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your session has expired due to inactivity. Please sign in again to continue.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => navigate('/login')}>Sign In Again</Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SessionExpired
