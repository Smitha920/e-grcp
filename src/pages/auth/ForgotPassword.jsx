import React from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, CircularProgress } from '@mui/material'
import { ArrowBack, MarkEmailRead } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { forgotPassword, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice'

const schema = yup.object({ email: yup.string().email('Enter a valid email').required('Email is required') })

function ForgotPassword() {
  const dispatch = useDispatch()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [sent, setSent] = React.useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    const result = await dispatch(forgotPassword(data.email))
    if (forgotPassword.fulfilled.match(result)) setSent(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#EEF2F7', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            {sent ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <MarkEmailRead sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>Check your inbox</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  We've sent password reset instructions to your email address.
                </Typography>
                <Button component={RouterLink} to="/login" variant="contained" fullWidth>Back to Sign In</Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" fontWeight={700} gutterBottom>Forgot your password?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Enter your email address and we'll send you a reset link.
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <TextField
                    fullWidth label="Email Address" type="email" size="small" sx={{ mb: 2 }}
                    {...register('email')} error={!!errors.email} helperText={errors.email?.message}
                  />
                  <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mb: 2 }}>
                    {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Send Reset Link'}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <ArrowBack fontSize="small" /> Back to Sign In
                    </Link>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ForgotPassword
