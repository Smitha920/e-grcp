import React, { useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Link, Alert, InputAdornment, IconButton, CircularProgress,
  Divider, Chip, useTheme
} from '@mui/material'
import { Visibility, VisibilityOff, Lock, Email, Security } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { loginUser, clearError, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice'

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const DEMO_ACCOUNTS = [
  { email: 'smitha92005@gmail.com', password: 'Admin@123', role: 'Admin' },
  { email: 'm.chen@company.com', password: 'Manager@123', role: 'Manager' },
  { email: 'e.rodriguez@company.com', password: 'Employee@123', role: 'Employee' },
  { email: 'd.park@company.com', password: 'Auditor@123', role: 'Auditor' },
]

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = React.useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  const fillDemo = (account) => {
    setValue('email', account.email)
    setValue('password', account.password)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#EEF2F7',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2,
            }}
          >
            <Security sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            e-GRCP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise Governance, Risk, Compliance &amp; Procurement
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Sign in to your account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your credentials to access the platform
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                autoFocus
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                size="small"
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Link component={RouterLink} to="/forgot-password" variant="caption" underline="hover">
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Sign In'}
              </Button>
            </Box>

            {/* Demo accounts */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">Demo Accounts</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <Chip
                  key={acc.role}
                  label={acc.role}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => fillDemo(acc)}
                  color="primary"
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 2 }}>
          © {new Date().getFullYear()} e-GRCP. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default Login
