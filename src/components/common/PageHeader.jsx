import React from 'react'
import { Box, Typography, Breadcrumbs, Link, useTheme } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 0.5, '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}
        >
          {breadcrumbs.map((crumb, i) =>
            crumb.href && i < breadcrumbs.length - 1 ? (
              <Link
                key={i}
                component="button"
                variant="caption"
                underline="hover"
                color="text.secondary"
                onClick={() => navigate(crumb.href)}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={i} variant="caption" color={i === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{subtitle}</Typography>
          )}
        </Box>
        {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  )
}

export default PageHeader
