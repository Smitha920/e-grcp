import React, { useEffect, useMemo } from 'react'
import { Grid, Box, Typography, Card, CardContent, CardHeader, Divider, Avatar, Chip, useTheme } from '@mui/material'
import {
  Assignment, HourglassEmpty, CheckCircle, Cancel, Business,
  Warning, VerifiedUser, ManageSearch
} from '@mui/icons-material'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats, fetchActivityFeed, fetchChartData, selectDashboardStats, selectActivityFeed, selectChartData, selectDashboardLoading } from '../../store/slices/dashboardSlice'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from '../../components/common/KpiCard'

const DEPT_COLORS = ['#1565C0', '#0288D1', '#00897B', '#43A047', '#FB8C00', '#E53935']
const RISK_COLORS = { critical: '#C62828', high: '#EF5350', medium: '#FF9800', low: '#66BB6A' }

function ActivityItem({ item }) {
  const iconMap = {
    CheckCircle: <CheckCircle />, Warning: <Warning />, Business: <Business />,
    Error: <Cancel />, Assignment: <Assignment />,
  }
  const colorMap = { success: 'success.main', warning: 'warning.main', info: 'info.main', error: 'error.main', primary: 'primary.main' }

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.25 }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: `${colorMap[item.color]}20`, flexShrink: 0 }}>
        {React.cloneElement(iconMap[item.icon] || <Assignment />, { sx: { fontSize: 16, color: colorMap[item.color] } })}
      </Avatar>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          <strong>{item.user}</strong> {item.action}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(item.timestamp).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  )
}

function Dashboard() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const stats = useSelector(selectDashboardStats)
  const activityFeed = useSelector(selectActivityFeed)
  const chartData = useSelector(selectChartData)
  const loading = useSelector(selectDashboardLoading)

  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchActivityFeed())
    dispatch(fetchChartData())
  }, [dispatch])

  const kpiCards = useMemo(() => [
    { title: 'Total Requests', value: stats.totalRequests, icon: <Assignment />, color: 'primary', trend: 'up', trendValue: '+12% vs last month' },
    { title: 'Pending Approval', value: stats.pendingRequests, icon: <HourglassEmpty />, color: 'warning', trend: 'down', trendValue: '-5% vs last month' },
    { title: 'Approved', value: stats.approvedRequests, icon: <CheckCircle />, color: 'success', trend: 'up', trendValue: '+8% vs last month' },
    { title: 'Rejected', value: stats.rejectedRequests, icon: <Cancel />, color: 'error' },
    { title: 'Total Vendors', value: stats.totalVendors, icon: <Business />, color: 'info' },
    { title: 'Active Risks', value: stats.activeRisks, icon: <Warning />, color: 'warning', trend: 'up', trendValue: '+2 this week' },
    { title: 'Compliance Issues', value: stats.complianceIssues, icon: <VerifiedUser />, color: 'error' },
    { title: 'Open Audits', value: stats.openAudits, icon: <ManageSearch />, color: 'secondary' },
  ], [stats])

  const chartColor = theme.palette.primary.main

  return (
    <Box>
      <PageHeader
        title="Executive Dashboard"
        subtitle="Real-time overview of governance, procurement, and compliance activities"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {kpiCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <KpiCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Procurement Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Monthly Procurement Trend"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              subheader="Requests submitted, approved, and rejected over the last 6 months"
              subheaderTypographyProps={{ variant: 'caption' }}
            />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData.procurementTrend}>
                  <defs>
                    <linearGradient id="gradReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="requests" stroke={theme.palette.primary.main} fill="url(#gradReq)" name="Submitted" />
                  <Area type="monotone" dataKey="approved" stroke={theme.palette.success.main} fill="url(#gradApp)" name="Approved" />
                  <Area type="monotone" dataKey="rejected" stroke={theme.palette.error.main} fill="none" strokeDasharray="5 5" name="Rejected" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Spending */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Department Spending"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              subheader="YTD spend distribution"
              subheaderTypographyProps={{ variant: 'caption' }}
            />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={chartData.departmentSpending} dataKey="amount" nameKey="department" cx="50%" cy="50%" outerRadius={90} label={({ department }) => department}>
                    {chartData.departmentSpending.map((_, i) => (
                      <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `$${(val / 1000).toFixed(0)}K`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={2.5}>
        {/* Risk Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Risk Trend"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              subheader="Risk levels tracked over 6 months"
              subheaderTypographyProps={{ variant: 'caption' }}
            />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData.riskTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" fill={RISK_COLORS.critical} name="Critical" stackId="a" />
                  <Bar dataKey="high" fill={RISK_COLORS.high} name="High" stackId="a" />
                  <Bar dataKey="medium" fill={RISK_COLORS.medium} name="Medium" stackId="a" />
                  <Bar dataKey="low" fill={RISK_COLORS.low} name="Low" stackId="a" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Recent Activity"
              titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              subheader="Latest system events"
              subheaderTypographyProps={{ variant: 'caption' }}
            />
            <Divider />
            <CardContent sx={{ px: 2, py: 0 }}>
              {activityFeed.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <ActivityItem item={item} />
                  {idx < activityFeed.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
