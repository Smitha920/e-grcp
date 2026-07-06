import React, { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, CardHeader, Divider, Button, Typography,
  Tabs, Tab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material'
import { CheckCircle, Cancel, Replay, CallMade } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRequests, updateRequest, selectRequests, selectProcurementLoading } from '../../store/slices/procurementSlice'
import { selectUser } from '../../store/slices/authSlice'
import { showAlert } from '../../store/slices/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from '../../components/common/KpiCard'
import StatusChip from '../../components/common/StatusChip'

function ApprovalWorkbench() {
  const dispatch = useDispatch()
  const requests = useSelector(selectRequests)
  const loading = useSelector(selectProcurementLoading)
  const user = useSelector(selectUser)
  const [tab, setTab] = useState(0)
  const [actionDialog, setActionDialog] = useState(null) // { type, request }
  const [comment, setComment] = useState('')

  const STATUS_TABS = ['pending', 'approved', 'rejected', 'escalated']

  useEffect(() => {
    dispatch(fetchRequests({ status: 'all', pageSize: 100 }))
  }, [dispatch])

  const grouped = STATUS_TABS.reduce((acc, s) => {
    acc[s] = requests.filter((r) => r.status === s)
    return acc
  }, {})

  const handleAction = async () => {
    if (!actionDialog) return
    const { type, request } = actionDialog
    const statusMap = { approve: 'approved', reject: 'rejected', sendback: 'pending', delegate: 'escalated' }
    await dispatch(updateRequest({
      id: request.id,
      payload: {
        status: statusMap[type],
        approvals: [{ level: 1, approver: user?.name, status: statusMap[type], date: new Date().toISOString(), comments: comment }],
      },
    }))
    dispatch(showAlert({ type: 'success', message: `Request ${type}d successfully.` }))
    setActionDialog(null)
    setComment('')
    dispatch(fetchRequests({ status: 'all', pageSize: 100 }))
  }

  const currentItems = grouped[STATUS_TABS[tab]] || []

  return (
    <Box>
      <PageHeader
        title="Approval Workbench"
        subtitle="Review, approve and manage procurement approval queues"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Approvals' }]}
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STATUS_TABS.map((s, i) => (
          <Grid item xs={6} sm={3} key={s}>
            <KpiCard title={s.charAt(0).toUpperCase() + s.slice(1)} value={grouped[s].length} color={['warning', 'success', 'error', 'info'][i]} />
          </Grid>
        ))}
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            {STATUS_TABS.map((s) => (
              <Tab key={s} label={`${s.charAt(0).toUpperCase() + s.slice(1)} (${grouped[s].length})`} />
            ))}
          </Tabs>
        </Box>
        <CardContent>
          {currentItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No {STATUS_TABS[tab]} requests.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {currentItems.map((req) => (
                <Box key={req.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{req.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{req.id} · {req.department} · {req.requestedBy?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <StatusChip status={req.priority} />
                      <Typography variant="body2" fontWeight={700}>{req.currency} {req.amount?.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                  {tab === 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                      <Button size="small" variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => setActionDialog({ type: 'approve', request: req })}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" startIcon={<Cancel />} onClick={() => setActionDialog({ type: 'reject', request: req })}>Reject</Button>
                      <Button size="small" variant="outlined" startIcon={<Replay />} onClick={() => setActionDialog({ type: 'sendback', request: req })}>Send Back</Button>
                      <Button size="small" variant="outlined" color="info" startIcon={<CallMade />} onClick={() => setActionDialog({ type: 'delegate', request: req })}>Delegate</Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={Boolean(actionDialog)} onClose={() => setActionDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textTransform: 'capitalize' }}>
          {actionDialog?.type} Request — {actionDialog?.request?.id}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth multiline rows={3} label="Comments" size="small" sx={{ mt: 1 }}
            value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Add any comments or notes (optional)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleAction} sx={{ textTransform: 'capitalize' }}>
            Confirm {actionDialog?.type}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApprovalWorkbench
