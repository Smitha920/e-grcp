import React, { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, CardHeader, Divider, Typography, Chip,
  Tab, Tabs, Button, CircularProgress, Alert
} from '@mui/material'
import { ArrowBack, CheckCircle, Cancel, SendAndArchive } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchRequestById, selectSelectedRequest, selectProcurementLoading } from '../../store/slices/procurementSlice'
import PageHeader from '../../components/common/PageHeader'
import StatusChip from '../../components/common/StatusChip'
import PageLoader from '../../components/common/PageLoader'

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
}

function ProcurementDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const request = useSelector(selectSelectedRequest)
  const loading = useSelector(selectProcurementLoading)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    dispatch(fetchRequestById(id))
  }, [dispatch, id])

  if (loading && !request) return <PageLoader />
  if (!request) return <Alert severity="error">Request not found.</Alert>

  return (
    <Box>
      <PageHeader
        title={request.title}
        subtitle={`Request ID: ${request.id}`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Procurement', href: '/procurement' }, { label: request.id }]}
        actions={
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/procurement')} size="small" variant="outlined">
            Back
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        {/* Main content */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
                <Tab label="Overview" />
                <Tab label="Attachments" />
                <Tab label="Approval History" />
                <Tab label="Comments" />
                <Tab label="Audit Logs" />
              </Tabs>
            </Box>

            <CardContent>
              <TabPanel value={tab} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Status</Typography><Box><StatusChip status={request.status} /></Box></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Priority</Typography><Box><StatusChip status={request.priority} /></Box></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Department</Typography><Typography variant="body2">{request.department}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Category</Typography><Typography variant="body2">{request.category}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Amount</Typography><Typography variant="body2" fontWeight={600}>{request.currency} {request.amount?.toLocaleString()}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="caption" color="text.secondary">Vendor</Typography><Typography variant="body2">{request.vendor?.name}</Typography></Grid>
                  <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                  <Grid item xs={12}><Typography variant="caption" color="text.secondary">Description</Typography><Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>{request.description}</Typography></Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tab} index={1}>
                {request.attachments?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No attachments.</Typography>
                ) : (
                  request.attachments?.map((a) => (
                    <Box key={a.id} sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>{a.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{(a.size / 1000).toFixed(1)} KB</Typography>
                    </Box>
                  ))
                )}
              </TabPanel>

              <TabPanel value={tab} index={2}>
                {request.approvals?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No approvals yet.</Typography>
                ) : (
                  request.approvals?.map((a, i) => (
                    <Box key={i} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>Level {a.level} — {a.approver}</Typography>
                        <StatusChip status={a.status} />
                      </Box>
                      {a.comments && <Typography variant="body2" color="text.secondary">{a.comments}</Typography>}
                      <Typography variant="caption" color="text.secondary">{new Date(a.date).toLocaleString()}</Typography>
                    </Box>
                  ))
                )}
              </TabPanel>

              <TabPanel value={tab} index={3}>
                {request.comments?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
                ) : (
                  request.comments?.map((c) => (
                    <Box key={c.id} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, mb: 1 }}>
                      <Typography variant="caption" fontWeight={600}>{c.user}</Typography>
                      <Typography variant="body2">{c.text}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
                    </Box>
                  ))
                )}
              </TabPanel>

              <TabPanel value={tab} index={4}>
                {request.auditLogs?.map((log, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Chip label={log.action} size="small" variant="outlined" sx={{ minWidth: 90 }} />
                    <Typography variant="body2">{log.user}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>{new Date(log.timestamp).toLocaleString()}</Typography>
                  </Box>
                ))}
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardHeader title="Request Info" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }} />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box><Typography variant="caption" color="text.secondary">Requested By</Typography><Typography variant="body2">{request.requestedBy?.name}</Typography></Box>
                <Box><Typography variant="caption" color="text.secondary">Department</Typography><Typography variant="body2">{request.requestedBy?.department}</Typography></Box>
                <Box><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(request.createdAt).toLocaleDateString()}</Typography></Box>
                <Box><Typography variant="caption" color="text.secondary">Last Updated</Typography><Typography variant="body2">{new Date(request.updatedAt).toLocaleDateString()}</Typography></Box>
              </Box>
            </CardContent>
          </Card>

          {request.status === 'pending' && (
            <Card>
              <CardHeader title="Actions" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }} />
              <Divider />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" color="success" startIcon={<CheckCircle />} fullWidth size="small">Approve</Button>
                <Button variant="outlined" color="error" startIcon={<Cancel />} fullWidth size="small">Reject</Button>
                <Button variant="outlined" startIcon={<SendAndArchive />} fullWidth size="small">Send Back</Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProcurementDetail
