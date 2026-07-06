import React, { useEffect } from 'react'
import { Box, Grid, Card, CardContent, CardHeader, Divider, Alert, AlertTitle } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComplianceItems, fetchComplianceStats, selectComplianceItems, selectComplianceStats, selectComplianceLoading, selectViolations } from '../../store/slices/complianceSlice'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from '../../components/common/KpiCard'
import DataTable from '../../components/common/DataTable'
import StatusChip from '../../components/common/StatusChip'

function ComplianceCenter() {
  const dispatch = useDispatch()
  const items = useSelector(selectComplianceItems)
  const stats = useSelector(selectComplianceStats)
  const violations = useSelector(selectViolations)
  const loading = useSelector(selectComplianceLoading)

  useEffect(() => {
    dispatch(fetchComplianceItems())
    dispatch(fetchComplianceStats())
  }, [dispatch])

  const columns = [
    { id: 'vendor', label: 'Vendor', minWidth: 180 },
    { id: 'name', label: 'Document', minWidth: 200 },
    { id: 'type', label: 'Type', width: 130 },
    { id: 'status', label: 'Status', width: 120, render: (val) => <StatusChip status={val} /> },
    { id: 'expiry', label: 'Expiry', width: 110, render: (val) => new Date(val).toLocaleDateString() },
  ]

  return (
    <Box>
      <PageHeader
        title="Compliance Center"
        subtitle="Monitor vendor and organizational compliance status"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Compliance' }]}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total Documents', value: stats.total, color: 'primary' },
          { title: 'Compliant', value: stats.compliant, color: 'success' },
          { title: 'Violations', value: stats.violations, color: 'error' },
          { title: 'Expired Certs', value: stats.expiredCerts, color: 'warning' },
        ].map((s) => <Grid item xs={6} sm={3} key={s.title}><KpiCard {...s} loading={loading} /></Grid>)}
      </Grid>

      {violations.length > 0 && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          <AlertTitle>Compliance Violations Detected</AlertTitle>
          {violations.length} document(s) are expired or non-compliant. Immediate attention required.
        </Alert>
      )}

      <Card>
        <CardHeader title="Compliance Monitoring" titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }} />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <DataTable columns={columns} rows={items} loading={loading} total={items.length} emptyMessage="No compliance records found." />
        </CardContent>
      </Card>
    </Box>
  )
}

export default ComplianceCenter
