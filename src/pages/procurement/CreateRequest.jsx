import React from 'react'
import {
  Box, Card, CardContent, Grid, TextField, MenuItem, Button,
  Typography, Divider, Alert, CircularProgress
} from '@mui/material'
import { ArrowBack, Send } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createRequest, selectProcurementLoading } from '../../store/slices/procurementSlice'
import { selectUser } from '../../store/slices/authSlice'
import { showAlert } from '../../store/slices/uiSlice'
import PageHeader from '../../components/common/PageHeader'

const schema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').required('Title is required'),
  description: yup.string().min(20, 'Provide more detail (min 20 chars)').required('Description is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  currency: yup.string().required('Currency is required'),
  category: yup.string().required('Category is required'),
  priority: yup.string().required('Priority is required'),
  department: yup.string().required('Department is required'),
  vendorName: yup.string().required('Vendor name is required'),
})

const CATEGORIES = ['IT Hardware', 'Software', 'Consulting', 'Logistics', 'Facilities', 'Events', 'Services', 'Other']
const PRIORITIES = ['low', 'medium', 'high', 'critical']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY']
const DEPARTMENTS = ['IT', 'Finance', 'HR', 'Marketing', 'Operations', 'Legal', 'IT Security']

function CreateRequest() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectProcurementLoading)
  const user = useSelector(selectUser)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { currency: 'USD', priority: 'medium', department: user?.department || '' },
  })

  const onSubmit = async (data) => {
    const result = await dispatch(createRequest({
      ...data,
      vendor: { name: data.vendorName },
      requestedBy: { id: user?.id, name: user?.name, department: user?.department },
    }))
    if (createRequest.fulfilled.match(result)) {
      dispatch(showAlert({ type: 'success', message: 'Procurement request submitted successfully!' }))
      navigate('/procurement')
    }
  }

  return (
    <Box>
      <PageHeader
        title="New Procurement Request"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Procurement', href: '/procurement' }, { label: 'New Request' }]}
        actions={
          <Button startIcon={<ArrowBack />} variant="outlined" size="small" onClick={() => navigate('/procurement')}>
            Back
          </Button>
        }
      />

      <Card sx={{ maxWidth: 800 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Request Details</Typography>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField fullWidth label="Request Title" size="small"
                  {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Description" size="small"
                  {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Amount" type="number" size="small"
                  {...register('amount')} error={!!errors.amount} helperText={errors.amount?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="currency" control={control} render={({ field }) => (
                  <TextField {...field} select fullWidth label="Currency" size="small">
                    {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="category" control={control} render={({ field }) => (
                  <TextField {...field} select fullWidth label="Category" size="small" error={!!errors.category} helperText={errors.category?.message}>
                    {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="priority" control={control} render={({ field }) => (
                  <TextField {...field} select fullWidth label="Priority" size="small">
                    {PRIORITIES.map((p) => <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="department" control={control} render={({ field }) => (
                  <TextField {...field} select fullWidth label="Department" size="small" error={!!errors.department} helperText={errors.department?.message}>
                    {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Vendor Name" size="small"
                  {...register('vendorName')} error={!!errors.vendorName} helperText={errors.vendorName?.message} />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => navigate('/procurement')}>Cancel</Button>
                  <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Send />} disabled={loading}>
                    Submit Request
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CreateRequest
