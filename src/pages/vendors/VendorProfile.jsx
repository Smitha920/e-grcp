import React, { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, CardHeader, Divider, Typography,
  Tabs, Tab, Button, Avatar, Chip, LinearProgress, Alert
} from '@mui/material'
import { ArrowBack, Business } from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorById, selectSelectedVendor, selectVendorLoading } from '../../store/slices/vendorSlice'
import PageHeader from '../../components/common/PageHeader'
import StatusChip from '../../components/common/StatusChip'
import PageLoader from '../../components/common/PageLoader'

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
}

function VendorProfile() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const vendor = useSelector(selectSelectedVendor)
  const loading = useSelector(selectVendorLoading)
  const [tab, setTab] = useState(0)

  useEffect(() => { dispatch(fetchVendorById(id)) }, [dispatch, id])

  if (loading && !vendor) return <PageLoader />
  if (!vendor) return <Alert severity="error">Vendor not found.</Alert>

  return (
    <Box>
      <PageHeader
        title={vendor.name}
        subtitle={`${vendor.category} · ${vendor.country}`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Vendors', href: '/vendors' }, { label: vendor.name }]}
        actions={<Button startIcon={<ArrowBack />} variant="outlined" size="small" onClick={() => navigate('/vendors')}>Back</Button>}
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
                <Tab label="Basic Details" />
                <Tab label="Contacts" />
                <Tab label="Documents" />
                <Tab label="Risk Information" />
              </Tabs>
            </Box>
            <CardContent>
              <TabPanel value={tab} index={0}>
                <Grid container spacing={2}>
                  {[
                    ['Vendor Name', vendor.name], ['Category', vendor.category],
                    ['Status', vendor.status, true], ['Risk Level', vendor.riskLevel, true],
                    ['Country', vendor.country], ['Email', vendor.email],
                    ['Phone', vendor.phone], ['Registration No.', vendor.registrationNumber],
                    ['Tax ID', vendor.taxId], ['Contract Expiry', new Date(vendor.contractExpiry).toLocaleDateString()],
                  ].map(([label, val, isChip]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                      {isChip ? <Box><StatusChip status={val} /></Box> : <Typography variant="body2">{val}</Typography>}
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Certifications</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {vendor.certifications?.length ? vendor.certifications.map((c) => (
                        <Chip key={c} label={c} size="small" color="primary" variant="outlined" />
                      )) : <Typography variant="body2" color="text.secondary">None</Typography>}
                    </Box>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tab} index={1}>
                {vendor.contacts?.map((c, i) => (
                  <Box key={i} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{c.email} · {c.phone}</Typography>
                  </Box>
                ))}
              </TabPanel>

              <TabPanel value={tab} index={2}>
                {vendor.documents?.map((d) => (
                  <Box key={d.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{d.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{d.type} · Expires {new Date(d.expiry).toLocaleDateString()}</Typography>
                    </Box>
                    <StatusChip status={d.status} />
                  </Box>
                ))}
              </TabPanel>

              <TabPanel value={tab} index={3}>
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>Overall Risk Level</Typography>
                    <StatusChip status={vendor.riskLevel} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">Compliance Score</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                    <LinearProgress
                      variant="determinate" value={vendor.complianceScore}
                      color={vendor.complianceScore >= 80 ? 'success' : vendor.complianceScore >= 60 ? 'warning' : 'error'}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" fontWeight={700}>{vendor.complianceScore}%</Typography>
                  </Box>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Quick Summary" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }} />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box><Typography variant="caption" color="text.secondary">Annual Spend</Typography><Typography variant="h6" fontWeight={700}>${(vendor.annualSpend / 1000).toFixed(0)}K</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Last Review</Typography><Typography variant="body2">{new Date(vendor.lastReview).toLocaleDateString()}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Compliance Score</Typography><Typography variant="body2" fontWeight={700} color={vendor.complianceScore >= 80 ? 'success.main' : 'warning.main'}>{vendor.complianceScore}%</Typography></Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default VendorProfile
