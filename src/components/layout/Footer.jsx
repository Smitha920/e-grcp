import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'

function Footer() {
  const theme = useTheme()
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} e-GRCP Enterprise Platform. All rights reserved.
      </Typography>
      <Typography variant="caption" color="text.secondary">
        v1.0.0
      </Typography>
    </Box>
  )
}

export default Footer
