import React from 'react'
import { Card, CardContent, Box, Typography, Skeleton, useTheme } from '@mui/material'
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material'

function KpiCard({ title, value, subtitle, icon, color = 'primary', trend, trendValue, loading }) {
  const theme = useTheme()

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : TrendingFlat
  const trendColor = trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary'

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ my: 0.5, lineHeight: 1 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            )}
            {trendValue !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <TrendIcon sx={{ fontSize: 14, color: trendColor }} />
                <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600 }}>
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 44, height: 44, borderRadius: 2, flexShrink: 0,
                bgcolor: `${color}.main`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.9,
              }}
            >
              {React.cloneElement(icon, { sx: { color: 'white', fontSize: 22 } })}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default React.memo(KpiCard)
