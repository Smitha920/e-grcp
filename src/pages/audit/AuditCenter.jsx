import React, { useEffect } from 'react'
import { Box, Grid, Card, CardContent, CardHeader, Divider, Button, Chip, CircularProgress } from '@mui/material'
import { Download } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuditLogs, fetchUserActivities, generateAuditReport, selectAuditLogs, selectUserActivities, selectAuditLoading } from '../../store/slices/auditSlice'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'

function AuditCenter() {
  const dispatch = useDispatch()
  const logs = useSelector(selectAuditLogs)
  const activities = useSelector(selectUserActivities)
  const loading = useSelector(selectAuditLoading)

  useEffect(() => {
    dispatch(fetchAuditLogs())
    dispatch(fetchUserActivities())
  }, [dispatch])

  const logColumns = [
    { id: 'requestId', label: 'Resource', width: 130 },
    { id: 'action', label: 'Action', width: 120, render: (val) => <Chip label={val} size="small" variant="outlined" /> },
    { id: 'user', label: 'User', width: 180 },
    { id: 'timestamp', label: 'Timestamp', width: 160, render: (val) => new Date(val).toLocaleString() },
  ]

  const activityColumns = [
    { id: 'user', label: 'User', width: 160 },
    { id: 'action', label: 'Action', width: 200 },
    { id: 'module', label: 'Module', width: 120 },
    { id: 'ip', label: 'IP Address', width: 130 },
    { id: 'timestamp', label: 'Timestamp', width: 160, render: (val) => new Date(val).toLocaleString() },
  ]

  return (
    <Box>
      <PageHeader
        title="Audit Center"
        subtitle="Complete audit trail and user activity logs"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Audit' }]}
        actions={
          <Button variant="outlined" startIcon={<Download />} size="small"
            onClick={() => dispatch(generateAuditReport({ type: 'full', user: 'Admin' }))}>
            Generate Report
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card sx={{ mb: 2.5 }}>
            <CardHeader title="Audit History" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} subheader="All tracked actions on procurement requests" subheaderTypographyProps={{ variant: 'caption' }} />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <DataTable columns={logColumns} rows={logs} loading={loading} total={logs.length} emptyMessage="No audit logs found." />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="User Activity" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} subheader="Recent user actions on the platform" subheaderTypographyProps={{ variant: 'caption' }} />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <DataTable columns={activityColumns} rows={activities} loading={loading} total={activities.length} emptyMessage="No user activities." />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AuditCenter
