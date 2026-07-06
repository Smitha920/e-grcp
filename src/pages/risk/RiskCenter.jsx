import React, { useEffect } from 'react'
import {
  Box, Grid, Card, CardContent, CardHeader, Divider, Typography,
  Chip, LinearProgress, useTheme
} from '@mui/material'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRisks, fetchRiskStats, fetchRiskMatrix, selectRisks, selectRiskStats, selectRiskLoading } from '../../store/slices/riskSlice'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from '../../components/common/KpiCard'
import DataTable from '../../components/common/DataTable'
import StatusChip from '../../components/common/StatusChip'
import riskData from '../../mocks/riskData.json'

const RISK_COLORS = ['#C62828', '#EF5350', '#FF9800', '#66BB6A']
const SEVERITY_COLORS = { critical: '#C62828', high: '#EF5350', medium: '#FF9800', low: '#66BB6A' }

function RiskCenter() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const risks = useSelector(selectRisks)
  const stats = useSelector(selectRiskStats)
  const loading = useSelector(selectRiskLoading)

  useEffect(() => {
    dispatch(fetchRisks())
    dispatch(fetchRiskStats())
    dispatch(fetchRiskMatrix())
  }, [dispatch])

  const distributionData = [
    { name: 'Critical', value: stats.critical, color: SEVERITY_COLORS.critical },
    { name: 'High', value: stats.high, color: SEVERITY_COLORS.high },
    { name: 'Medium', value: stats.medium, color: SEVERITY_COLORS.medium },
    { name: 'Low', value: stats.low, color: SEVERITY_COLORS.low },
  ]

  const columns = [
    { id: 'id', label: 'ID', width: 90 },
    { id: 'title', label: 'Risk', minWidth: 220 },
    { id: 'category', label: 'Category', width: 120 },
    { id: 'severity', label: 'Severity', width: 100, render: (val) => <StatusChip status={val} /> },
    { id: 'status', label: 'Status', width: 110, render: (val) => <Chip label={val?.replace('_', ' ')} size="small" variant="outlined" /> },
    { id: 'owner', label: 'Owner', width: 130 },
    { id: 'reviewDate', label: 'Review Date', width: 110, render: (val) => new Date(val).toLocaleDateString() },
  ]

  return (
    <Box>
      <PageHeader
        title="Risk Center"
        subtitle="Monitor, analyze and mitigate organizational risks"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Risk Center' }]}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total Risks', value: stats.total, color: 'primary' },
          { title: 'Critical', value: stats.critical, color: 'error' },
          { title: 'High', value: stats.high, color: 'error' },
          { title: 'Open Risks', value: stats.open, color: 'warning' },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.title}><KpiCard {...s} loading={loading} /></Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Risk Distribution Pie */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Risk Distribution" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} subheader="By severity level" subheaderTypographyProps={{ variant: 'caption' }} />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={riskData.distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {riskData.distributionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Risk Trend" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} subheader="6-month risk level history" subheaderTypographyProps={{ variant: 'caption' }} />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={riskData.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" fill={SEVERITY_COLORS.critical} name="Critical" stackId="a" />
                  <Bar dataKey="high" fill={SEVERITY_COLORS.high} name="High" stackId="a" />
                  <Bar dataKey="medium" fill={SEVERITY_COLORS.medium} name="Medium" stackId="a" />
                  <Bar dataKey="low" fill={SEVERITY_COLORS.low} name="Low" stackId="a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Register */}
      <Card>
        <CardHeader title="Risk Register" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} subheader="All identified organizational risks" subheaderTypographyProps={{ variant: 'caption' }} />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <DataTable columns={columns} rows={risks} loading={loading} total={risks.length} emptyMessage="No risks found." />
        </CardContent>
      </Card>
    </Box>
  )
}

export default RiskCenter
