import React, { useEffect, useCallback } from 'react'
import {
  Box, Grid, Button, TextField, MenuItem, FormControl, InputLabel, Select,
  Card, CardContent, Typography, Stack, InputAdornment, Avatar, Chip
} from '@mui/material'
import { Search, Business } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchVendors, fetchVendorStats, setVendorFilters,
  selectVendors, selectVendorStats, selectVendorLoading, selectVendorFilters
} from '../../store/slices/vendorSlice'
import PageHeader from '../../components/common/PageHeader'
import KpiCard from '../../components/common/KpiCard'
import StatusChip from '../../components/common/StatusChip'
import DataTable from '../../components/common/DataTable'

const RISK_COLORS = { low: 'success', medium: 'warning', high: 'error' }

function VendorList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const vendors = useSelector(selectVendors)
  const stats = useSelector(selectVendorStats)
  const loading = useSelector(selectVendorLoading)
  const filters = useSelector(selectVendorFilters)

  useEffect(() => {
    dispatch(fetchVendors(filters))
    dispatch(fetchVendorStats())
  }, [dispatch, filters])

  const columns = [
    {
      id: 'name', label: 'Vendor', minWidth: 200,
      render: (val, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.8rem' }}>
            {val?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>{val}</Typography>
            <Typography variant="caption" color="text.secondary">{row.category}</Typography>
          </Box>
        </Box>
      )
    },
    { id: 'status', label: 'Status', width: 130, render: (val) => <StatusChip status={val} /> },
    { id: 'riskLevel', label: 'Risk', width: 100, render: (val) => <Chip label={val?.toUpperCase()} size="small" color={RISK_COLORS[val]} /> },
    { id: 'country', label: 'Country', width: 130 },
    { id: 'complianceScore', label: 'Compliance', width: 110, align: 'center', render: (val) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" fontWeight={600} color={val >= 80 ? 'success.main' : val >= 60 ? 'warning.main' : 'error.main'}>{val}%</Typography>
      </Box>
    )},
    { id: 'annualSpend', label: 'Annual Spend', width: 130, align: 'right', render: (val) => `$${(val / 1000).toFixed(0)}K` },
  ]

  return (
    <Box>
      <PageHeader
        title="Vendor Governance"
        subtitle="Monitor and manage your vendor portfolio"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Vendors' }]}
      />

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total Vendors', value: stats.total, color: 'primary' },
          { title: 'Active', value: stats.active, color: 'success' },
          { title: 'Under Review', value: stats.underReview, color: 'warning' },
          { title: 'High Risk', value: stats.highRisk, color: 'error' },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.title}>
            <KpiCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
        <TextField
          size="small"
          placeholder="Search vendors…"
          value={filters.search}
          onChange={(e) => dispatch(setVendorFilters({ search: e.target.value }))}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> }}
          sx={{ flexGrow: 1, maxWidth: 320 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={filters.status} onChange={(e) => dispatch(setVendorFilters({ status: e.target.value }))}>
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="under_review">Under Review</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Risk Level</InputLabel>
          <Select label="Risk Level" value={filters.riskLevel} onChange={(e) => dispatch(setVendorFilters({ riskLevel: e.target.value }))}>
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <DataTable columns={columns} rows={vendors} loading={loading} total={vendors.length} emptyMessage="No vendors found." />
    </Box>
  )
}

export default VendorList
