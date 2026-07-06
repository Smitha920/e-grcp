import React, { useEffect, useCallback, useState } from 'react'
import {
  Box, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  InputAdornment, IconButton, Stack
} from '@mui/material'
import { Add, Search, FileDownload } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchRequests, setFilters, setPagination,
  selectRequests, selectProcurementLoading, selectProcurementFilters, selectProcurementPagination
} from '../../store/slices/procurementSlice'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import StatusChip from '../../components/common/StatusChip'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected', 'escalated']
const PRIORITY_COLORS = { critical: 'error', high: 'warning', medium: 'info', low: 'default' }

function ProcurementList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const requests = useSelector(selectRequests)
  const loading = useSelector(selectProcurementLoading)
  const filters = useSelector(selectProcurementFilters)
  const pagination = useSelector(selectProcurementPagination)
  const [search, setSearch] = useState(filters.search)

  const load = useCallback(() => {
    dispatch(fetchRequests({ ...filters, page: pagination.page, pageSize: pagination.pageSize }))
  }, [dispatch, filters, pagination.page, pagination.pageSize])

  useEffect(() => { load() }, [load])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search }))
  }

  const columns = [
    { id: 'id', label: 'Request ID', width: 120, sortable: true },
    { id: 'title', label: 'Title', minWidth: 200, sortable: true },
    { id: 'status', label: 'Status', width: 120, render: (val) => <StatusChip status={val} /> },
    { id: 'priority', label: 'Priority', width: 100, render: (val) => <StatusChip status={val} /> },
    {
      id: 'amount', label: 'Amount', width: 130, align: 'right',
      render: (val, row) => `${row.currency} ${val?.toLocaleString()}`
    },
    { id: 'requestedBy', label: 'Requested By', width: 150, render: (val) => val?.name },
    { id: 'createdAt', label: 'Date', width: 110, render: (val) => new Date(val).toLocaleDateString() },
  ]

  return (
    <Box>
      <PageHeader
        title="Procurement Workspace"
        subtitle="Manage and track all procurement requests"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Procurement' }]}
        actions={
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/procurement/new')}>
            New Request
          </Button>
        }
      />

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          <TextField
            size="small"
            placeholder="Search requests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment>,
            }}
            sx={{ flexGrow: 1, maxWidth: 360 }}
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton title="Export CSV" sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <FileDownload />
        </IconButton>
      </Stack>

      <DataTable
        columns={columns}
        rows={requests}
        loading={loading}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPageChange={(p) => dispatch(setPagination({ page: p }))}
        onPageSizeChange={(ps) => dispatch(setPagination({ pageSize: ps }))}
        emptyMessage="No procurement requests found."
      />
    </Box>
  )
}

export default ProcurementList
