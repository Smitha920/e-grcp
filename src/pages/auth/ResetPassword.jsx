import React from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material'
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice'

const schema = yup.object({
  password: yup.string().min(8, 'At least 8 characters').required('Password is required')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Please confirm password'),
})

function ResetPassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [success, setSuccess] = React.useState(false)
  const [showPwd, setShowPwd] = React.useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    const token = searchParams.get('token') || 'demo-token'
    const result = await dispatch(resetPassword({ token, password: data.password }))
    if (resetPassword.fulfilled.match(result)) setSuccess(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#EEF2F7', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            {success ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CheckCircle sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>Password Reset Successfully</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You can now sign in with your new password.
                </Typography>
                <Button variant="contained" fullWidth onClick={() => navigate('/login')}>Sign In Now</Button>
              </Box>
            )  : (
              <>
                <Typography variant="h6" fontWeight={700} gutterBottom>Set a new password</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Must be at least 8 characters with uppercase and numbers.</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <TextField
                    fullWidth label="New Password" type={showPwd ? 'text' : 'password'} size="small" sx={{ mb: 2 }}
                    InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }}
                    {...register('password')} error={!!errors.password} helperText={errors.password?.message}
                  />
                  <TextField
                    fullWidth label="Confirm Password" type="password" size="small" sx={{ mb: 2 }}
                    {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
                  />
                  <Button type="submit" variant="contained" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Reset Password'}
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ResetPassword
